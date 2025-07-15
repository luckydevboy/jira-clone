import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MEMBER_ROLE } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/server/middlewares/session-middleware";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { total: 0, documents: [] } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { name } = c.req.valid("form");

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          inviteCode: generateInviteCode(4),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MEMBER_ROLE.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
      Query.equal("workspaceId", workspaceId),
    ]);
    const member = members.documents[0];

    if (!member || member.role !== MEMBER_ROLE.ADMIN) {
      return c.json({ data: null, error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name } = c.req.valid("form");

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("userId", user.$id),
        Query.equal("workspaceId", workspaceId),
      ]);
      const member = members.documents[0];

      if (!member || member.role !== MEMBER_ROLE.ADMIN) {
        return c.json({ data: null, error: "Unauthorized" }, 401);
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
        }
      );

      return c.json({ data: workspace });
    }
  );
const workspacesRoutes = app;
export default workspacesRoutes;
