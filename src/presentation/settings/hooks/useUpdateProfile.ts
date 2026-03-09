import { useState } from "react";
import { UserProfile } from "../../../domain/entities/user.entity";
import { updateProfileUseCase } from "../../../domain/entities/profile.usecase";

export const useUpdateProfile = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: UserProfile) => {
    try {

      setLoading(true);
      setError(null);

      const res = await updateProfileUseCase(payload);

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