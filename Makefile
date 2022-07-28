MOD = graphlib

NPM = npm
BROWSERIFY = ./node_modules/browserify/bin/cmd.js
JSHINT = ./node_modules/jshint/bin/jshint
ESLINT = ./node_modules/eslint/bin/eslint.js
KARMA = ./node_modules/karma/bin/karma
UGLIFY = ./node_modules/uglify-js/bin/uglifyjs
TSC = ./node_modules/typescript/bin/tsc

JSHINT_OPTS = --reporter node_modules/jshint-stylish/index.js

BUILD_DIR = build

SRC_FILES = $(shell find lib -type f -name '*.js')
BUILD_FILES = $(addprefix $(BUILD_DIR)/, \
						$(MOD).js $(MOD).min.js \
						$(MOD).core.js $(MOD).core.min.js)

DIRS = $(BUILD_DIR)

.PHONY: all bench clean browser-test unit-test test dist

all: compile unit-test lint

bench: compile unit-test lint
	@src/bench.js

compile:
	@$(TSC)

lib/version.ts: package.json
	@src/release/make-version.ts > $@

$(DIRS):
	@mkdir -p $@

test: unit-test browser-test

unit-test: $(BUILD_DIR)
	@$(NPM) test

browser-test: $(BUILD_DIR)/$(MOD).js $(BUILD_DIR)/$(MOD).core.js
	$(KARMA) start --single-run $(KARMA_OPTS)
	$(KARMA) start karma.conf.js --single-run $(KARMA_OPTS)

bower.json: package.json src/release/make-bower.json.js
	@src/release/make-bower.json.js > $@

lint:
	@$(JSHINT) $(JSHINT_OPTS) $(filter-out node_modules, $?)
	@$(ESLINT) $(SRC_FILES)
	@$(TSC) --noEmit

$(BUILD_DIR)/$(MOD).js:  unit-test
	@$(NPM) run build-dev

$(BUILD_DIR)/$(MOD).min.js:
	@$(NPM) run build-prod

$(BUILD_DIR)/$(MOD).core.js: $(SRC_FILES) | unit-test
	@$(BROWSERIFY) $< > $@ --no-bundle-external -s graphlib

$(BUILD_DIR)/$(MOD).core.min.js: $(BUILD_DIR)/$(MOD).core.js
	@$(UGLIFY) $< --comments '@license' > $@

dist: $(BUILD_FILES) | bower.json test
	@rm -rf $@
	@mkdir -p $@
	@cp $^ dist

release: dist
	@echo
	@echo Starting release...
	@echo
	@src/release/release.sh $(MOD) dist

clean:
	rm -rf $(BUILD_DIR)

node_modules: package.json
	@$(NPM) install
	@touch $@
