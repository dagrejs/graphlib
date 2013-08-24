NODE?=node
NPM?=npm
MOCHA?=node_modules/mocha/bin/mocha
MOCHA_OPTS?=
JS_COMPILER=node_modules/uglify-js/bin/uglifyjs
JS_COMPILER_OPTS?=--no-seqs

MAIN_JS=graphlib.js
MAIN_MIN_JS=graphlib.min.js

# There does not appear to be an easy way to define recursive expansion, so
# we do our own expansion a few levels deep.
JS_TEST:=$(wildcard test/*.js test/*/*.js test/*/*/*.js)

all: $(MAIN_MIN_JS) test

$(MAIN_MIN_JS): $(MAIN_JS)
	@rm -f $@
	$(NODE) $(JS_COMPILER) $(JS_COMPILER_OPTS) $< > $@
	@chmod a-w $@

lib/version.js: src/version.js package.json
	$(NODE) src/version.js > $@

node_modules: package.json
	$(NPM) install

.PHONY: test
test: $(MAIN_JS) $(JS_TEST)
	$(NODE) $(MOCHA) $(MOCHA_OPTS) $(JS_TEST)

clean:
	rm -f $(MAIN_MIN_JS)
