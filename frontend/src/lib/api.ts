import { hc } from "hono/client";
import type { API_ROUTES } from "../../../server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<API_ROUTES>("/");

export const api = client.api;

async function getCurrentUser() {
  try {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
    const response = await api.me.$get();
    if (response.ok === false) {
      throw new Error("server error");
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    throw new Error("server error");
  }
}

export const userQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: getCurrentUser,
  retry: 0,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
});
