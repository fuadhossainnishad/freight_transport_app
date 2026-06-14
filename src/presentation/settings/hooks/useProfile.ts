import { useEffect, useState } from "react";
import { ProfileService } from "../../../data/services/profileService";
import { useAuth } from "../../../app/context/Auth.context";

export interface ProfileData {
  _id?: string;
  user_id?: string;
  company_name?: string;
  company_address?: string;
  logo?: string;
  email?: string | null;
  phone?: string | null;
  [key: string]: any;
}

export const useProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: ProfileData | undefined;

        if (user?.role === "TRANSPORTER" && user?.transporter_id) {
          data = await ProfileService.getTransporterProfile(user.transporter_id);
        } else if (user?.shipper_id) {
          data = await ProfileService.getShipperProfile(user.shipper_id);
        }

        setProfile(data ?? null);
      } catch (err: any) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.role, user?.shipper_id, user?.transporter_id]);

  return { profile, loading, error };
};
