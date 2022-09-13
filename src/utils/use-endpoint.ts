import useSWR, { SWRResponse } from 'swr';

function fetcher<Result>(url: string): Promise<Result> {
  return fetch(url).then(response => response.json());
}

export function useEndpoint<Result>(url: string): SWRResponse<Result> {
  return useSWR<Result>(url, fetcher);
}
