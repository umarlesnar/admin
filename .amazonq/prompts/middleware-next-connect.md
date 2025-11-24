# KWIC Admin V2 Middleware and Next-Connect Integration

## Overview

This project uses next-connect (v1.0.0) to create API route handlers with middleware support in a Next.js application. The middleware pattern enables authentication, database connection, and business logic validation across API routes.

## Key Middleware Components

### API Authentication Middleware (`apiMiddleware.ts`)

```typescript
export const apiMiddlerware = async (req: any, event: any, next: () => any) => {
  try {
    await dbConnect();
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

### Business ID Verification Middleware (`businessIdVerifyMiddleware.ts`)

```typescript
export default async (req: any, { params }: any, next: () => any) => {
  try {
    // Verify business ID exists in database
    const businessCount = await businessAccountModelSchema.countDocuments({
      _id: params.business_id,
    });

    if (businessCount == 0) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Business Id Not found!",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    } else {
      return await next();
    }
  } catch (error) {
    // Error handling
    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Business Id Not found",
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
};
```

### Database Connection Middleware (`dbMiddleware.ts`)

```typescript
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

## Next-Connect Integration

### API Route Handler Pattern

1. **Handler File (`handler.ts`)**

```typescript
import { createEdgeRouter } from "next-connect";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    // GET handler logic
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    // POST handler logic
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

## Middleware Chaining

You can chain multiple middleware functions:

```typescript
router
  .use(dbMiddleware)
  .use(apiMiddlerware)
  .use(async (req, { params }, next) => {
    // Custom middleware
    return await next();
  })
  .get(async (req, { params }) => {
    // Handler logic
  });
```

## Key Benefits

1. **Authentication**: Centralized authentication logic across all API routes
2. **Error Handling**: Consistent error responses
3. **Code Reuse**: Avoid duplicating connection and auth logic
4. **Separation of Concerns**: Each middleware handles a specific aspect
5. **Request Augmentation**: Add data to the request object for handlers to use

## Best Practices

1. **Keep Middleware Focused**: Each middleware should have a single responsibility
2. **Error Handling**: Always include try/catch blocks in middleware
3. **Type Safety**: Use proper TypeScript types for request and response objects
4. **Consistent Response Format**: Return responses in a consistent format
5. **Middleware Order**: Order matters - authentication should come before business logic validation

## Example Usage in Components

```typescript
// In a React component using React Query
const createBusiness = async (data) => {
  const response = await axios.post("/api/business", data);
  return response.data;
};

const { mutate } = useMutation({
  mutationFn: createBusiness,
  onSuccess: () => {
    // Handle success
  },
});
```
