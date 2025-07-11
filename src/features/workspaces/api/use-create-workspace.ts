import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/server/rpc";

import { WorkspacesQueryKeys } from "./query-keys.enum";

type ResponseType = InferResponseType<
  (typeof client.api.v1.workspaces)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.v1.workspaces)["$post"]>;

export default function useCreateWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.workspaces.$post({
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({
        queryKey: [WorkspacesQueryKeys.Workspaces],
      });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });

  return mutation;
}
