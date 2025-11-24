# KWIC Admin V2 API Routes Structure

## Overview
This project uses Next.js App Router with a structured approach to API routes. The API routes are organized in the `src/app/api` directory, following RESTful principles and using next-connect for middleware integration and request handling.

## API Directory Structure

The API routes follow a consistent hierarchical structure:

```
src/app/api/
├── [resource]/                  # Resource category (e.g., business, template)
│   ├── handler.ts               # Main resource handler (collection endpoints)
│   ├── route.ts                 # Next.js route file that uses the handler
│   ├── [resource_id]/           # Dynamic route for individual resource
│   │   ├── handler.ts           # Individual resource handler
│   │   └── route.ts             # Next.js route file for individual resource
│   └── [nested-resource]/       # Nested resources if applicable
│       ├── handler.ts
│       └── route.ts
```

## Route Handler Pattern

### Collection Endpoints (`/api/resource`)

1. **Handler File (`handler.ts`)**
```typescript
import { createEdgeRouter } from "next-connect";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    // List resources with filtering, sorting, pagination
    // Return paginated response
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    // Create new resource
    // Validate input with Yup schema
    // Return created resource
  });

export default router;
```

2. **Route File (`route.ts`)**
```typescript
import { type NextRequest } from "next/server";
import { RequestContext } from "next/dist/server/base-server";
import nc from "./handler";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return (await nc.run(request, ctx)) as Promise<void | Response>;
}

export async function POST(
  request: NextRequest,
  ctx: RequestContext
): Promise<void | Response> {
  return (await nc.run(request, ctx)) as Promise<void | Response>;
}
```

### Individual Resource Endpoints (`/api/resource/[id]`)

1. **Handler File (`[resource_id]/handler.ts`)**
```typescript
import { createEdgeRouter } from "next-connect";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    // Get resource by ID
    // Return single resource or 404
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    // Update resource by ID
    // Validate input with Yup schema
    // Return updated resource
  })
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    // Delete resource by ID
    // Return success response
  });

export default router;
```

## Common API Patterns

### Request Validation

```typescript
// Using Yup for validation
let validatedData: any = {};
try {
  validatedData = yupSchema.validateSync(body);
} catch (error) {
  const errorObj = yupToFormErrorsServer(error);
  return NextResponse.json(
    {
      status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
      message: "Validation Error",
      data: errorObj,
    },
    { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
  );
}
```

### Query Parameter Handling

```typescript
// Get and validate query parameters
const query = await getServerSearchParams(req);
let queryValidation: any = {};
try {
  queryValidation = yupFilterQuerySchema.validateSync(query);
} catch (error) {
  // Handle validation error
}

// Search query construction
let searchQuery: any = {};
if (queryValidation.q !== "") {
  searchQuery = {
    $or: [
      {
        name: {
          $regex: `.*${queryValidation.q}.*`,
          $options: "i",
        },
      },
      // Other search fields...
    ],
  };
}

// Filter query construction
let filterQuery: any = {};
if (queryValidation.filter !== "") {
  const filterObj = getJSONObjectFromString(queryValidation.filter);
  filterQuery = _omitBy(filterObj, _isEmpty);
}

// Sort query construction
let sortQuery: any = {};
if (queryValidation.sort !== "") {
  const sortObj = getJSONObjectFromString(queryValidation.sort);
  try {
    sortQuery = yupSortSchema.validateSync(sortObj);
  } catch (error) {
    sortQuery = { created_at: -1 }; // Default sort
  }
} else {
  sortQuery = { created_at: -1 }; // Default sort
}
```

### Pagination

```typescript
// Standard pagination response format
const finalResponse: any = {
  per_page: queryValidation.per_page,
  total_page: 0,
  total_result: 0,
  items: [],
  current_page: queryValidation.page,
};

// Count total documents for pagination
const totalCount = await Model.countDocuments(finalFilterQuery);
finalResponse.total_result = totalCount;
finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);

// Calculate skip for pagination
let skip = queryValidation.page > 0
  ? (queryValidation.page - 1) * queryValidation.per_page
  : 0;

// Execute query with pagination
let items = await Model
  .find(finalFilterQuery)
  .skip(skip)
  .sort(sortQuery)
  .limit(finalResponse.per_page);

finalResponse.items = items;
```

### Response Format

```typescript
// Success response
return NextResponse.json(
  {
    status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
    data: result,
    message: "Success",
  },
  { status: SERVER_STATUS_CODE.SUCCESS_CODE }
);

// Error response
return NextResponse.json(
  {
    status_code: SERVER_STATUS_CODE.SERVER_ERROR,
    message: "Server Error",
    data: error,
  },
  { status: SERVER_STATUS_CODE.SERVER_ERROR }
);

// Not found response
return NextResponse.json(
  {
    status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
    data: null,
    message: "Resource Not Found",
  },
  { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
);
```

## Authentication and Authorization

API routes use the `apiMiddleware` to handle authentication:

```typescript
router.use(apiMiddlerware).get(async (req, { params }) => {
  // req.user is available from the middleware
  const { user } = req;
  
  // Handler logic with authenticated user
});
```

## Validation with Yup

API routes use Yup schemas for request validation:

```typescript
// Example Yup schema
export const yupTemplateLibrarySchema = Yup.object().shape({
  name: Yup.string().required(),
  language: Yup.string().required(),
  category: Yup.string().required(),
  components: Yup.mixed().required(),
  industry_id: Yup.string().required(),
  use_case_id: Yup.string().required(),
});

// Example sort schema
export const yupTemplateSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
```

## Best Practices

1. **Consistent Response Format**: All API responses follow the same structure with status_code, message, and data
2. **Proper Error Handling**: Try/catch blocks with appropriate error responses
3. **Input Validation**: All request inputs are validated with Yup schemas
4. **Middleware Usage**: Authentication and database connection handled by middleware
5. **Query Parameter Handling**: Standardized approach to filtering, sorting, and pagination
6. **Resource Naming**: RESTful resource naming conventions
7. **Status Codes**: Appropriate HTTP status codes for different scenarios