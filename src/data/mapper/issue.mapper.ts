// mappers/issue.mapper.ts

import { Issue } from "../../domain/entities/Issue.entity";

export const mapIssueFromApi = (item: any): Issue => ({
    _id: item._id,
    shipment_id: item.shipment_id,
    transporter_id: item.transporter_id,
    issue_title: item.issue_title,
    reported_on: item.reported_on,
    issue_description: item.issue_description,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});