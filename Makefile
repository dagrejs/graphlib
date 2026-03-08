MOD = graphlib

NPM = npm

DIST_DIR = dist

SRC_FILES = index.ts lib/version.ts $(shell find lib -type f -name '*.ts')
TEST_FILES = $(shell find test -type f -name '*.ts')
BUILD_FILES = $(addprefix $(DIST_DIR)/, $(MOD).cjs.js $(MOD).esm.js $(MOD).min.js $(MOD).js)

.PHONY: all bench clean test dist lint build release node_modules

all: build test

bench: build
	@$(NPM) run bench

lib/version.ts: package.json
	@$(NPM) run version:make

lint:
	@echo "Running lint check via npm (ESLint)..."
	@$(NPM) run lint

build:
	@echo "Running project build via npm (esbuild + tsc)..."
	@$(NPM) run build

test: lint
	@$(NPM) run test

dist: build test
	@echo "Dist files are built in 'dist/' by the 'build' target."

release: dist
	@echo
	@echo Starting release...
	@echo
	@src/release/release.sh $(MOD) dist

clean:
	rm -rf build dist coverage

node_modules: package.json
	@$(NPM) install
	@touch $@
