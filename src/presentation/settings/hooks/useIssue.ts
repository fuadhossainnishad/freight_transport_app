import { useState, useEffect, useCallback } from "react";
import { fetchIssueById } from "../../../domain/usecases/issue.usecase";
import { IssueSummery } from "../../../domain/entities/Issue.entity";

export const useIssue = (issueId: string) => {
    const [loading, setLoading] = useState(false);
    const [issue, setIssue] = useState<IssueSummery | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadIssue = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchIssueById(issueId);

            if (data) setIssue(data);
        } catch (err) {
            setError("Failed to load Issue");
        } finally {
            setLoading(false);
        }
    }, [issueId]);

    useEffect(() => {
        if (issueId) {
            loadIssue();
        }
    }, [issueId, loadIssue]);

    return { issue, loading, error, loadIssue };
};