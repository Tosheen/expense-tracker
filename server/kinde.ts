import { createMiddleware } from "hono/factory";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN as string,
    clientId: process.env.KINDE_CLIENT_ID as string,
    clientSecret: process.env.KINDE_CLIENT_SECRET as string,
    redirectURL: process.env.KINDE_REDIRECT_URI as string,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI as string,
  }
);

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const userMiddleware = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (isAuthenticated === false) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const user = await kindeClient.getUserProfile(manager);

    c.set("user", user);
    await next();
  } catch (error) {
    console.log({
      error,
    });
  }
});
