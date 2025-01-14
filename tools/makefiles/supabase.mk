.PHONY: \
	clean \
	build

ifndef SUPABASE_OUTPUT_DIR
$(error SUPABASE_OUTPUT_DIR is not set)
endif

SUPABASE_DEPENDENCY_DIR := .deps

# Search for include directories
SUPABASE_INCLUDE_DIRS := $(shell find $(SUPABASE_INCLUDE_SEARCH_PATHS) -type d -name 'include')
SUPABASE_INCLUDE_OPTIONS := $(addprefix -I, $(SUPABASE_INCLUDE_DIRS))

# Options for the C preprocessor that we are using to compile the SQL outputs
#
# -nostdinc					: don't search the standard system directories for
#								includes (we're not building C)
#
# -P						: don't generate line info (again we're not building C
#								and these lines would be invalid SQL)
#
# -MD						: do generate dependency files for make as well
#								as the preprocessor output, the file path for the
#								dependency file will be specified with -MF in the make rule
#
# -MP						: add phony targets for each dependency (so that removed
#								includes don't cause errors?)
#
# -Wno-invalid--pp-token	: suppress warnings for use of ' in comments, etc (not
#								sure what else it suppresses though, but this is
#								unlikely to cause an issue unless we try to do something
#								really complicated with the preprocessor)
#
CPP_OPTIONS := -nostdinc -P -MD -MP -Wno-invalid-pp-token $(SUPABASE_INCLUDE_OPTIONS)

SUPABASE_ENTRY_FILE := main.sql

# We want to search all directories and sub directories for entry points
SUPABASE_INPUT_DIRS := $(shell find . -type d | sed 's|^\./||')

SUPABASE_INPUT_FILES := \
	$(sort \
	$(foreach dir, $(SUPABASE_INPUT_DIRS), \
	$(wildcard \
		$(dir)/$(SUPABASE_ENTRY_FILE))))
SUPABASE_OUTPUT_FILES := \
	$(patsubst \
		%/$(SUPABASE_ENTRY_FILE), \
		$(SUPABASE_OUTPUT_DIR)/%.sql, \
		$(SUPABASE_INPUT_FILES))
SUPABASE_OUTPUT_DIRS := \
	$(patsubst %/, %, \
	$(sort \
	$(dir \
		$(SUPABASE_OUTPUT_FILES))))
SUPABASE_DEPENDENCY_FILES := \
	$(patsubst \
		%/$(SUPABASE_ENTRY_FILE), \
		$(SUPABASE_DEPENDENCY_DIR)/%.d, \
		$(SUPABASE_INPUT_FILES))
SUPABASE_DEPENDENCY_DIRS := \
	$(patsubst %/, %, \
	$(sort \
	$(dir \
		$(SUPABASE_DEPENDENCY_FILES))))

build: $(SUPABASE_OUTPUT_FILES)

clean:
	@-rm -rf $(SUPABASE_DEPENDENCY_DIR)
	@-rm -rf $(SUPABASE_OUTPUT_DIR)

$(SUPABASE_OUTPUT_DIR)/%.sql: $(SUPABASE_DEPENDENCY_DIR)/%.d %/$(SUPABASE_ENTRY_FILE) \
								| $(SUPABASE_DEPENDENCY_DIRS) $(SUPABASE_OUTPUT_DIRS)
	@echo "compiling $@"
	@cpp $(CPP_OPTIONS) -MF$(SUPABASE_DEPENDENCY_DIR)/$*.Td "$*/$(SUPABASE_ENTRY_FILE)" "$@"
	# defense against odd file times with newer GNU Make resulting in .d files newer than the .sql files
	@mv -f $(SUPABASE_DEPENDENCY_DIR)/$*.Td $(SUPABASE_DEPENDENCY_DIR)/$*.d && touch $@

$(SUPABASE_DEPENDENCY_DIRS) $(SUPABASE_OUTPUT_DIRS):
	@mkdir -p $@

$(SUPABASE_DEPENDENCY_FILES):

include $(wildcard $(SUPABASE_DEPENDENCY_FILES))
