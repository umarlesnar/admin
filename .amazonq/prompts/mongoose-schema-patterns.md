# KWIC Admin V2 Mongoose Schema Patterns

## Overview
This project uses Mongoose as an ODM (Object Document Mapper) for MongoDB. The `src/models` directory contains schema definitions for all database collections, following consistent patterns for type safety and data validation.

## Schema Structure Pattern

Each schema file follows a consistent structure:

1. **TypeScript Interfaces**: Define the document structure and methods
2. **Schema Definition**: Create the Mongoose schema with field types and options
3. **Model Export**: Export the model, checking if it already exists to prevent overwriting

```typescript
// Basic pattern used across schema files
import { Document, Model, Schema, model, models, Types } from "mongoose";

// 1. Document interface definition
interface IMyModel extends Document {
  field1: string;
  field2: number;
  // other fields...
}

// 2. Methods interface (if needed)
interface IMyModelMethods {
  someMethod(): any;
}

// 3. Model type definition
type MyModelType = Model<IMyModel, {}, IMyModelMethods>;

// 4. Schema definition
const MyModelSchema = new Schema<IMyModel, MyModelType, IMyModelMethods>({
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
  // other fields with their types and options...
});

// 5. Middleware (if needed)
MyModelSchema.pre("save", function(next) {
  // Pre-save logic
  next();
});

// 6. Model export with singleton pattern
export default models.my_model || model<IMyModel>("my_model", MyModelSchema);
```

## Key Schema Examples

### Business Account Schema

```typescript
interface IBusinessAccount extends Document {
  name: String;
  business_logo_url: String;
  user_id?: Types.ObjectId;
  status: String;
  // other fields...
}

const BusinessAccountSchema = new Schema<
  IBusinessAccount,
  BusinessModel,
  IBusinessAccountMethods
>({
  name: { type: String },
  business_logo_url: { type: String },
  user_id: { type: Types.ObjectId },
  status: { type: String, default: "ACTIVE" },
  // other fields with their types and options...
});

export default models.business_account ||
  model<IBusinessAccount>("business_account", BusinessAccountSchema);
```

### User Account Schema

```typescript
interface IUserAccount extends Document {
  username: string;
  auth_credentials: AuthCredentials;
  profile: UserProfile;
  role: String;
  // other fields...
}

const UserAccountSchema = new Schema<
  IUserAccount,
  UserModel,
  IUserAccountMethods
>({
  username: { type: String, unique: true, index: true },
  auth_credentials: {
    password: { type: String },
    last_updated_at: { type: Date, default: new Date() },
  },
  profile: {
    first_name: { type: String, required: true },
    last_name: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  role: { type: String, default: "OWNER" },
  // other fields with their types and options...
});

// Password hashing middleware
UserAccountSchema.pre("save", function(next) {
  if (this.auth_credentials) {
    const hash = generatePasswordHash(this.auth_credentials.password);
    this.auth_credentials.password = hash;
  }
  next();
});
```

## Common Schema Patterns

### Field Types

```typescript
// String fields
field: { type: String }
field: { type: Schema.Types.String }

// Number fields
field: { type: Number }
field: { type: Schema.Types.Number }

// Boolean fields
field: { type: Boolean }
field: { type: Schema.Types.Boolean }

// Date fields
field: { type: Date, default: new Date() }
field: { type: Schema.Types.Date, default: new Date() }

// ObjectId references
field: { type: Types.ObjectId, ref: "collection_name" }

// Mixed type (any structure)
field: { type: Schema.Types.Mixed }

// Arrays
field: [String]
field: [{ type: Schema.Types.String }]
field: [{ 
  subfield1: { type: String },
  subfield2: { type: Number }
}]
```

### Common Options

```typescript
// Required fields
field: { type: String, required: true }

// Default values
field: { type: String, default: "default value" }
field: { type: Number, default: 0 }
field: { type: Boolean, default: false }
field: { type: Date, default: new Date() }

// Unique constraints
field: { type: String, unique: true }

// Indexing
field: { type: String, index: true }
```

### Nested Objects

```typescript
// Nested object definition
field: {
  subfield1: { type: String },
  subfield2: { type: Number, default: 0 },
  subfield3: { type: Boolean, default: false }
}
```

### Arrays of Objects

```typescript
// Array of objects
field: [
  {
    subfield1: { type: String },
    subfield2: { type: Number },
    created_at: { type: Date, default: new Date() }
  }
]
```

## Schema Middleware

### Pre-save Hooks

```typescript
// Example: Password hashing before save
schema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = hashPassword(this.password);
  }
  next();
});
```

## Best Practices

1. **TypeScript Integration**: Use interfaces to define document structure for type safety
2. **Singleton Pattern**: Use `models.name || model("name", schema)` to prevent model redefinition
3. **Field Validation**: Define validation rules in the schema
4. **Default Values**: Set sensible defaults for fields
5. **References**: Use `ref` option for relationships between collections
6. **Middleware**: Use hooks for data transformation and validation
7. **Indexing**: Add indexes to fields used in queries for performance

## Usage in API Routes

```typescript
import businessAccountModelSchema from "@/models/business-account-model-schema";

// In an API route handler
const getBusinessById = async (id: string) => {
  await dbConnect();
  return await businessAccountModelSchema.findById(id);
};
```

## Common Query Patterns

```typescript
// Find by ID
const doc = await Model.findById(id);

// Find one document
const doc = await Model.findOne({ field: value });

// Find multiple documents
const docs = await Model.find({ field: value });

// Count documents
const count = await Model.countDocuments({ field: value });

// Pagination
const docs = await Model.find(query)
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ created_at: -1 });

// Populate references
const doc = await Model.findById(id).populate("reference_field");
```