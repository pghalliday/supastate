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
INTEGRATION_DIR := integration
TEST_DIR := $(INTEGRATION_DIR)/test

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
	$(MAKE) -C $(TEST_DIR) clean

npm_build:
	npm --prefix supastate run buildIncremental
	npm --prefix supatest run buildIncremental
	npm --prefix supasql run buildIncremental

npm_clean:
	npm --prefix supastate run clean
	npm --prefix supatest run clean
	npm --prefix supasql run clean

npm_install:
	npm --prefix supastate install
	npm --prefix supatest install
	npm --prefix supasql install
	npm --prefix $(INTEGRATION_DIR) install
