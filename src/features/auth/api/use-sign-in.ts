import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/server/rpc";

import { AuthQueryKeys } from "./query-keys.enum";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.auth)["sign-in"]["$post"]
>;

export default function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["sign-in"].$post({
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.CurrentUser] });
    },
    onError: () => {
      toast.error("Failed to sign in");
    },
  });

  return mutation;
}
