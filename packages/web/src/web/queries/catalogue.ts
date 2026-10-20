import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useCatalogue = () => useQuery(orpc.catalogue.all.queryOptions({ staleTime: 120000, gcTime: 1800000, refetchOnWindowFocus: false }));
export const useEnquire = () => useMutation(orpc.catalogue.enquire.mutationOptions());
export const useAdmin = () => useQuery(orpc.cms.me.queryOptions({ retry: false }));
export const useCMS = () => useQuery(orpc.cms.all.queryOptions({ retry: false, staleTime: 60000 }));
export function useSave() {
  const q = useQueryClient();
  return useMutation(orpc.cms.save.mutationOptions({ onSuccess: () => q.invalidateQueries() }));
}
export function useRemove() {
  const q = useQueryClient();
  return useMutation(orpc.cms.remove.mutationOptions({ onSuccess: () => q.invalidateQueries() }));
}
export function useStatus() {
  const q = useQueryClient();
  return useMutation(
    orpc.cms.enquiryStatus.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}

export function useEnquiryDelete() {
 const q = useQueryClient();
 return useMutation(orpc.cms.deleteEnquiry.mutationOptions({ onSuccess: () => q.invalidateQueries({ queryKey: orpc.cms.all.key() }) }));
}
