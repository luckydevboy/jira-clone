import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/server/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-out"]["$post"]
>;

export default function useSignOut() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.v1.auth["sign-out"].$post();
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });

  return mutation;
}
