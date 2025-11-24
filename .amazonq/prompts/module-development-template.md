# Module Development Template

## Overview
This template provides a standardized approach for creating new modules based on the existing WhatsApp broadcast module pattern.

## Prompt Template

```
I want to develop a new module based on the existing module structure. Please follow the established pattern from the WhatsApp broadcast module.

**New Module Details:**
- Module Name: [MODULE_NAME]
- Base Schema: @[EXISTING_SCHEMA_FILE] (if extending existing schema)
- Location: Under partner/[partner_id]/whatsapp/[module-name]

**Requirements:**

1. **Database Schema & Joins:**
   - Primary collection: [COLLECTION_NAME]
   - Join with [COLLECTION_1] using [FIELD_1] to get [DISPLAY_FIELDS]
   - Join with [COLLECTION_2] using [FIELD_2] to get [DISPLAY_FIELDS]
   - Search functionality across: [SEARCHABLE_FIELDS]

2. **Frontend Implementation:**
   - List view with columns: [COLUMN_1, COLUMN_2, COLUMN_3, etc.]
   - Filters: [FILTER_OPTIONS]
   - Sort options: [SORT_FIELDS]
   - Actions: View Details, Delete
   - Search placeholder: "[SEARCH_DESCRIPTION]"

3. **View Details Dialog:**
   - Section 1: [SECTION_NAME] - compact display of [FIELDS]
   - Section 2: [SECTION_NAME] - compact display of [FIELDS]  
   - Section 3: [MAIN_DATA_SECTION] - expandable/scrollable area for [DYNAMIC_CONTENT]
   - Dialog should be user-friendly with proper spacing and visibility

4. **API Implementation:**
   - GET endpoint with pagination, search, filter, sort
   - DELETE endpoint with proper validation
   - Follow existing aggregation pipeline pattern
   - Include partner domain validation

**File Structure to Create:**
```
src/
├── app/
│   ├── (app)/app/partner/[partner_id]/whatsapp/[module-name]/
│   │   ├── page.tsx
│   │   └── _components/
│   │       ├── [ModuleName]List.tsx
│   │       └── [ModuleName]PageHeader.tsx
│   └── api/partner/[partner_id]/[module-name]/
│       ├── handler.ts
│       ├── route.ts
│       └── [module_id]/
│           ├── handler.ts
│           └── route.ts
├── framework/partner/[module-name]/
│   ├── get-[module-name]-list.ts
│   └── [module-name]-delete-mutation.ts
└── models/
    └── [module-name]-model-schema.ts (if new schema needed)
```

**Implementation Guidelines:**
- Follow existing broadcast module pattern exactly
- Use minimal code approach - no verbose implementations
- Maintain consistent UI/UX with existing modules
- Include proper error handling and loading states
- Use existing components (AsyncTable, SearchBox, Listbox, etc.)
- Follow established naming conventions
- Ensure responsive design and proper accessibility

**Additional Specifications:**
[Add any specific business logic, validation rules, or custom requirements here]

Please implement this module following the established patterns and provide the complete code for all required files.
```

## Example Usage

### Message Templates Module
```
**New Module Details:**
- Module Name: Message Templates
- Base Schema: @business-template-model-schema.ts
- Location: Under partner/[partner_id]/whatsapp/message-templates

**Requirements:**

1. **Database Schema & Joins:**
   - Primary collection: business_templates
   - Join with workspaces using workspace_id to get workspace name, domain
   - Join with businesses using business_id to get business name, status
   - Search functionality across: template name, workspace name, business name, category

2. **Frontend Implementation:**
   - List view with columns: Workspace Name, Business Name, Template Name, Category, Status, Language, Created At
   - Filters: Status (APPROVED, PENDING, REJECTED), Category, Language
   - Sort options: Created Date, Updated Date, Template Name
   - Actions: View Details, Delete
   - Search placeholder: "Search templates, workspace, business"

3. **View Details Dialog:**
   - Section 1: Template Info - compact display of name, category, language, status
   - Section 2: Business Info - compact display of business name, workspace, created date
   - Section 3: Template Content - expandable area for template body, header, footer, buttons
```

## Key Components Pattern

### 1. API Handler Structure
- Use aggregation pipeline with $lookup for joins
- Include partner domain validation
- Support pagination, search, filter, sort
- Proper error handling and validation

### 2. Frontend List Component
- AsyncTable with proper columns
- Search, filter, and sort functionality
- View details dialog integration
- Delete confirmation with toast notifications

### 3. Dialog Component Structure
- Compact header sections for key info
- Expandable main content area
- Proper scrolling and visibility
- Clean, user-friendly design

### 4. Framework Files
- Query hook using React Query
- Mutation hook for CRUD operations
- Proper error handling and cache invalidation

## Best Practices
- Keep code minimal and focused
- Follow existing naming conventions
- Use established UI components
- Maintain consistent styling
- Include proper TypeScript types
- Add loading and error states
- Ensure responsive design