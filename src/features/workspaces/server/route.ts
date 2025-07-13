import { ID, Models } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/server/middlewares/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

import { createWorkspaceSchema } from "../schemas";

const app = new Hono().post(
  "/",
  zValidator("form", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("form");

    let file: Models.File | undefined = undefined;

    if (image instanceof File) {
      file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageId: file?.$id,
      }
    );

    return c.json({ data: workspace });
  }
);

const workspacesRoutes = app;
export default workspacesRoutes;
