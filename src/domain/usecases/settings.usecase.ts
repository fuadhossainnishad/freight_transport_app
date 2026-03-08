import {
  getFaqs,
  getAbout,
  reportShipmentIssue,
} from "../../data/services/settingsService";

export const fetchFaqsUseCase = async () => {
  return await getFaqs();
};

export const fetchAboutUseCase = async () => {
  return await getAbout();
};

export const reportShipmentIssueUseCase = async (
  shipmentId: string,
  message: string
) => {
  return await reportShipmentIssue(shipmentId, message);
};