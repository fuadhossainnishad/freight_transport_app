// hooks/useDriverMap.ts
import { useRef, useState } from "react";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { logger } from "../../../shared/utils/logger";
import { Driver } from "../../driver/types";

type DriverMap = Record<string, Driver>;

export default function useDriverMap() {
    const [driversMap, setDriversMap] = useState<DriverMap>({});
    const cacheRef = useRef(new Set<string>()); // tracks which ids are already fetched/fetching

    const fetchDriver = async (driverId: string) => {
        if (!driverId) return;
        if (cacheRef.current.has(driverId)) return; // already fetched or in-flight

        cacheRef.current.add(driverId); // mark as in-flight immediately

        try {
            const driver = await getDriverByIdsUseCase(driverId);
            setDriversMap((prev) => ({ ...prev, [driverId]: driver }));
        } catch (e) {
            cacheRef.current.delete(driverId); // allow retry on failure
            logger.error("Driver fetch failed:", e);
        }
    };

    return { driversMap, fetchDriver };
}