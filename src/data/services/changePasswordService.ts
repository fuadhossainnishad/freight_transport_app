import { logger } from '../../shared/utils/logger';
import axiosClient from "../../shared/config/axios.config"
import { UserProfile, ChangePassword } from '../../domain/entities/user.entity';

export const ChangePasswordService = async (
    payload: ChangePassword
): Promise<UserProfile> => {

    const { data } = await axiosClient.patch("/profile/edit", payload);
    logger.info("ChangePasswordService:", data.data)
    return data.data;
};