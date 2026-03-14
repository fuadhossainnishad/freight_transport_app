import {
  getFaqs,
  getInfo,
  reportShipmentIssue,
} from "../../data/services/settingsService";

export const fetchFaqsUseCase = async () => {
  return await getFaqs();
};

export const fetchAboutUseCase = async (infoType: string) => {
  return await getInfo(infoType);
};

export const reportShipmentIssueUseCase = async (
  shipmentId: string,
  message: string
) => {
  return await reportShipmentIssue(shipmentId, message);
};