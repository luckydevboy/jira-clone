import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/server/rpc";

import { WORKSPACES_QUERY_KEYS } from "./query-keys";

export default function useGetWorkspaces() {
  const query = useQuery({
    queryKey: [WORKSPACES_QUERY_KEYS.WORKSPACES],
    queryFn: async () => {
      const response = await client.api.v1.workspaces.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
