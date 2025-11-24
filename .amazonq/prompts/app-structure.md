# KWIC Admin V2 App Structure

## Overview
This project uses Next.js App Router with a structured approach to frontend organization. The application is divided into route groups for authentication and main application areas, with components organized by feature and page.

## App Directory Structure

The application follows a hierarchical structure with route groups:

```
src/app/
├── (app)/                      # Main application route group
│   ├── _components/            # Shared components for the app group
│   ├── app/                    # Application pages
│   │   ├── [feature]/          # Feature-specific pages
│   │   │   ├── _components/    # Feature-specific components
│   │   │   └── page.tsx        # Feature page
│   │   └── page.tsx            # App home page
│   ├── layout.tsx              # App group layout
│   └── page.tsx                # App group home page
├── (auth)/                     # Authentication route group
│   ├── login/                  # Login page
│   │   ├── _components/        # Login-specific components
│   │   └── page.tsx            # Login page
│   └── layout.tsx              # Auth group layout
├── api/                        # API routes
├── globals.css                 # Global styles
├── layout.tsx                  # Root layout
└── not-found.tsx               # 404 page
```

## Route Groups and Layouts

### Root Layout (`layout.tsx`)
The root layout sets up the basic HTML structure and includes:
- ReactQueryClientProvider for data fetching
- Toast notifications

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-screen">
      <body className={"h-screen" + inter.className}>
        <ReactQueryClientProvider>
          {children}
          <Toaster richColors position="top-right" theme="light" />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
```

### Auth Group Layout (`(auth)/layout.tsx`)
The authentication layout adds:
- NextAuthProvider for authentication
- ApplicationProvider for global state
- Specific styling for auth pages

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-screen">
      <body className={"h-screen bg-[#F6F9F6]" + inter.className}>
        <NextAuthProvider>
          <ReactQueryClientProvider>
            <ApplicationProvider>{children}</ApplicationProvider>
            <Toaster richColors position="top-right" theme="light" />
          </ReactQueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

### App Group Layout (`(app)/layout.tsx`)
The main application layout adds:
- SideNavBar for navigation
- Main content area with overflow handling
- Application structure with flex layout

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-screen">
      <body className={"h-screen overflow-hidden " + inter.className}>
        <div className="h-screen flex flex-col">
          <NextAuthProvider>
            <ApplicationProvider>
              <ReactQueryClientProvider>
                <Suspense>
                  <div className="min-h-0 flex-1 flex overflow-hidden">
                    <SideNavBar />
                    <main className="min-w-0 flex-1 flex flex-col bg-[#eef1ee]">
                      <div className="flex-1 overflow-auto">{children}</div>
                    </main>
                  </div>
                </Suspense>
                <Toaster richColors position="top-right" theme="light" />
              </ReactQueryClientProvider>
            </ApplicationProvider>
          </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}
```

## Component Organization

### Shared Components
Shared components are organized in `_components` directories at different levels:
- Root level: Components shared across the entire application
- Route group level: Components shared within a route group
- Feature level: Components specific to a feature

### Feature Organization
Each feature follows a consistent pattern:
- Feature directory with page.tsx
- _components directory for feature-specific components
- Nested routes for sub-features

Example for the business feature:
```
app/business/
├── _components/
│   ├── BusinessFormPage.tsx
│   ├── BusinessLists.tsx
│   └── BusinessPageHeader.tsx
├── [business_id]/
│   ├── _components/
│   │   ├── BusinessViewHeader.tsx
│   │   └── BusinessViewSideNavBar.tsx
│   ├── agents/
│   ├── integration/
│   ├── overview/
│   ├── settings/
│   └── page.tsx
└── page.tsx
```

## Page Structure

Pages follow a consistent structure:
1. Import components and hooks
2. Define the page component
3. Fetch data if needed
4. Render the page with its components

Example page structure:
```tsx
import { BusinessLists } from "./_components/BusinessLists";
import { BusinessPageHeader } from "./_components/BusinessPageHeader";

export default function BusinessPage() {
  return (
    <div className="p-6">
      <BusinessPageHeader />
      <BusinessLists />
    </div>
  );
}
```

## Dynamic Routes

Dynamic routes use square brackets in the directory name:
- `[business_id]`: Dynamic business ID route
- `[template_id]`: Dynamic template ID route

These routes can access the dynamic parameter using the `params` prop:
```tsx
export default function BusinessDetailPage({ params }: { params: { business_id: string } }) {
  const { business_id } = params;
  // Use business_id to fetch data
  return <BusinessDetail id={business_id} />;
}
```

## Component Patterns

### Page Header Components
Most features have a header component that includes:
- Page title
- Action buttons
- Breadcrumbs or navigation

```tsx
export function BusinessPageHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Businesses</h1>
      <Button onClick={() => /* open modal */}>Add Business</Button>
    </div>
  );
}
```

### List Components
List components display collections of items:
- Data fetching with React Query
- Filtering and sorting
- Pagination
- Item actions

```tsx
export function BusinessLists() {
  const { data, isLoading } = useBusinessQuery({ page: 1, limit: 10 });
  
  if (isLoading) return <Spinner />;
  
  return (
    <div className="bg-white rounded-md shadow">
      {data.items.map(item => (
        <BusinessListItem key={item.id} business={item} />
      ))}
    </div>
  );
}
```

### Form Components
Form components handle data entry:
- Formik for form state management
- Yup for validation
- Form submission with React Query mutations

```tsx
export function BusinessFormPage() {
  const { mutate } = useBusinessMutation();
  
  return (
    <Formik
      initialValues={{ name: "", type: "" }}
      validationSchema={businessSchema}
      onSubmit={(values) => mutate({ method: "POST", payload: values })}
    >
      {/* Form fields */}
    </Formik>
  );
}
```

### Modal and Sheet Components
Modal components for actions:
- Add/Edit/Delete operations
- Confirmation dialogs
- Detail views

```tsx
export function AddBusinessSheet({ open, onClose }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>Add Business</SheetHeader>
        <BusinessFormPage onSuccess={onClose} />
      </SheetContent>
    </Sheet>
  );
}
```

## Best Practices

1. **Component Organization**: Use _components directories to group related components
2. **Route Groups**: Use route groups to separate different areas of the application
3. **Layouts**: Use layouts to share UI between related routes
4. **Dynamic Routes**: Use dynamic routes for resource-specific pages
5. **Data Fetching**: Use React Query for data fetching and mutations
6. **Component Reuse**: Create reusable components for common patterns
7. **Consistent Naming**: Follow consistent naming conventions for files and components