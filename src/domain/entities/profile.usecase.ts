import { updateProfile } from "../../data/services/profileService";
import { UserProfile } from "../entities/user.entity";
import { User } from "../../app/context/Auth.type";

export const updateProfileUseCase = async (
  user: Pick<User, "role" | "shipper_id" | "transporter_id">,
  payload: UserProfile
) => {
  return await updateProfile(user, payload);
};