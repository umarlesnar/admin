# KWIC Admin V2 Framework API Pattern

## Project Structure Overview

This project follows a domain-driven structure for API interactions using React Query and Axios. The framework directory is organized by business domains, with each domain containing its own query and mutation logic.

## Key Components

### 1. HTTP Client Setup
- Located at `src/framework/utils/http.ts`
- Uses Axios with base configuration:
  ```typescript
  const http = axios.create({
    baseURL: "/api",
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  ```

### 2. API Endpoints
- Centralized in `src/constants/endpoints.ts`
- Used consistently across all API calls
- Example:
  ```typescript
  export const API_ENDPOINTS = {
    TEMPLATE: "/template",
    LIBRARY: "/library",
    BUSINESS: "/business",
    // other endpoints...
  };
  ```

### 3. React Query Configuration
- Set up in `src/components/QueryClientProvider.tsx`
- Configuration includes:
  - Disabled refetch on window focus and reconnect
  - 5-minute stale time for data freshness

### 4. Domain-Specific API Logic Pattern

Each domain folder (e.g., template, business, user_account) follows this pattern:

#### For Data Fetching (Queries):
```typescript
// Example pattern for get-[resource].ts
import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getResource = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.RESOURCE_TYPE}`;
  // Format parameters if needed
  const { data } = await http.get(finalurl, { params: input });
  return data?.data;
};

export const useResourceQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.RESOURCE_TYPE, queryFilter],
    queryFn: () => getResource(queryFilter),
  });
};
```

#### For Data Modification (Mutations):
```typescript
// Example pattern for [resource]-mutation.ts
import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IResourceMutation {
  id?: string;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function resourceMutationApi(input: IResourceMutation) {
  if (input.method === "PUT" || input.method === "DELETE") {
    const finalUrl = `${API_ENDPOINTS.RESOURCE_TYPE}/${input.id}`;
    return input.method === "DELETE" 
      ? http.delete(finalUrl)
      : http.put(finalUrl, input.payload);
  } else {
    const finalUrl = `${API_ENDPOINTS.RESOURCE_TYPE}`;
    return http.post(finalUrl, input.payload);
  }
}

export const useResourceMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: IResourceMutation) => resourceMutationApi(input),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.RESOURCE_TYPE],
      });
    },
    onError: (error: any) => {
      console.error("Error in resource mutation:", error);
      // Error handling logic
    },
  });
};
```

## Best Practices Used

1. **Separation of Concerns**: Each domain has its own directory with specific API logic
2. **Consistent Patterns**: Similar file naming and structure across domains
3. **Centralized Configuration**: Shared HTTP client and endpoint constants
4. **Proper Cache Management**: Structured query keys and invalidation
5. **Error Handling**: Centralized in mutation hooks
6. **Context Integration**: Some mutations access application context when needed

## How to Add a New API Feature

1. Identify the domain it belongs to (or create a new domain folder)
2. Add endpoint constant to `src/constants/endpoints.ts` if needed
3. Create query file(s) for GET operations
4. Create mutation file(s) for POST/PUT/DELETE operations
5. Follow the established patterns for consistency

## Common Patterns for Complex Scenarios

1. **Nested Resources**: For complex domains, create subdirectories (e.g., business/catalog)
2. **Dependent Queries**: Use the `enabled` option in useQuery for queries that depend on other data
3. **Optimistic Updates**: Implement optimistic UI updates in the onMutate callback
4. **Pagination**: Include page information in query keys and parameters

## Example Usage in Components

```tsx
function MyComponent() {
  // For fetching data
  const { data, isLoading, error } = useResourceQuery({ 
    limit: 10, 
    page: 1 
  });
  
  // For modifying data
  const { mutate, isPending } = useResourceMutation();
  
  const handleSubmit = (formData) => {
    mutate({ 
      method: "POST", 
      payload: formData 
    });
  };
  
  // Component rendering logic
}
```