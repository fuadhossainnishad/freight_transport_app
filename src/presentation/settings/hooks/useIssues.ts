import { useState, useCallback } from "react";
import { Issue } from "../../../domain/entities/Issue.entity";
import { fetchAllIssues } from "../../../domain/usecases/issue.usecase";

export const useIssues = (shipperId: string) => {
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]); // FIX: never undefined
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAllIssues(shipperId);

      setIssues(data ?? []);
      return data;
    } catch (err) {
      setError("Failed to load Issues");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [shipperId]);

  return { issues, setIssues, loading, error, loadIssues };
};