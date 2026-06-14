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

type ProfileUpdateUser = {
    role?: "SHIPPER" | "TRANSPORTER" | "DRIVER";
    shipper_id?: string;
    transporter_id?: string;
};

// A locally-picked image has a file:// / content:// uri. A value fetched from
// the backend is a remote https:// url that must NOT be re-uploaded as a file.
const isLocalFile = (uri?: string) =>
    !!uri && !/^https?:\/\//i.test(uri);

export const updateProfile = async (
    user: ProfileUpdateUser,
    payload: UserProfile
): Promise<UserProfile> => {

    // Transporter: backend route accepts multipart with `company_name` + `logo`.
    if (user.role === "TRANSPORTER") {
        const formData = new FormData();
        formData.append("company_name", payload.name);

        if (payload.avatar && isLocalFile(payload.avatar.uri)) {
            formData.append("logo", {
                uri: payload.avatar.uri,
                name: payload.avatar.name,
                type: payload.avatar.type,
            } as any);
        }

        const { data } = await axiosClient.patch(
            `/transporter/edit/${user.transporter_id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        return data.data;
    }

    // Shipper: backend route only updates `company_name` (JSON, no file upload).
    const { data } = await axiosClient.patch(
        `/shipper/edit/${user.shipper_id}`,
        { company_name: payload.name }
    );

    return data.data;
};