// data/mappers/driver.mapper.ts

import { Driver } from "../../presentation/driver/types";
import { normalizeImageUrl } from "../../shared/utils/normalizeImageUrl";


export const mapDriverApiToEntity = (item: any): Driver => ({
    id: item._id,
    name: item.driver_name,
    // API returns the phone under `number`; older payloads used `phone`.
    phone: item.number ?? item.phone,
    email: item.email,
    country: item.country,
    avatar: normalizeImageUrl(item.profile_picture?.[0]),
    licenseFront: normalizeImageUrl(item.driver_license?.[0]),
    licenseBack: normalizeImageUrl(item.driver_license?.[1]),
});