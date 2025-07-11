"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createWorkspaceSchema } from "../schema";
import useCreateWorkspace from "../api/use-create-workspace";

export default function CreateWorkspaceForm() {
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    mutate({ json: values });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new workspace</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
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
            <Separator className="mt-4" />
            <div className="flex justify-between">
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
