import { useState } from "react";
import { UserProfile } from "../../../domain/entities/user.entity";
import { updateProfileUseCase } from "../../../domain/entities/profile.usecase";
import { useAuth } from "../../../app/context/Auth.context";

export const useUpdateProfile = () => {

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: UserProfile) => {
    try {

      setLoading(true);
      setError(null);

      const res = await updateProfileUseCase(
        {
          role: user?.role,
          shipper_id: user?.shipper_id,
          transporter_id: user?.transporter_id,
        },
        payload
      );

      return res;

    } catch (err: any) {

      setError(err?.message || "Profile update failed");
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
};