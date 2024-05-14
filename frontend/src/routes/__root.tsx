import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { UserType } from "@kinde-oss/kinde-typescript-sdk";

import { Toaster } from "@/components/ui/sonner";

interface RootRouteContext {
  user: UserType | null;
  isFetchingUser: boolean;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: Root,
});

function NavBar() {
  return (
    <div className="p-2 max-w-4xl mx-auto flex justify-between">
      <Link to="/" className="[&.active]:font-bold">
        <h2>
          <strong>Expense tracker</strong>
        </h2>
      </Link>{" "}
      <div className="flex gap-2">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <div className="max-w-xl mx-auto mt-4">
        <Outlet />
      </div>
      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
}
