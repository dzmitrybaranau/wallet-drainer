interface OpenSeaNftsDataGraphQlResponse {
  data: {
    searchItems: {
      pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
      };
      edges: any[];
    };
  };
}

export async function fetchAllPages({
  address,
  chainName,
}: {
  address: string;
  chainName: string;
}) {
  fetch(
    `https://api.opensea.io/api/v2/chain/${chainName}/account/${address}/nfts`,
    {
      headers: {
        "x-api-key": "d2f359fca8204e41a674307513e9139a",
      },
    },
  );
}
