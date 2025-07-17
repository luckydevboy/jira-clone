import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { WORKSPACES_QUERY_KEYS } from "@/features/workspaces/api/query-keys";
import { client } from "@/lib/server/rpc";

import { AUTH_QUERY_KEYS } from "./query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-out"]["$post"]
>;

export default function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.v1.auth["sign-out"].$post();

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Signed out successfully");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEYS.WORKSPACES],
      });
    },
    onError: () => {
      toast.error("Failed to sign out");
    },
  });

  return mutation;
}
