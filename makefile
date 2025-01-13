.PHONY: \
	all \
	clean \
	test \
	test_all

TEST_DIR := test

all: clean test

test:
	npm run buildIncremental
	$(MAKE) -C $(TEST_DIR) test

test_all:
	npm run buildIncremental
	$(MAKE) -C $(TEST_DIR) test_all

clean:
	$(MAKE) -C $(TEST_DIR) clean_supastate
