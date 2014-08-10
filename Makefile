MOD = graphlib

NPM = npm
BROWSERIFY = ./node_modules/browserify/bin/cmd.js
ISTANBUL = ./node_modules/istanbul/lib/cli.js
JSHINT = ./node_modules/jshint/bin/jshint
MOCHA = ./node_modules/mocha/bin/_mocha
UGLIFY = ./node_modules/uglify-js/bin/uglifyjs

BUILD_DIR = build
DIST_DIR = dist
COVERAGE_DIR = $(BUILD_DIR)/coverage
DOC_DIR = $(BUILD_DIR)/doc
DOC_STATIC_DIR = $(DOC_DIR)/static

SRC_FILES = index.js lib/version.js $(shell find lib -type f -name '*.js')
TEST_FILES = $(shell find test -type f -name '*.js')
BUILD_FILES = $(addprefix $(BUILD_DIR)/, $(MOD).js $(MOD).min.js)

DOC_JADE:=$(wildcard doc/*.jade)
DOC_JADE_OUT:=$(addprefix $(BUILD_DIR)/, $(DOC_JADE:.jade=.html))

DOC_STATIC:=$(wildcard doc/static/*)
DOC_STATIC_OUT:=$(addprefix $(BUILD_DIR)/, $(DOC_STATIC))

DIRS =\
	$(BUILD_DIR) \
	$(DOC_DIR) \
	$(DOC_STATIC_DIR)

.PHONY: all dist release clean

all: dist

lib/version.js: package.json
	src/version.js > $@

$(DIRS):
	mkdir -p $@

$(BUILD_DIR)/$(MOD).js: browser.js $(SRC_FILES) $(TEST_FILES) node_modules | $(BUILD_DIR)
	$(ISTANBUL) cover $(MOCHA) --dir $(COVERAGE_DIR) -- $(TEST_FILES) || $(MOCHA) $(TEST_FILES)
	$(JSHINT) $(filter-out node_modules, $?)
	$(BROWSERIFY) $< > $@

$(BUILD_DIR)/$(MOD).min.js: $(BUILD_DIR)/$(MOD).js
	$(UGLIFY) $(UGLIFY_OPTS) $< > $@

$(DOC_JADE_OUT): $(DOC_JADE) | $(DOC_DIR)
	src/docgen.js $^ > $@

$(DOC_STATIC_OUT): $(DOC_STATIC) | $(DOC_STATIC_DIR)
	cp -r $^ $(DOC_STATIC_DIR)

dist: $(BUILD_FILES) $(DOC_JADE_OUT) $(DOC_STATIC_OUT)
	rm -rf $(DIST_DIR)
	mkdir -p $(DIST_DIR)
	cp $(BUILD_FILES) $(DIST_DIR)
	cp -r $(DOC_DIR) $(DIST_DIR)

release: dist
	src/release/release.sh $(MOD) $(DIST_DIR)

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR)

node_modules: package.json
	$(NPM) install
	touch $@
