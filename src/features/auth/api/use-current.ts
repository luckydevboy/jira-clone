import { client } from "@/lib/server/rpc";
import { useQuery } from "@tanstack/react-query";

import { AuthQueryKeys } from "./query-keys.enum";

export default function useCurrent() {
  const query = useQuery({
    queryKey: [AuthQueryKeys.CurrentUser],
    queryFn: async () => {
      const response = await client.api.v1.auth.current.$get();

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
