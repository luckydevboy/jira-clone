import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/server/rpc";

import { WORKSPACES_QUERY_KEYS } from "./query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.v1.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.workspaces)[":workspaceId"]["$delete"]
>;

export default function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.v1.workspaces[":workspaceId"].$delete({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEYS.WORKSPACES],
      });
      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEYS.WORKSPACE, data?.$id],
      });
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });

  return mutation;
}
