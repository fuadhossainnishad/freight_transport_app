import { useState } from "react";
import { Issue } from "../../../domain/entities/Issue.entity";
import { fetchIssueById } from "../../../domain/usecases/issue.usecase";

export const useIssue = (issueId: string) => {
    const [loading, setLoading] = useState(false);
    const [issue, setIssue] = useState<Issue>();
    const [error, setError] = useState<string | null>(null);

    const loadIssue = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchIssueById(issueId)

            setIssue(data!);
            return data;

        } catch (err) {
            setError("Failed to load Issue");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { issue, loading, error, loadIssue };
};