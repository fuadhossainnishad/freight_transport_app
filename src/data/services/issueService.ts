import { GET_SHIPMENT_ISSUE, GET_SHIPPER_ISSUE, SINGLE_ISSUE } from "../../domain/constants/api";
import { Issue } from "../../domain/entities/Issue.entity";
import axiosClient from "../../shared/config/axios.config";

// GET all issues
export const getAllIssuesAPI = async (shipperId: string): Promise<Issue[]> => {
    const { data } = await axiosClient.get(GET_SHIPPER_ISSUE(shipperId));
    console.log("getAllIssuesAPI:", data)
    return data || [];
};

// GET issues by shipment ID
export const getShipmentIssuesAPI = async (shipmentId: string): Promise<Issue[]> => {
    const { data } = await axiosClient.get(GET_SHIPMENT_ISSUE(shipmentId));
    return data || [];
};

// GET single issue by issue ID
export const getSingleIssueAPI = async (issueId: string): Promise<Issue | null> => {
    const { data } = await axiosClient.get(SINGLE_ISSUE(issueId));
    return data || null;
};

// PATCH edit issue status
export const editIssueStatusAPI = async (issueId: string, status: boolean): Promise<Issue | null> => {
    const { data } = await axiosClient.patch(SINGLE_ISSUE(issueId), { status });
    return data || null;
};

export const deleteSingleIssueAPI = async (issueId: string): Promise<Issue | null> => {
    const { data } = await axiosClient.delete(SINGLE_ISSUE(issueId));
    return data || null;
};