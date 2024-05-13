import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./hooks/use-auth";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    user: null,
    isFetchingUser: false,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider />
    </QueryClientProvider>
  );
};

const AuthProvider = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={auth} />;
};
