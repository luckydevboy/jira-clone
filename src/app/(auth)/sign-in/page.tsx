import { redirect } from "next/navigation";

import SignInForm from "@/features/auth/components/sign-in-form";
import { getCurrent } from "@/features/auth/queries";

export default async function SignInPage() {
  const user = await getCurrent();
  if (user) redirect("/");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
