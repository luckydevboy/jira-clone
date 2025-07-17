import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/server/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.v1.workspaces[":workspaceId"]["$patch"](
        {
          form,
          param,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated");

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });

  return mutation;
};
