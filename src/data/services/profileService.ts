import { GET_SHIIPER_PROFILE, GET_TRANSPORTER_PROFILE } from './../../domain/constants/api';
import axiosClient from "../../shared/config/axios.config"
import { UserProfile } from '../../domain/entities/user.entity';

export const ProfileService = {

    async getTransporterProfile(id: string) {
        try {
            const res = await axiosClient.get(GET_TRANSPORTER_PROFILE(id))
            console.log("GET_TRANSPORTER_PROFILE:", res.data.data)
            return res.data?.data
        } catch (error) {
            console.error("Transporter profile fetch error:", error)
            throw error
        }
    },

    async getShipperProfile(id: string) {
        try {
            const res = await axiosClient.get(GET_SHIIPER_PROFILE(id))
            console.log("GET_SHIIPER_PROFILE:", res.data.data)
            return res.data?.data
        } catch (error) {
            console.error("Shipper profile fetch error:", error)
            throw error
        }
    },

}

export const updateProfile = async (
    payload: UserProfile
): Promise<UserProfile> => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);

    if (payload.avatar) {
        formData.append("avatar", {
            uri: payload.avatar.uri,
            name: payload.avatar.name,
            type: payload.avatar.type,
        } as any);
    }
    const { data } = await axiosClient.patch(
        "/profile/edit",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data.data;
};