.PHONY: \
	clean_supastate

include $(TOOLS_DIR)/makefiles/supabase_test.mk

CURRENT_DIR := $(shell pwd)
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
	npm run buildIncremental
	$(TOOLS_DIR)/scripts/supastate_build.sh $*/supastate $<

$(SUPASTATE_TS_DEPENDENCY_DIRS) $(SUPASTATE_DEPENDENCY_DIR):
	@mkdir -p $@

$(SUPASTATE_SQL_DEPENDENCY_FILE): $(SUPABASE_INPUT_FILES) | $(SUPASTATE_DEPENDENCY_DIR)
	$(TOOLS_DIR)/scripts/supastate_sql_deps.sh $@ $^

$(SUPASTATE_TS_DEPENDENCY_FILES):

include $(SUPASTATE_SQL_DEPENDENCY_FILE)

include $(wildcard $(SUPASTATE_TS_DEPENDENCY_FILES))
