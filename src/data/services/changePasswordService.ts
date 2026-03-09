import axiosClient from "../../shared/config/axios.config"
import { UserProfile, ChangePassword } from '../../domain/entities/user.entity';

export const ChangePasswordService = async (
    payload: ChangePassword
): Promise<UserProfile> => {

    const { data } = await axiosClient.patch("/profile/edit", payload);
    console.log("ChangePasswordService:", data.data)
    return data.data;
};