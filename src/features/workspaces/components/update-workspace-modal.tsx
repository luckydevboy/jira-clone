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
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
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

import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schemas";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    name: string;
    workspaceId: string;
  };
}

export default function UpdateWorkspaceModal({
  isOpen,
  onOpenChange,
  data: { name, workspaceId },
}: Props) {
  const { mutate, isPending } = useUpdateWorkspace();
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name,
    },
  });
  const isDesktop = useMedia("(min-width: 768px)", true);

  function onSubmit(values: z.infer<typeof updateWorkspaceSchema>) {
    mutate(
      { form: values, param: { workspaceId } },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Update workspace</ResponsiveModalTitle>
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
                Update Workspace
              </Button>
            </ResponsiveModalFooter>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
