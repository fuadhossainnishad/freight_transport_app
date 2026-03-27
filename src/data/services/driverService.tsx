import { DELETE_DRIVER, GET_DRIVER, GET_DRIVERS, POST_DRIVER, UPDATE_DRIVER } from "../../domain/constants/api";
import axiosClient from "../../shared/config/axios.config";

export const searchDrivers = async (
    transporterId: string,
    searchTerm: string
) => {
    const res = await axiosClient.get(
        `${GET_DRIVERS(transporterId)}?searchTerm=${searchTerm}`
    );
    console.log("Driver search data:", res.data);
    return res.data?.data?.drivers || [];
};

export const fetchTransporterDrivers = async (
    transporterId: string,
    searchTerm?: string,
    page: number = 1,
    limit: number = 10
) => {
    const params: any = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;

    const res = await axiosClient.get(
        GET_DRIVERS(transporterId),
        { params }
    );
    console.log("fetchDrivers:", res.data)
    return res.data;
};

export const fetchDriverById = async (driverId: string) => {
    const res = await axiosClient.get(GET_DRIVER(driverId));
    console.log("fetchDriverById:", res.data.data)
    return res.data.data
};


export const createDriver = async (formData: FormData) => {
    console.log("createDriver formData:", formData)

    const res = await axiosClient.post(
        POST_DRIVER,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    console.log("createDriver:", res.data)

    return res.data;
};

export const updateDriver = async (driverId: string, formData: FormData) => {
    const res = await axiosClient.patch(UPDATE_DRIVER(driverId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteDriver = async (driverId: string) => {
    const res = await axiosClient.delete(DELETE_DRIVER(driverId));
    return res.data;
};