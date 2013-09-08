NODE?=node
NPM?=npm
BROWSERIFY?=node_modules/browserify/bin/cmd.js
MOCHA?=node_modules/mocha/bin/mocha
MOCHA_OPTS?=
JS_COMPILER=node_modules/uglify-js/bin/uglifyjs
JS_COMPILER_OPTS?=--no-seqs

MODULE=graphlib

# There does not appear to be an easy way to define recursive expansion, so
# we do our own expansion a few levels deep.
JS_SRC:=$(wildcard lib/*.js lib/*/*.js lib/*/*/*.js)
JS_TEST:=$(wildcard test/*.js test/*/*.js test/*/*/*.js)

DOC_JADE:=$(wildcard doc/*.jade)
DOC_JADE_OUT:=$(addprefix out/dist/, $(DOC_JADE:.jade=.html))

DOC_STATIC:=$(wildcard doc/static/*)
DOC_STATIC_OUT:=$(addprefix out/dist/, $(DOC_STATIC))

BENCH_FILES?=$(wildcard bench/graphs/*)

OUT_DIRS=out out/dist out/dist/doc out/dist/doc/static

.PHONY: all release dist doc test coverage clean clean-doc fullclean

all: dist doc test coverage

release: all
	src/release/release.sh $(MODULE) out/dist

dist: out/dist/$(MODULE).js out/dist/$(MODULE).min.js

doc: node_modules src/docgen.js clean-doc out/dist/doc out/dist/doc/static $(DOC_JADE_OUT) $(DOC_STATIC_OUT)

test: out/dist/$(MODULE).js $(JS_TEST) $(JS_SRC)
	$(NODE) $(MOCHA) $(JS_TEST) $(MOCHA_OPTS)

coverage: out/coverage.html

clean:
	rm -f lib/version.js
	rm -rf out

clean-doc:
	rm -rf out/dist/doc

fullclean: clean
	rm -rf node_modules

$(OUT_DIRS):
	mkdir -p $@

out/dist/$(MODULE).js: browser.js Makefile out/dist node_modules lib/version.js $(JS_SRC)
	$(NODE) $(BROWSERIFY) $< > $@

out/dist/$(MODULE).min.js: out/dist/$(MODULE).js
	$(NODE) $(JS_COMPILER) $(JS_COMPILER_OPTS) $< > $@

$(DOC_JADE_OUT): $(DOC_JADE)
	$(NODE) src/docgen.js $< > $@

out/dist/doc/static/%: doc/static/%
	@cp $< $@

out/coverage.html: out/dist/$(MODULE).js $(JS_TEST) $(JS_SRC)
	$(NODE) $(MOCHA) $(JS_TEST) --require blanket -R html-cov > $@

lib/version.js: src/version.js package.json
	$(NODE) $< > $@

node_modules: package.json
	$(NPM) install
