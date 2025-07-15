"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useCreateWorkspace from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";

export default function CreateWorkspaceForm() {
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

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

  // TODO: I think its better to remove card wrapper around each pages of the dashboard
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new workspace</CardTitle>
        <CardDescription>
          Create a new workspace to organize your tasks and projects.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <Button
              className="ml-auto"
              type="submit"
              disabled={isPending}
              isLoading={isPending}
            >
              Create Workspace
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
