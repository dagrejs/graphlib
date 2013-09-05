NODE?=node
NPM?=npm
BROWSERIFY?=node_modules/browserify/bin/cmd.js
MOCHA?=node_modules/mocha/bin/mocha
MOCHA_OPTS?=
JS_COMPILER=node_modules/uglify-js/bin/uglifyjs
JS_COMPILER_OPTS?=--no-seqs
DOCGEN=node_modules/dox-foundation/bin/dox-foundation

MODULE=graphlib
DOC=$(DIST)/doc

# There does not appear to be an easy way to define recursive expansion, so
# we do our own expansion a few levels deep.
JS_SRC:=$(wildcard lib/*.js lib/*/*.js lib/*/*/*.js)
JS_TEST:=$(wildcard test/*.js test/*/*.js test/*/*/*.js)

OUT_DIRS=out out/dist

.PHONY: all release dist doc test coverage clean fullclean

all: dist doc test coverage

release: all
	src/release/release.sh $(MODULE) out/dist

dist: out/dist/$(MODULE).js out/dist/$(MODULE).min.js

doc: out/dist/doc

test: out/dist/$(MODULE).js $(JS_TEST)
	$(NODE) $(MOCHA) $(JS_TEST) $(MOCHA_OPTS)

coverage: out/coverage.html

clean:
	rm -f lib/version.js
	rm -rf out

fullclean: clean
	rm -rf node_modules

$(OUT_DIRS):
	mkdir -p $@

out/dist/$(MODULE).js: out/dist Makefile node_modules browser.js lib/version.js $(JS_SRC)
	$(NODE) $(BROWSERIFY) browser.js > $@

out/dist/$(MODULE).min.js: out/dist/$(MODULE).js
	$(NODE) $(JS_COMPILER) $(JS_COMPILER_OPTS) $< > $@

out/dist/doc: out/dist $(SRC_JS)
	@rm -rf doc $@
	mkdir doc
	$(NODE) $(DOCGEN) --ignore lib/version.js --source lib --target doc
	mv doc $@ 

out/coverage.html: $(MODULE_JS) $(JS_TEST)
	$(NODE) $(MOCHA) $(JS_TEST) --require blanket -R html-cov > $@

lib/version.js: src/version.js package.json
	$(NODE) src/version.js > $@

node_modules: package.json
	$(NPM) install
