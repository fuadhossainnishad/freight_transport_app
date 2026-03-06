import { completeShipperProfile } from "../../data/services/shipperService"

export class CompleteShipperProfileUseCase {

    static async execute(payload: any) {

        // ✅ Add business logic here if needed
        // Example: Validate required fields before API call

        if (!payload.shipper_id) {
            throw new Error("Shippe­r ID is required")
        }

        if (!payload.company_address) {
            throw new Error("Company address is required")
        }

        // ✅ Call service layer
        return await completeShipperProfile(payload)
    }

}