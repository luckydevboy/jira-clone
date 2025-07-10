import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/server/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.v1.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.v1.auth)["sign-in"]["$post"]
>;

export default function useSignIn() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.v1.auth["sign-in"].$post({
        json,
      });
      return response.json();
    },
  });

  return mutation;
}
