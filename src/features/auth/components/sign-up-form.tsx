"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import useSignUp from "@/features/auth/api/use-sign-up";
import { signUpSchema } from "@/features/auth/schemas";
import { cn } from "@/lib/utils";

export default function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { mutate, isPending } = useSignUp();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="font-black text-center text-3xl">JiraClone</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a new account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button
                    isLoading={isPending}
                    disabled={isPending}
                    type="submit"
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
