"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import useCreateWorkspace from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";

/**
  TODO: merge create workspace form and modal
  - src/features/workspaces/components/create-workspace-form.tsx
  - src/features/workspaces/components/workspace-switcher.tsx
  - src/features/workspaces/components/create-workspace-modal.tsx
*/

export default function CreateWorkspaceModal() {
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const isDesktop = useMedia("(min-width: 768px)", true);

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    mutate(
      { form: values },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  }

  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <div className="flex justify-end mb-4">
          <Button>Create workspace</Button>
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Create a new workspace</ResponsiveModalTitle>
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
                      <Input {...field} placeholder="Enter workspace name" />
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
                <Button type="button" variant="secondary" disabled={isPending}>
                  Cancel
                </Button>
              </ResponsiveModalClose>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                Create Workspace
              </Button>
            </ResponsiveModalFooter>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
