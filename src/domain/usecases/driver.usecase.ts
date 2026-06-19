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
  console.log("fetchDriverById:", driver)
  return mapDriverApiToEntity(driver)
};

// Derive a sensible filename + mime type from a local file uri.
const buildFilePart = (uri: string) => {
  const name = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
  const ext = name.split(".").pop()?.toLowerCase();
  const type =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : ext === "pdf"
          ? "application/pdf"
          : "image/jpeg";
  return { uri, name, type };
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
  formData.append("country", data.country);


  // profile image
  if (data.profilePicture?.length > 0) {
    formData.append("profile_picture", buildFilePart(data.profilePicture[0]) as any);
  }

  // documents
  if (data.driverLicense?.length > 0) {
    data.driverLicense.forEach((uri) => {
      formData.append("driver_license", buildFilePart(uri) as any);
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
  formData.append("country", data.country);

  // profile picture (only if newly picked, not an existing remote url)
  if (data.profilePicture?.length > 0) {
    const uri = data.profilePicture[0];

    if (!uri.startsWith("http")) {
      formData.append("profile_picture", buildFilePart(uri) as any);
    }
  }

  // license files (only newly picked ones)
  if (data.driverLicense?.length > 0) {
    data.driverLicense.forEach((uri) => {
      if (!uri.startsWith("http")) {
        formData.append("driver_license", buildFilePart(uri) as any);
      }
    });
  }

  return await updateDriver(driverId, formData);
};