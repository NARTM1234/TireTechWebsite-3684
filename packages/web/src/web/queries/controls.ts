import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useControls = () => useQuery(orpc.controls.all.queryOptions({ retry: false, staleTime: 30000 }));
export function useElementSave() {
  const q = useQueryClient();
  return useMutation(
    orpc.controls.saveElement.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}
export function useReviewSave() {
  const q = useQueryClient();
  return useMutation(
    orpc.controls.saveReview.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}
export function useReviewRemove() {
  const q = useQueryClient();
  return useMutation(
    orpc.controls.removeReview.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}
export function useReviewOrder() {
  const q = useQueryClient();
  return useMutation(
    orpc.controls.reorder.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}
export function useLinkSave() {
  const q = useQueryClient();
  return useMutation(
    orpc.controls.saveLink.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}
export function useLinkRemove() {
  const q = useQueryClient();
  return useMutation(
    orpc.controls.removeLink.mutationOptions({ onSuccess: () => q.invalidateQueries() }),
  );
}
