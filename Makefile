NODE = node
NPM = npm
GRUNT = grunt

GRUNT_TARGETS = default release build dist doc test jshint watch clean

.PHONY: $(GRUNT_TARGETS) fullclean

$(GRUNT_TARGETS): node_modules
	$(GRUNT) $@

fullclean: clean
	rm -rf node_modules

node_modules: package.json
	$(NPM) install
