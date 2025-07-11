import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/server/rpc";

import { AuthQueryKeys } from "./query-keys.enum";

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

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed up successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.CurrentUser] });
    },
    onError: () => {
      toast.error("Failed to sign up");
    },
  });

  return mutation;
}
