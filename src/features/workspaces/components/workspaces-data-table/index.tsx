"use client";

import { Button } from "@/components/ui/button";

import useGetWorkspaces from "../../api/use-get-workspaces";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function WorkspacesDataTable() {
  const { data, isLoading } = useGetWorkspaces();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-end">
        <Button variant="secondary" className="mb-4">
          Create workspace
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={
          data?.documents.map((doc) => ({
            id: doc.$id,
            name: doc.name,
            members: [],
          })) ?? []
        }
      />
    </>
  );
}
