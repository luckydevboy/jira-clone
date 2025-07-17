import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

export default async function WorkspaceIdPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <div className="font-medium text-md">Workspace Page</div>;
}
