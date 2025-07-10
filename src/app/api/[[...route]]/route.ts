import { Hono } from "hono";
import { handle } from "hono/vercel";

import authRoutes from "@/features/auth/server/route";

export const runtime = "edge";

const app = new Hono().basePath("/api/v1");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", authRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
