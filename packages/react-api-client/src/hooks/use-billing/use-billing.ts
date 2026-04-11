import { useQuery, useMutation } from '@tanstack/react-query';
import { client } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

const $getStatus = client.api.billing.status.$get;
export type BillingStatus = ApiSuccessResponse<typeof $getStatus>;

export function useBillingStatus() {
  return useQuery<BillingStatus>({
    queryKey: ['billing', 'status'],
    queryFn: () => fetchApi($getStatus),
  });
}

const $createCheckout = client.api.billing.checkout.$post;

export function useCreateCheckout() {
  return useMutation({
    mutationFn: () => fetchApi($createCheckout),
  });
}

const $createPortal = client.api.billing.portal.$post;

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: () => fetchApi($createPortal),
  });
}
