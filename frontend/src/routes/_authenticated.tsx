import { createFileRoute, Outlet } from "@tanstack/react-router";

const Login = () => {
  return <div>You have to login</div>;
};

const Protected = () => {
  const { user } = Route.useRouteContext();

  if (user == null) {
    return <Login />;
  }

  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    return {
      user: {
        name: "Branko",
      },
    };
  },
  component: Protected,
});
