import { ChangePasswordService } from "../../data/services/changePasswordService";
import { ChangePassword } from "./user.entity";

export const changePasswordUseCase = async (
  payload: ChangePassword
) => {
  return await ChangePasswordService(payload);
};