import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/server/rpc";

import { AUTH_QUERY_KEYS } from "./query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.auth)["sign-up"]["$post"]
>;

export default function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["sign-up"].$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed up successfully");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.CURRENT_USER],
      });
    },
    onError: () => {
      toast.error("Failed to sign up");
    },
  });

  return mutation;
}
