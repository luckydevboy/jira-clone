import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, PROFILES_ID, WORKSPACES_ID } from "@/config";
import { MEMBER_ROLE } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/server/middlewares/session-middleware";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const profile = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
      Query.equal("userId", user.$id),
    ]);

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("profile", profile.documents[0].$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { total: 0, documents: [] } });
    }

    const workspaceIds = members.documents.map(
      (member) => member.workspace.$id
    );

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    // Fetch all members for each workspace
    const workspaceMembersMap: { [key: string]: Models.Document[] } = {};
    for (const workspace of workspaces.documents) {
      const membersRes = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspace", workspace.$id)]
      );
      workspaceMembersMap[workspace.$id] = membersRes.documents;
    }

    // TODO: Don't append current user to the workspace members. So this is workspaceWithOtherMembers
    // TODO: Make role passed to the client to be lowercase but the first letter to be uppercase
    // Attach members to each workspace
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workspacesWithMembers: ({ [key: string]: any } & {
      members: Models.Document[];
      $id: string;
      $collectionId: string;
      $databaseId: string;
      $createdAt: string;
      $updatedAt: string;
      $permissions: string[];
    })[] = workspaces.documents.map((workspace) => ({
      ...workspace,
      members: workspaceMembersMap[workspace.$id] || [],
      role: workspaceMembersMap[workspace.$id].find(
        (member) => member.profile.$id === profile.documents[0].$id
      )?.role as MEMBER_ROLE,
    }));

    return c.json({
      data: { ...workspaces, documents: workspacesWithMembers },
    });
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
          inviteCode: generateInviteCode(4),
        }
      );

      const profile = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
        Query.equal("userId", user.$id),
      ]);

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        profile: profile.documents[0].$id,
        workspace: workspace.$id,
        role: MEMBER_ROLE.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const profile = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
      Query.equal("userId", user.$id),
    ]);

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("profile", profile.documents[0].$id),
      Query.equal("workspace", workspaceId),
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

      const profile = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
        Query.equal("userId", user.$id),
      ]);

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("profile", profile.documents[0].$id),
        Query.equal("workspace", workspaceId),
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
