import { updateProfile } from "../../data/services/profileService";
import { UserProfile } from "../entities/user.entity";

export const updateProfileUseCase = async (
  payload: UserProfile
) => {
  return await updateProfile(payload);
};