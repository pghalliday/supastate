.PHONY: \
	clean_supastate

include $(TOOLS_DIR)/makefiles/supabase_test.mk

SUPASTATE_BUILD_DIR := $(SUPABASE_BUILD_DIR)/supastate
SUPASTATE_DEPENDENCY_DIR := $(SUPASTATE_BUILD_DIR)/dependencies
SUPASTATE_RULES_DIR := $(SUPASTATE_BUILD_DIR)/rules
SUPASTATE_TS_DEPENDENCY_DIR := $(SUPASTATE_DEPENDENCY_DIR)/ts
SUPASTATE_SQL_DEPS_FILE := $(SUPASTATE_DEPENDENCY_DIR)/sql.d
SUPASTATE_SQL_RULES_FILE := $(SUPASTATE_RULES_DIR)/sql.mak

SUPASTATE_OUTPUTS_FILE := supastate.json

SUPASTATE_INPUT_FILES := \
	$(sort \
	$(foreach dir, $(SUPABASE_INPUT_DIRS), \
	$(wildcard \
		$(dir)/$(SUPASTATE_OUTPUTS_FILE))))
SUPASTATE_TS_DEPENDENCY_FILES := \
	$(patsubst \
		%/$(SUPASTATE_OUTPUTS_FILE), \
		$(SUPASTATE_TS_DEPENDENCY_DIR)/%.d, \
		$(SUPASTATE_INPUT_FILES))
SUPASTATE_LIB_DIRS := \
	$(patsubst \
		%/$(SUPASTATE_OUTPUTS_FILE), \
		%/lib, \
		$(SUPASTATE_INPUT_FILES))
SUPASTATE_SQL_DIRS := \
	$(patsubst \
		%/$(SUPASTATE_OUTPUTS_FILE), \
		%/sql, \
		$(SUPASTATE_INPUT_FILES))

clean_supastate: clean_test
	@-rm -rf $(SUPASTATE_BUILD_DIR)
	@-rm -rf $(SUPASTATE_LIB_DIRS)
	@-rm -rf $(SUPASTATE_SQL_DIRS)

$(SUPASTATE_SQL_DEPS_FILE): $(SUPABASE_INPUT_FILES)
	npx supastate-test-utils createSQLDependencies -o $@ -i $^

$(SUPASTATE_SQL_RULES_FILE): $(SUPASTATE_INPUT_FILES)
	npx supastate-test-utils createSQLRules -o $@ -i $^

$(SUPASTATE_TS_DEPENDENCY_FILES):

ifneq (clean_supastate,$(filter clean_supastate,$(MAKECMDGOALS)))
include $(SUPASTATE_SQL_DEPS_FILE)
include $(SUPASTATE_SQL_RULES_FILE)
endif

include $(wildcard $(SUPASTATE_TS_DEPENDENCY_FILES))
