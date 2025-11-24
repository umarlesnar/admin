# KWIC Admin V2 Lib Directory Structure

## Overview
The `src/lib` directory contains utility functions, API helpers, and configurations that support the application's core functionality. It provides the foundation for the application with reusable utilities that are not specific to any particular business domain.

## Key Components

### Root Level Files

- **utils.ts**: CSS utility functions using `clsx` and `tailwind-merge`
  ```typescript
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

- **next-auth-options.ts**: NextAuth.js configuration including:
  - Credentials provider with username/password authentication
  - Google OAuth integration
  - JWT session handling (30-minute session timeout)
  - Custom callbacks for sign-in, session management, and redirects

### API Utilities (`api/`)

- **encrypt.ts**: AES-GCM encryption for securing data
- **decrypt.ts**: Corresponding decryption functionality

### Utility Functions (`utils/`)

#### Constants and Enums (`common.ts`)
```typescript
export const SERVER_STATUS_CODE = {
  SUCCESS_CODE: 200,
  VALIDATION_ERROR_CODE: 422,
  // other status codes...
};

export const OPERATOR_ROLES = [
  { id: "ADMINISTRATOR", name: "Administrator" },
  { id: "TEMPLATE_MANAGER", name: "Template manager" },
  // other roles...
];

export const TEMPLATE_STATUS = {
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  DRAFT: "DRAFT",
  APPROVED: "APPROVED",
};

// Many other constants and enums...
```

#### Database Connection (`utils/mongoose/dbConnect.ts`)
```typescript
async function dbConnect() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await conn;
  }
  return conn;
}
```

#### Form Handling
- **formik/utils.ts**: General form utilities
- **formik/yup-to-form-errors.ts**: Converts Yup validation errors to Formik format

#### Partner and Settings Utilities
- **partner/**: Functions to retrieve partner-specific settings
  - get-brand-setting.ts
  - get-email-setting.ts
  - get-facebook-setting.ts
  - etc.
  
- **settings/**: Functions to retrieve system settings
  - get-facebook-id.ts
  - get-google-captcha.ts
  - get-payment-setting.ts
  - etc.

#### String and Data Processing
- **extract-string-between.ts**: Extracts substrings between delimiters
- **generate-password-hash.ts**: Password hashing functionality
- **get-formatted-currency.ts**: Currency formatting
- **get-json-object-from-string.ts**: Parses JSON from strings
- **get-mongodb-filter-parser.ts**: Parses MongoDB query filters
- And several other string manipulation utilities

## Key Patterns and Observations

1. **Authentication System**: NextAuth.js with both traditional credentials and Google OAuth authentication.

2. **Database Connection**: MongoDB with Mongoose as the ODM (Object Document Mapper).

3. **Security Features**: 
   - Encryption/decryption utilities for sensitive data
   - Password hashing with bcrypt
   - Google reCAPTCHA integration

4. **Configuration Constants**: Many constants and enums are defined in `common.ts` for consistent use throughout the application.

5. **Utility-First Approach**: Small, focused functions that handle specific tasks.

6. **Partner/Settings Management**: Numerous utilities for retrieving different types of settings, suggesting a configurable system.

## How to Use Lib Utilities

### Authentication
```typescript
// Using NextAuth in API routes
import { nextAuthOptions } from "@/lib/next-auth-options";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Continue with authenticated request
}
```

### Database Connection
```typescript
import dbConnect from "@/lib/utils/mongoose/dbConnect";

async function fetchData() {
  await dbConnect();
  // Now you can use Mongoose models
}
```

### Using Utility Functions
```typescript
import { cn } from "@/lib/utils";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

// Using the cn utility for class merging
<div className={cn("base-class", isActive && "active-class")}>

// Using constants
if (response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE) {
  // Handle unauthorized access
}
```

### Encryption/Decryption
```typescript
import { encrypt } from "@/lib/api/encrypt";
import { decrypt } from "@/lib/api/decrypt";

// Encrypt sensitive data
const { encryptedData, iv } = await encrypt({ userId: 123, role: "admin" });

// Decrypt data
const decryptedData = await decrypt(encryptedData, iv);
```

## Best Practices When Extending the Lib Directory

1. **Keep Functions Small and Focused**: Each utility should do one thing well.

2. **Maintain Proper Organization**: Place utilities in appropriate subdirectories based on their purpose.

3. **Document Functions**: Add comments explaining what each utility does and how to use it.

4. **Avoid Duplication**: Check if a similar utility already exists before creating a new one.

5. **Ensure Type Safety**: Use TypeScript types/interfaces for function parameters and return values.

6. **Write Tests**: Create unit tests for utilities to ensure they work as expected.

7. **Consider Performance**: Optimize utilities that are used frequently or handle large data sets.