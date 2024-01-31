MOD = graphlib

NPM = npm
NYC = nyc
BROWSERIFY = ./node_modules/browserify/bin/cmd.js
JSHINT = ./node_modules/jshint/bin/jshint
ESLINT = ./node_modules/eslint/bin/eslint.js
KARMA = ./node_modules/karma/bin/karma
MOCHA = ./node_modules/mocha/bin/_mocha
UGLIFY = ./node_modules/uglify-js/bin/uglifyjs

JSHINT_OPTS = --reporter node_modules/jshint-stylish/index.js
MOCHA_OPTS = -R dot

BUILD_DIR = build
COVERAGE_DIR = ./.nyc_output
DIST_DIR = dist

# Why is this doubled up?
SRC_FILES = lib/index.js lib/version.js $(shell find lib -type f -name '*.js')
TEST_FILES = $(shell find test -type f -name '*.js' | grep -v 'bundle-test.js' | grep -v 'test-main.js')
BUILD_FILES = $(addprefix $(BUILD_DIR)/, \
						$(MOD).js $(MOD).min.js \
						$(MOD).core.js $(MOD).core.min.js)

DIRS = $(BUILD_DIR)

.PHONY: all bench clean browser-test unit-test test dist convert

all: unit-test lint

bench: unit-test lint
	@src/bench.js

lib/version.js: package.json
	@src/release/make-version.js > $@

$(DIRS):
	@mkdir -p $@

test: unit-test browser-test

unit-test: $(SRC_FILES) $(TEST_FILES) node_modules | $(BUILD_DIR)
	-$(NYC) $(MOCHA) --dir $(COVERAGE_DIR) -- $(MOCHA_OPTS) $(TEST_FILES) || $(MOCHA) $(MOCHA_OPTS) $(TEST_FILES)

browser-test: $(BUILD_DIR)/$(MOD).js $(BUILD_DIR)/$(MOD).core.js
	-$(KARMA) start --single-run $(KARMA_OPTS)
	-$(KARMA) start karma.core.conf.js --single-run $(KARMA_OPTS)

bower.json: package.json src/release/make-bower.json.js
	@src/release/make-bower.json.js > $@

lint:
	@$(JSHINT) $(JSHINT_OPTS) $(filter-out node_modules, $?)
	@$(ESLINT) $(SRC_FILES) $(TEST_FILES)

$(BUILD_DIR)/$(MOD).js: index.js $(SRC_FILES) | unit-test
	@$(BROWSERIFY) $< > $@ -s graphlib

$(BUILD_DIR)/$(MOD).min.js: $(BUILD_DIR)/$(MOD).js
	@$(UGLIFY) $< --comments '@license' > $@

$(BUILD_DIR)/$(MOD).core.js: index.js $(SRC_FILES) | unit-test
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

convert: mjs-lib/*.js mjs-lib/**/*.js
	rm -rf lib; mkdir lib
	for f in mjs-lib/**/*.js mjs-lib/*.js; do echo "$${f} > lib$${f/mjs-lib/}"; npx babel "$${f}" -o "lib$${f/mjs-lib/}"; done

