import { mapIssueFromApi } from "../../data/mapper/issue.mapper";
import { deleteSingleIssueAPI, editIssueStatusAPI, getAllIssuesAPI, getShipmentIssuesAPI, getSingleIssueAPI } from "../../data/services/issueService";
import { Issue, IssueSummery } from "../entities/Issue.entity";

// Fetch all issues
export const fetchAllIssues = async (shipperId: string): Promise<Issue[]> => {
    try {
        const response = await getAllIssuesAPI(shipperId);

        // normalize data
        return response.map(mapIssueFromApi);
    } catch (error) {
        console.error("Error fetching all issues:", error);
        return [];
    }
};

// Fetch issues for a specific shipment
export const fetchShipmentIssues = async (shipmentId: string): Promise<Issue[]> => {
    try {
        return await getShipmentIssuesAPI(shipmentId);
    } catch (error) {
        console.error(`Error fetching issues for shipment ${shipmentId}:`, error);
        return [];
    }
};

// Fetch single issue by ID
export const fetchIssueById = async (issueId: string): Promise<IssueSummery | null> => {
    try {
        return await getSingleIssueAPI(issueId);

    } catch (error) {
        console.error(`Error fetching issue ${issueId}:`, error);
        return null;
    }
};

// Edit issue status
export const updateIssueStatus = async (issueId: string, status: boolean): Promise<Issue | null> => {
    try {
        return await editIssueStatusAPI(issueId, status);
    } catch (error) {
        console.error(`Error updating issue ${issueId}:`, error);
        return null;
    }
};

export const deleteIssueStatus = async (issueId: string): Promise<IssueSummery | null> => {
    try {
        return await deleteSingleIssueAPI(issueId);
    } catch (error) {
        console.error(`Error updating issue ${issueId}:`, error);
        return null;
    }
};