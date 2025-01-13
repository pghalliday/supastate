.PHONY: \
	clean_supastate

include $(TOOLS_DIR)/makefiles/supabase_test.mk

SUPASTATE_DEPENDENCY_DIR := .supastate_deps
SUPASTATE_TS_DEPENDENCY_DIR := $(SUPASTATE_DEPENDENCY_DIR)/ts
SUPASTATE_SQL_DEPENDENCY_FILE := $(SUPASTATE_DEPENDENCY_DIR)/sql.d

SUPASTATE_TS_DEPENDENCY_FILES := \
	$(patsubst \
		%/$(SUPABASE_ENTRY_FILE), \
		$(SUPASTATE_TS_DEPENDENCY_DIR)/%.d, \
		$(SUPABASE_INPUT_FILES))
SUPASTATE_TS_DEPENDENCY_DIRS := \
	$(patsubst %/, %, \
	$(sort \
	$(dir \
		$(SUPASTATE_TS_DEPENDENCY_FILES))))
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

%/supastate/sql/supastate.sql: $(SUPASTATE_TS_DEPENDENCY_DIR)/%.d | $(SUPASTATE_TS_DEPENDENCY_DIRS)
	$(TOOLS_DIR)/scripts/supastate_build.sh $*/supastate $<

$(SUPASTATE_TS_DEPENDENCY_DIRS) $(SUPASTATE_DEPENDENCY_DIR):
	@mkdir -p $@

$(SUPASTATE_SQL_DEPENDENCY_FILE): $(SUPABASE_INPUT_FILES) | $(SUPASTATE_DEPENDENCY_DIR)
	$(TOOLS_DIR)/scripts/supastate_sql_deps.sh $@ $^

$(SUPASTATE_TS_DEPENDENCY_FILES):

ifneq (clean_supastate,$(filter clean_supastate,$(MAKECMDGOALS)))
include $(SUPASTATE_SQL_DEPENDENCY_FILE)
endif

include $(wildcard $(SUPASTATE_TS_DEPENDENCY_FILES))
