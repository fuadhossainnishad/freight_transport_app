import { completeTransporterProfile } from "../../data/services/transporterService"

export class CompleteTransporterProfileUseCase {

    static async execute(formData: FormData) {

        if (!formData) {
            throw new Error("Form data missing")
        }

        // ✅ Call service layer
        return await completeTransporterProfile(formData)
    }

}