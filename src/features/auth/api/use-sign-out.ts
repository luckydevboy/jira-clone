import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/server/rpc";

import { AuthQueryKeys } from "./query-keys.enum";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-out"]["$post"]
>;

export default function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.v1.auth["sign-out"].$post();

      return response.json();
    },
    onSuccess: () => {
      toast.success("Signed out successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.CurrentUser] });
    },
    onError: () => {
      toast.error("Failed to sign out");
    },
  });

  return mutation;
}
