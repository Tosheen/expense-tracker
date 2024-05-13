import { createFileRoute } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const me = useQuery(userQueryOptions);

  if (me.isPending) {
    return <div className="p-2 max-w-lg mx-auto">Loading user...</div>;
  }

  if (me.isError && me.error) {
    return <div>Not logged in...</div>;
  }

  if (me.data != null) {
    return (
      <div className="p-2 max-w-lg mx-auto">
        <h2>Hello from profile</h2>
        <p>{me.data.family_name}</p>
      </div>
    );
  }

  return null;
}
