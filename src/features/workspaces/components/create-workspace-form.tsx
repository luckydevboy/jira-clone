"use client";

import { useRef } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { createWorkspaceSchema } from "../schemas";
import useCreateWorkspace from "../api/use-create-workspace";

export default function CreateWorkspaceForm() {
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
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
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex gap-4 my-3 items-center">
                  {field.value ? (
                    <div className="size-14 relative rounded-full overflow-hidden">
                      <Image
                        alt="Logo"
                        fill
                        className="object-cover"
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : field.value
                        }
                      />
                    </div>
                  ) : (
                    <Avatar className="size-14">
                      <AvatarFallback>
                        <ImageIcon className="size-7 text-neutral-400" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm">Workspace Image</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, SVG or JPEG, max 1mb
                    </p>
                    <input
                      className="hidden"
                      type="file"
                      accept=".jpg, .png, .jpeg, .svg"
                      ref={inputRef}
                      onChange={handleImageChange}
                      disabled={isPending}
                    />
                    {field.value ? (
                      <Button
                        type="button"
                        disabled={isPending}
                        variant="destructive"
                        size="sm"
                        className="w-fit mt-2"
                        onClick={() => {
                          field.onChange(null);

                          if (inputRef.current) {
                            inputRef.current.value = "";
                          }

                          if (field.value instanceof File) {
                            URL.revokeObjectURL(
                              URL.createObjectURL(field.value)
                            );
                          }
                        }}
                      >
                        Remove Image
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isPending}
                        variant="secondary"
                        size="sm"
                        className="w-fit mt-2"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                    )}
                  </div>
                </div>
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
