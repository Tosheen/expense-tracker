import { useQuery } from "@tanstack/react-query";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { userQueryOptions } from "@/lib/api";

type AuthData = {
  user: UserType | null;
  isFetchingUser: boolean;
};

export function useAuth(): AuthData {
  const user = useQuery(userQueryOptions);

  if (user.isPending) {
    return { user: null, isFetchingUser: true };
  }

  if (user.isError && user.error) {
    return {
      user: null,
      isFetchingUser: false,
    };
  }

  if (user.data != null) {
    return {
      user: user.data,
      isFetchingUser: false,
    };
  }

  return {
    user: null,
    isFetchingUser: false,
  };
}
