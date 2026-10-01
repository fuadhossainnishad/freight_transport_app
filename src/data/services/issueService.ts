import { logger } from '../../shared/utils/logger';
import { GET_SHIPMENT_ISSUE, GET_SHIPPER_ISSUES, SINGLE_ISSUE } from "../../domain/constants/api";
import { ApiResponse, Issue, IssueSummery } from "../../domain/entities/Issue.entity";
import axiosClient from "../../shared/config/axios.config";

// GET all shipper issues
export const getAllIssuesAPI = async (shipperId: string): Promise<Issue[]> => {
    logger.info("shipperId:", shipperId)
    const response = await axiosClient.get<ApiResponse<Issue[]>>(
        GET_SHIPPER_ISSUES(shipperId)
    );

    logger.info("API raw response:", response.data);

    return response.data?.data ?? [];
};

// GET issues by shipment ID
export const getShipmentIssuesAPI = async (shipmentId: string): Promise<Issue[]> => {
    const { data } = await axiosClient.get<ApiResponse<Issue[]>>(GET_SHIPMENT_ISSUE(shipmentId));
    return data?.data ?? [];
};

// GET single issue by issue ID
export const getSingleIssueAPI = async (issueId: string): Promise<IssueSummery | null> => {
    logger.info("API raw issueId:", issueId);

    const { data } = await axiosClient.get<ApiResponse<IssueSummery>>(
        SINGLE_ISSUE(issueId)
    );
    logger.info("API raw getSingleIssueAPI:", data);

    return data?.data ?? null;
};

// PATCH edit issue status
export const editIssueStatusAPI = async (issueId: string, status: boolean): Promise<Issue | null> => {
    const { data } = await axiosClient.patch<ApiResponse<Issue>>(SINGLE_ISSUE(issueId), { status });
    return data?.data ?? null;
};

export const deleteSingleIssueAPI = async (issueId: string): Promise<IssueSummery | null> => {
    const { data } = await axiosClient.delete<ApiResponse<IssueSummery>>(SINGLE_ISSUE(issueId));
    return data?.data ?? null;
};