// domain/usecases/getTransporterDrivers.usecase.ts

import { Driver } from "../../presentation/driver/types";
import { getTransporterDrivers } from "../entities/driver.entity";


export const getTransporterDriversUseCase = async (
    transporterId: string,
    searchTerm?: string
): Promise<Driver[]> => {
    if (!transporterId) throw new Error("Transporter ID is required");

    return await getTransporterDrivers(transporterId, searchTerm);
};