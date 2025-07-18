"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeftRight, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MEMBER_ROLE } from "@/features/members/types";

import DeleteWorkspaceModal from "../delete-workspace-modal";
import SwitchWorkspaceModal from "../switch-workspace-modal";
import UpdateWorkspaceModal from "../update-workspace-modal";

export type Workspace = {
  id: string;
  name: string;
  createdAt: string;
  members: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
  }[];
  role: MEMBER_ROLE;
};

function Actions({ data }: { data: Workspace }) {
  const { id: workspaceId, name, role } = data;

  const [openDialog, setOpenDialog] = useState<
    "switch" | "edit" | "delete" | null
  >(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenDialog("switch")}>
            <ArrowLeftRight />
            Switch
          </DropdownMenuItem>
          {role === MEMBER_ROLE.ADMIN && (
            <DropdownMenuItem onClick={() => setOpenDialog("edit")}>
              <Pencil />
              Edit
            </DropdownMenuItem>
          )}
          {role === MEMBER_ROLE.ADMIN && (
            <DropdownMenuItem onClick={() => setOpenDialog("delete")}>
              <Trash />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteWorkspaceModal
        isOpen={openDialog === "delete"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        data={{ name, workspaceId }}
      />
      <UpdateWorkspaceModal
        isOpen={openDialog === "edit"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        data={{ name, workspaceId }}
      />
      <SwitchWorkspaceModal
        isOpen={openDialog === "switch"}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        data={{ name, workspaceId }}
      />
    </>
  );
}

export const columns: ColumnDef<Workspace>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue() as string);
      return date.toLocaleDateString("en-US");
    },
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ cell }) => {
      const members = cell.getValue() as {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any;
        $id: string;
        $collectionId: string;
        $databaseId: string;
        $createdAt: string;
        $updatedAt: string;
        $permissions: string[];
      }[];

      return (
        <div className="flex items-center gap-1">
          {members.map((member) => (
            <Tooltip key={member.$id}>
              <TooltipTrigger>
                <Avatar>
                  <AvatarFallback>
                    {member.profile.firstName.charAt(0)}
                    {member.profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {member.profile.firstName} {member.profile.lastName}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions data={row.original} />,
  },
];
