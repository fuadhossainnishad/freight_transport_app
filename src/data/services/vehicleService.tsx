import axiosClient from "../../shared/config/axios.config";

export const searchVehicles = async (
    transporterId: string,
    searchTerm: string
) => {
    const res = await axiosClient.get(
        `/vehicle/transporter/${transporterId}?searchTerm=${searchTerm}`
    );
    console.log("Vehicle search data:", res.data);

    return res.data?.data?.vehicles || [];
};