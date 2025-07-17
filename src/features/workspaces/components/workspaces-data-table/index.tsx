"use client";

import useGetWorkspaces from "../../api/use-get-workspaces";
import CreateWorkspaceModal from "../create-workspace-modal";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function WorkspacesDataTable() {
  const { data, isLoading } = useGetWorkspaces();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateWorkspaceModal />
      <DataTable
        columns={columns}
        data={
          data?.documents.map((doc) => ({
            id: doc.$id,
            name: doc.name,
            members: doc.members,
            createdAt: doc.$createdAt,
            role: doc.role,
          })) ?? []
        }
      />
    </>
  );
}
