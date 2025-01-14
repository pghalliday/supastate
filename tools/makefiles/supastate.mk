.PHONY: \
	clean_supastate

include $(TOOLS_DIR)/makefiles/supabase_test.mk

SUPASTATE_DEPENDENCY_DIR := .supastate_deps
SUPASTATE_TS_DEPENDENCY_DIR := $(SUPASTATE_DEPENDENCY_DIR)/ts
SUPASTATE_SQL_RULES_FILE := $(SUPASTATE_DEPENDENCY_DIR)/sql.d

SUPASTATE_TS_DEPENDENCY_FILES := \
	$(patsubst \
		%/$(SUPABASE_ENTRY_FILE), \
		$(SUPASTATE_TS_DEPENDENCY_DIR)/%.d, \
		$(SUPABASE_INPUT_FILES))
SUPASTATE_LIB_DIRS := \
	$(patsubst \
		%/$(SUPABASE_ENTRY_FILE), \
		%/supastate/lib, \
		$(SUPABASE_INPUT_FILES))
SUPASTATE_SQL_DIRS := \
	$(patsubst \
		%/$(SUPABASE_ENTRY_FILE), \
		%/supastate/sql, \
		$(SUPABASE_INPUT_FILES))

clean_supastate: clean_test
	@-rm -rf $(SUPASTATE_DEPENDENCY_DIR)
	@-rm -rf $(SUPASTATE_LIB_DIRS)
	@-rm -rf $(SUPASTATE_SQL_DIRS)

$(SUPASTATE_SQL_RULES_FILE): $(SUPABASE_INPUT_FILES)
	npx supastate-test-utils createSQLRules -o $@ -i $^

$(SUPASTATE_TS_DEPENDENCY_FILES):

ifneq (clean_supastate,$(filter clean_supastate,$(MAKECMDGOALS)))
include $(SUPASTATE_SQL_RULES_FILE)
endif

include $(wildcard $(SUPASTATE_TS_DEPENDENCY_FILES))
