import axiosClient from "../../shared/config/axios.config";

export const searchDrivers = async (
    transporterId: string,
    searchTerm: string
) => {
    const res = await axiosClient.get(
        `/driver/transporter/${transporterId}?searchTerm=${searchTerm}`
    );
    console.log("Driver search data:", res.data);
    return res.data?.data?.drivers || [];
};