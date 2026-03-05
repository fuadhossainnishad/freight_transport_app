export const isTransporterProfileComplete = (profile: any) => {
    if (
        !profile.registration_certificate ||
        !profile.transport_license ||
        !profile.insurance_certificate
    ) {
        return false
    }

    return true
}

export const isShipperProfileComplete = (profile: any[]) => {
    if (!profile || profile.length === 0) return false
    return true
}