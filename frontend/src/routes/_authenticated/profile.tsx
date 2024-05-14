import { createFileRoute } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { user } = Route.useRouteContext();

  if (user != null) {
    const InitialNameLetter = user.given_name.substring(0, 1);
    return (
      <div className="p-2 space-y-4">
        <div className="flex items-center gap-2">
          <Avatar>
            {user.picture ? (
              <AvatarImage src={user.picture} alt={InitialNameLetter} />
            ) : null}
            <AvatarFallback>{InitialNameLetter}</AvatarFallback>
          </Avatar>
          <p>
            {user.given_name} {user.family_name}
          </p>
        </div>
        <div>
          <Button asChild>
            <a href="/api/logout">Log out!</a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
