import { ProfileService } from "../../data/services/profileService";

export class GetShipperProfileUseCase {

    static async execute(id: string) {
        return await ProfileService.getShipperProfile(id)
    }

}