NODE?=node
NPM?=npm
NODE_MODULES=node_modules
BROWSERIFY?=$(NODE_MODULES)/browserify/bin/cmd.js
MOCHA?=$(NODE_MODULES)/mocha/bin/mocha
MOCHA_OPTS?=
JS_COMPILER=$(NODE_MODULES)/uglify-js/bin/uglifyjs
JS_COMPILER_OPTS?=--no-seqs
DOCGEN=$(NODE_MODULES)/dox-foundation/bin/dox-foundation

MODULE=graphlib
DIST?=dist
MODULE_JS=$(DIST)/$(MODULE).js
MODULE_MIN_JS=$(DIST)/$(MODULE).min.js
DOC=$(DIST)/doc

# There does not appear to be an easy way to define recursive expansion, so
# we do our own expansion a few levels deep.
JS_SRC:=$(wildcard lib/*.js lib/*/*.js lib/*/*/*.js)
JS_TEST:=$(wildcard test/*.js test/*/*.js test/*/*/*.js)

.PHONY: all
all: $(MODULE_JS) $(MODULE_MIN_JS) $(DOC) test

.PHONY: init
init:
	rm -rf $(DIST)
	mkdir -p $(DIST)

.PHONY: all
release: all
	src/release/release.sh

$(MODULE_JS): init Makefile $(NODE_MODULES) browser.js lib/version.js $(JS_SRC)
	@rm -f $@
	$(NODE) $(BROWSERIFY) browser.js > $@
	@chmod a-w $@

$(MODULE_MIN_JS): $(MODULE_JS)
	@rm -f $@
	$(NODE) $(JS_COMPILER) $(JS_COMPILER_OPTS) $< > $@
	@chmod a-w $@

lib/version.js: src/version.js package.json
	$(NODE) src/version.js > $@

$(NODE_MODULES): package.json
	$(NPM) install

$(DOC): init $(JS_SRC)
	@rm -rf $@
	$(NODE) $(DOCGEN) --ignore lib/version.js --source lib --target $@

.PHONY: test
test: $(MODULE_JS) $(JS_TEST)
	$(NODE) $(MOCHA) $(MOCHA_OPTS) $(JS_TEST)

.PHONY: clean
clean:
	rm -f lib/version.js
	rm -rf $(DIST)

.PHONY: fullclean
fullclean: clean
	rm -rf $(NODE_MODULES)
