import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useReviewSubmit = () => useMutation(orpc.reviewSubmissions.submit.mutationOptions());