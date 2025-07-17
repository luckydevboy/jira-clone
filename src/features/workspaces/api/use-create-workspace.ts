import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/server/rpc";

import { WORKSPACES_QUERY_KEYS } from "./query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.v1.workspaces)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.v1.workspaces)["$post"]>;

export default function useCreateWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.v1.workspaces.$post({
        form,
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEYS.WORKSPACES],
      });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });

  return mutation;
}
