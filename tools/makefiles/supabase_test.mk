.PHONY: \
	test \
	test_all \
	clean_test

include $(TOOLS_DIR)/makefiles/supabase.mk

SUPABASE_TEST_DIR := $(SUPABASE_BUILD_DIR)/test
SUPABASE_TEST_REPORT := $(SUPABASE_TEST_DIR)/report.txt

test: $(SUPABASE_TEST_REPORT)

test_all: build
	supabase test db | tee $(SUPABASE_TEST_REPORT)

clean_test: clean
	@-rm -rf $(SUPABASE_TEST_DIR)

$(SUPABASE_TEST_REPORT): $(SUPABASE_OUTPUT_FILES) | $(SUPABASE_TEST_DIR)
	$(TOOLS_DIR)/scripts/supabase_test.sh $? | tee $(SUPABASE_TEST_REPORT)

$(SUPABASE_TEST_DIR):
	@mkdir -p $@
