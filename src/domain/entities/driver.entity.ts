// data/repositories/driver.repository.ts

import { mapDriverApiToEntity } from "../../data/mapper/driver.mapper";
import { fetchTransporterDrivers } from "../../data/services/driver.service";
import { Driver } from "../../presentation/driver/types";


export const getTransporterDrivers = async (
    transporterId: string,
    searchTerm?: string
): Promise<Driver[]> => {
    const res = await fetchTransporterDrivers(transporterId, searchTerm);
    return res?.data?.drivers?.map(mapDriverApiToEntity) || [];
};