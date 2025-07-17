import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { Client, Databases, ID } from "node-appwrite";

import {
  APPWRITE_ENDPOINT,
  APPWRITE_KEY,
  APPWRITE_PROJECT_ID,
  DATABASE_ID,
  PROFILES_ID,
} from "@/config";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { createAdminClient } from "@/lib/server/appwrite";
import { sessionMiddleware } from "@/lib/server/middlewares/session-middleware";

import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return c.json({ success: true });
  })
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { email, password, firstName, lastName } = c.req.valid("json");

    const { account } = await createAdminClient();
    const user = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    // Create profile document
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_KEY);
    const databases = new Databases(client);
    await databases.createDocument(DATABASE_ID, PROFILES_ID, ID.unique(), {
      userId: user.$id,
      firstName,
      lastName,
      email,
    });

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return c.json({ success: true });
  })
  .post("/sign-out", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  });

const authRoutes = app;
export default authRoutes;
