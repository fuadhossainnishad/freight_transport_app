// data/mappers/driver.mapper.ts

import { Driver } from "../../presentation/driver/types";


export const mapDriverApiToEntity = (item: any): Driver => ({
    id: item._id,
    name: item.driver_name,
    phone: item.number,
    email: item.email,
    avatar: item.profile_picture?.[0],
    licenseFront: item.driver_license?.[0],
    licenseBack: item.driver_license?.[1],
});