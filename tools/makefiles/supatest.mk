.PHONY: \
	clean \
	build \
	test \
	test_all

ifndef SUPATEST_OUTPUT_DIR
$(error SUPATEST_OUTPUT_DIR is not set)
endif

ifndef TOOLS_DIR
$(error TOOLS_DIR is not set)
endif

# We want to search all directories and sub directories for entry points
SUPATEST_INPUT_DIRS := $(shell find . -type d | sed 's|^\./||')

SUPATEST_BUILD_DIR := .build
SUPATEST_DEPENDENCY_DIR := $(SUPATEST_BUILD_DIR)/dependencies
SUPATEST_RULES_DIR := $(SUPATEST_BUILD_DIR)/rules
SUPATEST_JS_RULES_FILE := $(SUPATEST_BUILD_DIR)/js.mk
SUPATEST_SQL_RULES_FILE := $(SUPATEST_BUILD_DIR)/sql.mk
SUPATEST_REPORT_RULES_FILE := $(SUPATEST_BUILD_DIR)/report.mk
SUPATEST_TEST_DIR := $(SUPATEST_BUILD_DIR)/test
SUPATEST_TEST_REPORT := $(SUPATEST_TEST_DIR)/report.txt

SUPATEST_ENTRY_FILE := supatest.json

SUPATEST_INPUT_FILES := \
	$(sort \
	$(foreach dir, $(SUPATEST_INPUT_DIRS), \
	$(wildcard \
		$(dir)/$(SUPATEST_ENTRY_FILE))))
SUPATEST_LIB_DIRS := \
	$(patsubst \
		%/$(SUPATEST_ENTRY_FILE), \
		%/lib, \
		$(SUPATEST_INPUT_FILES))
SUPATEST_OUTPUT_FILES := \
	$(patsubst \
		%/$(SUPATEST_ENTRY_FILE), \
		$(SUPATEST_OUTPUT_DIR)/%.sql, \
		$(SUPATEST_INPUT_FILES))
SUPATEST_DEPENDENCY_FILES := \
	$(patsubst \
		%/$(SUPATEST_ENTRY_FILE), \
		$(SUPATEST_DEPENDENCY_DIR)/%.d, \
		$(SUPATEST_INPUT_FILES))
SUPATEST_DEPENDENCY_DIRS := \
	$(patsubst %/, %, \
	$(sort \
	$(dir \
		$(SUPATEST_DEPENDENCY_FILES))))

build: $(SUPATEST_OUTPUT_FILES)

clean:
	@-rm -rf $(SUPATEST_BUILD_DIR)
	@-rm -rf $(SUPATEST_LIB_DIRS)
	@-rm -rf $(SUPATEST_OUTPUT_DIR)
	@-rm -rf $(SUPATEST_TEST_DIR)


$(SUPATEST_DEPENDENCY_FILES):

include $(wildcard $(SUPATEST_DEPENDENCY_FILES))

test: $(SUPATEST_TEST_REPORT)

$(SUPATEST_JS_RULES_FILE) $(SUPATEST_SQL_RULES_FILE) $(SUPATEST_REPORT_RULES_FILE) &: $(SUPATEST_INPUT_FILES)
	npx supatest createMakefileRules -j $(SUPATEST_JS_RULES_FILE) -s $(SUPATEST_SQL_RULES_FILE) -r $(SUPATEST_REPORT_RULES_FILE) -o $(SUPATEST_OUTPUT_DIR) -c $^

ifneq (clean,$(filter clean,$(MAKECMDGOALS)))
include $(SUPATEST_JS_RULES_FILE)
include $(SUPATEST_SQL_RULES_FILE)
include $(SUPATEST_REPORT_RULES_FILE)
endif

test_all: build
	supabase test db | tee $(SUPATEST_TEST_REPORT)

$(SUPATEST_TEST_DIR) $(SUPATEST_DEPENDENCY_DIRS):
	@mkdir -p $@
