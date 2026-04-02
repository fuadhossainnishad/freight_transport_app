export interface Issue {
    _id: string;
    shipment_id: string;
    transporter_id: string;
    issue_title: string;
    reported_on: string;
    issue_description: string;
    status: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export type IssueStatusUI = "Pending" | "Resolved";

export const mapIssueStatus = (status: boolean): IssueStatusUI =>
    status ? "Resolved" : "Pending";

export interface IssueSummery {
    issue_id: string;
    shipment_id: string;
    transporter_name: string;
    issue_title: string;
    reported_on: string;
    issue_description: string;
    status: boolean;

}
