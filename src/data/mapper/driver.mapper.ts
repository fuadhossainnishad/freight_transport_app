// data/mappers/driver.mapper.ts

import { Driver } from "../../presentation/driver/types";
import { normalizeImageUrl } from "../../shared/utils/normalizeImageUrl";


export const mapDriverApiToEntity = (item: any): Driver => {
    console.log("DRIVER API ITEM:", JSON.stringify(item));
    return {
        id: item._id,
        name: item.driver_name,
        // API returns the phone under `number`; older payloads used `phone`.
        phone: item.number ?? item.phone,
        email: item.email,
        country: item.country,
        avatar: normalizeImageUrl(Array.isArray(item.profile_picture) ? item.profile_picture[0] : item.profile_picture),
        licenseFront: normalizeImageUrl(Array.isArray(item.driver_license) ? item.driver_license[0] : item.driver_license),
        licenseBack: normalizeImageUrl(Array.isArray(item.driver_license) ? item.driver_license[1] : undefined),
    };
};