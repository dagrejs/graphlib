NODE = node
NPM = npm
GRUNT = grunt

DOC_JADE:=$(wildcard doc/*.jade)
DOC_JADE_OUT:=$(addprefix dist/, $(DOC_JADE:.jade=.html))

DOC_STATIC:=$(wildcard doc/static/*)
DOC_STATIC_OUT:=$(addprefix dist/, $(DOC_STATIC))

OUT_DIRS=dist/doc dist/doc/static

GRUNT_TARGETS = default release build dist test jshint watch clean

.PHONY: $(GRUNT_TARGETS) doc clean-doc fullclean

$(GRUNT_TARGETS): node_modules
	$(GRUNT) $@

doc: node_modules src/docgen.js clean-doc dist/doc dist/doc/static $(DOC_JADE_OUT) $(DOC_STATIC_OUT)

clean-doc:
	rm -rf dist/doc

fullclean: clean
	rm -rf node_modules

$(OUT_DIRS):
	mkdir -p $@

$(DOC_JADE_OUT): $(DOC_JADE)
	$(NODE) src/docgen.js $< > $@

dist/doc/static/%: doc/static/%
	@cp $< $@

node_modules: package.json
	$(NPM) install
