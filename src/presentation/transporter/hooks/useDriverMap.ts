import { useRef, useState } from "react";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { logger } from "../../../shared/utils/logger";
import { Driver } from "../../driver/types";

// null = fetched but not found; undefined = not yet fetched
type DriverMap = Record<string, Driver | null>;

export default function useDriverMap() {
    const [driversMap, setDriversMap] = useState<DriverMap>({});
    const cacheRef = useRef(new Set<string>());

    const fetchDriver = async (driverId: string) => {
        if (!driverId) return;
        if (cacheRef.current.has(driverId)) return;

        cacheRef.current.add(driverId);

        try {
            const driver = await getDriverByIdsUseCase(driverId);
            setDriversMap((prev) => ({ ...prev, [driverId]: driver }));
        } catch (e: any) {
            const is404 = e?.statusCode === 404 || e?.status === 404 ||
                e?.data?.statusCode === 404;

            if (is404) {
                // Driver deleted or not found — store null so UI shows "not found"
                // and keep in cache so we don't retry on every scroll
                setDriversMap((prev) => ({ ...prev, [driverId]: null }));
                logger.warn(`Driver ${driverId} not found (404)`);
            } else {
                // Network/server error — remove from cache to allow retry
                cacheRef.current.delete(driverId);
                logger.error("Driver fetch failed:", e);
            }
        }
    };

    return { driversMap, fetchDriver };
}
