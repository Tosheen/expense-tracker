import { Button } from "@/components/ui/button";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const Login = () => {
  return (
    <div className="p-2 max-w-lg mx-auto space-y-2">
      <h3>You have to login or register</h3>
      <p className="grid grid-cols-2 gap-4">
        <div>
          <Button asChild>
            <a href="/api/login">Login!</a>
          </Button>
        </div>
        <div>
          <Button asChild>
            <a href="/api/register">Register!</a>
          </Button>
        </div>
      </p>
    </div>
  );
};

const Loading = () => {
  return <div className="p-2 max-w-lg mx-auto">Loading user data...</div>;
};

const Protected = () => {
  const { user, isFetchingUser } = Route.useRouteContext();

  if (isFetchingUser === true) {
    return <Loading />;
  }

  if (user == null) {
    return <Login />;
  }

  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    return {
      user: context.user,
      isFetchingUser: context.isFetchingUser,
    };
  },
  component: Protected,
});
