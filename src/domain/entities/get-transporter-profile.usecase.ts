import { ProfileService } from "../../data/services/profileService";

export class GetTransporterProfileUseCase {

  static async execute(id: string) {
    return await ProfileService.getTransporterProfile(id)
  }

}