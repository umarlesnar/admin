# KWIC Admin V2 API Router Middleware Pattern

## Overview
This guide explains the standardized pattern for implementing API routes in the KWIC Admin V2 project, with a focus on the middleware chain that ensures authentication and database connectivity across all endpoints.

## Core Middleware Components

### 1. API Authentication Middleware (`apiMiddleware.ts`)
This middleware handles both authentication and database connection:

```typescript
// src/middleware/apiMiddleware.ts
export const apiMiddlerware = async (req: any, event: any, next: () => any) => {
  try {
    // Connect to database
    await dbConnect();
    
    // Authentication logic
    const secret = process.env.NEXTAUTH_SECRET!;
    const session: any = await getServerSession(nextAuthOptions);

    if (session) {
      // User is authenticated via NextAuth session
      req.user = session.user;
      return await next();
    } else {
      // Try JWT token authentication as fallback
      let token = null;
      const headersList = headers();
      const authorization = headersList.get("authorization");
      if (authorization) {
        token = authorization.replace("Bearer ", "").trim();
      }

      if (token) {
        const decodedToken = jwt.verify(token, secret, {
          algorithms: ["HS256"],
        });
        req.user = decodedToken;
        return await next();
      } else {
        return NextResponse.json(
          { message: "Unauthorized Access" },
          { status: SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE }
        );
      }
    }
  } catch (error) {
    // Error handling
    return NextResponse.json(
      { data: "DB Connection Issue" },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
};
```

### 2. Database Middleware (`dbMiddleware.ts`)
A standalone middleware for database connection (used when authentication is not required):

```typescript
// src/middleware/dbMiddleware.ts
export default async function dbMiddleware(
  req: NextRequest,
  event: any,
  next: () => any
) {
  await dbConnect();
  return await next().catch((e: any) => {
    return NextResponse.json(
      { data: e.message },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  });
}
```

## Standardized API Router Pattern

### 1. Collection Endpoints (List/Create)

```typescript
// src/app/api/[resource]/handler.ts
import { createEdgeRouter } from "next-connect";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware) // Apply authentication and DB connection
  .get(async (req: AppNextApiRequest, { params }: any) => {
    // List resources
    // req.user is available from middleware
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    // Create resource
    // req.user is available from middleware
  });

export default router;
```

### 2. Individual Resource Endpoints (Read/Update/Delete)

```typescript
// src/app/api/[resource]/[id]/handler.ts
import { createEdgeRouter } from "next-connect";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware) // Apply authentication and DB connection
  .get(async (req: AppNextApiRequest, { params }: any) => {
    // Get resource by ID
    // req.user is available from middleware
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    // Update resource by ID
    // req.user is available from middleware
  })
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    // Delete resource by ID
    // req.user is available from middleware
  });

export default router;
```

## Benefits of This Pattern

1. **Centralized Authentication**: All API routes automatically verify user authentication
2. **Consistent Database Connection**: Database is connected before any route handler executes
3. **User Context**: The `req.user` object is always available in route handlers
4. **Error Handling**: Authentication and database errors are handled consistently
5. **DRY Principle**: No need to repeat authentication or connection logic in each route

## Advanced Middleware Chaining

For more complex scenarios, you can chain multiple middleware functions:

```typescript
router
  .use(apiMiddlerware)
  .use(async (req, { params }, next) => {
    // Custom middleware
    // For example, check permissions for specific resource
    if (!hasPermission(req.user, params.resource_id)) {
      return NextResponse.json(
        { message: "Permission denied" },
        { status: SERVER_STATUS_CODE.PERMISSION_ERROR_CODE }
      );
    }
    return await next();
  })
  .get(async (req, { params }) => {
    // Handler logic
  });
```

## Implementation Example

Here's a complete example for a "posts" resource:

```typescript
// src/app/api/posts/handler.ts
import { createEdgeRouter } from "next-connect";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import postModelSchema from "@/models/post-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const { user } = req; // User is available from middleware
    
    // Get posts with pagination
    const posts = await postModelSchema
      .find()
      .sort({ created_at: -1 })
      .limit(10);
      
    return NextResponse.json({
      data: posts,
      user_id: user.user_id // We can access user info from middleware
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const { user } = req; // User is available from middleware
    const body = await req.json();
    
    // Create post with author from authenticated user
    const newPost = new postModelSchema({
      ...body,
      author_id: user.user_id
    });
    
    await newPost.save();
    
    return NextResponse.json({
      data: newPost
    });
  });

export default router;
```

## Best Practices

1. **Always Use apiMiddleware**: Include it in all API routes to ensure authentication
2. **Access User Context**: Use `req.user` to get the authenticated user's information
3. **Custom Middleware**: Add resource-specific middleware after apiMiddleware when needed
4. **Error Handling**: Let the middleware handle authentication errors consistently
5. **Route Organization**: Keep related routes together in the same directory
6. **Consistent Response Format**: Return responses in the same format across all routes