import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/server/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.auth)["sign-up"]["$post"]
>;

export default function useSignUp() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["sign-up"].$post({
        json,
      });
      return response.json();
    },
  });

  return mutation;
}
