import { mapDriverApiToEntity } from "../../data/mapper/driver.mapper";
import { createDriver, fetchDriverById, updateDriver } from "../../data/services/driverService";
import { Driver, DriverEntity } from "../../presentation/driver/types";
import { getTransporterDrivers } from "../entities/driver.entity";


export const getTransporterDriversUseCase = async (
    transporterId: string,
    searchTerm?: string
): Promise<Driver[]> => {
    if (!transporterId) throw new Error("Transporter ID is required");

    return await getTransporterDrivers(transporterId, searchTerm);
};

export const getDriverByIdsUseCase = async (
    driverId: string,
): Promise<Driver> => {
    if (!driverId) throw new Error("Driver ID is required");

    const driver = await fetchDriverById(driverId);
    return mapDriverApiToEntity(driver)
};

export const CreateDriverUseCase = async (
    data: DriverEntity
) => {
    const formData = new FormData();

    // static backend requirement
    formData.append(
        "transporter_id",
        data.transporter_id!
    );

    // mapping fields
    formData.append("driver_name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("country", "BD");


    // profile image
    if (data.idFront?.length > 0) {
        formData.append("profile_picture", {
            uri: data.idFront[0],
            name: "profile.jpg",
            type: "image/jpeg",
        } as any);
    }

    // documents
    if (data.idBack?.length > 0) {
        data.idBack.forEach((uri, index) => {
            formData.append("driver_license", {
                uri,
                name: `license_${index}.jpg`,
                type: "image/jpeg",
            } as any);
        });
    }

    console.log("createDriver formData:", formData)

    return await createDriver(formData);
};


export const UpdateDriverUseCase = async (
  driverId: string,
  data: DriverEntity
) => {
  const formData = new FormData();

  // required
  formData.append("driver_name", data.name);
  formData.append("number", data.phone);
  formData.append("email", data.email);

  // profile picture (only if changed / exists)
  if (data.idFront?.length > 0) {
    const uri = data.idFront[0];

    if (!uri.startsWith("http")) {
      formData.append("profile_picture", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }
  }

  // license files
  if (data.idBack?.length > 0) {
    data.idBack.forEach((uri, index) => {
      if (!uri.startsWith("http")) {
        formData.append("driver_license", {
          uri,
          name: `license_${index}.jpg`,
          type: "image/jpeg",
        } as any);
      }
    });
  }

  return await updateDriver(driverId, formData);
};