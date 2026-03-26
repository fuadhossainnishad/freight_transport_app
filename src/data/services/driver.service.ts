import axiosClient from "../../shared/config/axios.config";

export const fetchTransporterDrivers = async (
    transporterId: string,
    searchTerm?: string,
    page: number = 1,
    limit: number = 10
) => {
    const params: any = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;

    const res = await axiosClient.get(
        `/driver/transporter/${transporterId}`,
        { params }
    );
    console.log("fetchTransporterDrivers:", res.data)
    return res.data;
};