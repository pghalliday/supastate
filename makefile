.PHONY: \
	all \
	clean \
	build \
	reset \
	test \
	test_all \
	clean_migrations \
	clean_tests \
	npm_build \
	npm_clean \
	npm_install

SUPABASE_DIR := supabase
SUPABASE_SRC_DIR := $(SUPABASE_DIR)/src
TEST_DIR := test

all: clean reset test

clean: clean_migrations clean_tests

build:
	$(MAKE) -C $(SUPABASE_SRC_DIR) build

reset: build
	supabase db reset

test: npm_build
	$(MAKE) -C $(TEST_DIR) test

test_all: npm_build
	$(MAKE) -C $(TEST_DIR) test_all

clean_migrations:
	$(MAKE) -C $(SUPABASE_SRC_DIR) clean

clean_tests: npm_clean
	$(MAKE) -C $(TEST_DIR) clean_supastate

npm_build:
	npm run buildIncremental
	npm --prefix test/util/ts run buildIncremental

npm_clean:
	npm run clean
	npm --prefix test/util/ts run clean

npm_install:
	npm install
	npm --prefix test/util/ts install
