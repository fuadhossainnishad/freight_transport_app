import { getDriverByIdsUseCase } from "./driver.usecase";
import { getTransporterShipmentsUseCase } from "./shipment.usecase";

export const getTransporterHomeDataUseCase = async (
    transporterId: string,
    page = 1,
    limit = 10
) => {
    // 1. fetch shipments only
    const shipmentRes = await getTransporterShipmentsUseCase(
        transporterId,
        page,
        limit
    );

    const shipments = shipmentRes.shipments;

    // 2. extract driver ids
    const driverIds = shipments
        .map((s) => s.driver_id)
        .filter(Boolean);

    // 3. fetch drivers separately (still using driver use case)
    const driverMap = await getDriverByIdsUseCase();

    // 4. merge (composition only here)
    const enrichedShipments = shipments.map((s) => ({
        ...s,
        driver: driverMap[s.driver_id] || null,
    }));

    return {
        shipments: enrichedShipments,
        pagination: shipmentRes.pagination,
    };
};