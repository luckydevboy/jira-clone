"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import z from "zod";

import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useGetWorkspaces from "@/features/workspaces/api/use-get-workspaces";
import { cn } from "@/lib/utils";

import useCreateWorkspace from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";

interface Workspace {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export default function WorkspaceSwitcher() {
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const isDesktop = useMedia("(min-width: 768px)", true);
  const router = useRouter();
  const { workspaceId } = useParams();

  useEffect(() => {
    if (workspaces) {
      if (workspaceId) {
        setSelectedWorkspace(
          workspaces.documents.find(
            (workspace) => workspace.$id === workspaceId
          )
        );
      } else {
        setSelectedWorkspace(workspaces.documents[0]);
      }
    }
  }, [workspaceId, workspaces]);

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    mutate(
      { form: values },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  }

  function handleClickDropDownMenuItem(workspace: Workspace) {
    setSelectedWorkspace(workspace);
    router.push(`/workspaces/${workspace.$id}`);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ResponsiveModal>
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isLoading || !workspaces?.total}
              asChild
            >
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-accent text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  {isLoading ? (
                    <>
                      <span className="font-medium">Workspace</span>
                      <span className="font-light text-xs">Loading...</span>
                    </>
                  ) : workspaces?.total ? (
                    <>
                      <span className="font-medium">Workspace</span>
                      <span className="font-light text-xs">
                        {selectedWorkspace?.name}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">No workspaces</span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width)"
              align="start"
            >
              <div className="max-h-48 overflow-y-auto">
                {workspaces?.documents.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.$id}
                    onSelect={() => handleClickDropDownMenuItem(workspace)}
                  >
                    {workspace.name}
                    {workspace.$id === selectedWorkspace?.$id && (
                      <Check className="ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
              <Separator className="my-1" />
              <ResponsiveModalTrigger asChild>
                <DropdownMenuItem>Add workspace</DropdownMenuItem>
              </ResponsiveModalTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <ResponsiveModalContent>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                Create a new workspace
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                Create a new workspace to organize your tasks and projects.
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ResponsiveModalBody className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="gap-3">
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter workspace name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ResponsiveModalBody>
                <ResponsiveModalFooter
                  className={cn(
                    isDesktop ? "justify-between! mt-4" : "flex-col-reverse"
                  )}
                >
                  <ResponsiveModalClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </ResponsiveModalClose>
                  <Button
                    type="submit"
                    disabled={isPending}
                    isLoading={isPending}
                  >
                    Create Workspace
                  </Button>
                </ResponsiveModalFooter>
              </form>
            </Form>
          </ResponsiveModalContent>
        </ResponsiveModal>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
