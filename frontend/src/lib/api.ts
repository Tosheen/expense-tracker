import { hc } from "hono/client";
import type { API_ROUTES } from "../../../server/app";

const client = hc<API_ROUTES>("/");

export const api = client.api;
