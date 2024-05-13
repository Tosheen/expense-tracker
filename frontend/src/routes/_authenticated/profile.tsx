import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { user } = Route.useRouteContext();

  if (user != null) {
    return (
      <div className="p-2">
        <h2>Hello from profile</h2>
        <p>{user.family_name}</p>
        <p>
          <a href="/api/logout">Log out!</a>
        </p>
      </div>
    );
  }

  return null;
}
