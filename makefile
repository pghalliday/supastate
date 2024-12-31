.PHONY: \
	all \
	clean \
	test \
	test_all

TEST_DIR := test

all: clean test

test:
	$(MAKE) -C $(TEST_DIR) test

test_all:
	$(MAKE) -C $(TEST_DIR) test_all

clean:
	$(MAKE) -C $(TEST_DIR) clean_supastate
