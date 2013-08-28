NODE?=node
NPM?=npm
BROWSERIFY?=node_modules/browserify/bin/cmd.js
MOCHA?=node_modules/mocha/bin/mocha
MOCHA_OPTS?=
JS_COMPILER=node_modules/uglify-js/bin/uglifyjs
JS_COMPILER_OPTS?=--no-seqs
DOCGEN=node_modules/dox-foundation/bin/dox-foundation

DIST?=dist
MAIN_JS=$(DIST)/graphlib.js
MAIN_MIN_JS=$(DIST)/graphlib.min.js
DOC=$(DIST)/doc

# There does not appear to be an easy way to define recursive expansion, so
# we do our own expansion a few levels deep.
JS_SRC:=$(wildcard lib/*.js lib/*/*.js lib/*/*/*.js)
JS_TEST:=$(wildcard test/*.js test/*/*.js test/*/*/*.js)

.PHONY: all
all: $(MAIN_JS) $(MAIN_MIN_JS) $(DOC) test

.PHONY: init
init:
	rm -rf $(DIST)
	mkdir -p $(DIST)

.PHONY: all
release: all
	src/release/release.sh

$(MAIN_JS): init Makefile browser.js lib/version.js node_modules $(JS_SRC)
	@rm -f $@
	$(NODE) $(BROWSERIFY) browser.js > $@
	@chmod a-w $@

$(MAIN_MIN_JS): $(MAIN_JS)
	@rm -f $@
	$(NODE) $(JS_COMPILER) $(JS_COMPILER_OPTS) $< > $@
	@chmod a-w $@

lib/version.js: src/version.js package.json
	$(NODE) src/version.js > $@

node_modules: package.json
	$(NPM) install

$(DOC): init $(JS_SRC)
	@rm -rf $@
	$(NODE) $(DOCGEN) --ignore lib/version.js --source lib --target $@

.PHONY: test
test: $(MAIN_JS) $(JS_TEST)
	$(NODE) $(MOCHA) $(MOCHA_OPTS) $(JS_TEST)

.PHONY: clean
clean:
	rm -f lib/version.js
	rm -rf $(DIST)

.PHONY: fullclean
fullclean: clean
	rm -rf node_modules
