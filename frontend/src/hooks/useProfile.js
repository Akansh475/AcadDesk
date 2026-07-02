import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUser, updateUser } from "../api/userApi";

const stored = localStorage.getItem("user");
const USER_ID = stored ? JSON.parse(stored).id : null;

export function useProfile() {
  const queryClient = useQueryClient();
  const queryKey = ["user", USER_ID];

  const profileQuery = useQuery({
    queryKey,
    queryFn: () => fetchUser(USER_ID),
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateMutation = useMutation({
    mutationFn: (payload) => updateUser(USER_ID, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast("Profile updated successfully", "success");
    },
    onError: () => {
      showToast("Failed to update, try again", "error");
    },
  });

  const validatePhone = (phone) => {
    if (!/^\d{10}$/.test(phone)) {
      return "Enter a valid 10 digit phone number";
    }
    return null;
  };

  const validatePhoto = (file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return "Only JPG and PNG files are allowed";
    }
    if (file.size > 2 * 1024 * 1024) {
      return "Image too large, max size is 2MB";
    }
    return null;
  };

  const savePhone = async (phone) => {
    const err = validatePhone(phone);
    if (err) return err;
    await updateMutation.mutateAsync({ phone });
    return null;
  };

  const savePhoto = async (file) => {
    const err = validatePhoto(file);
    if (err) return err;
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = async (e) => {
        await updateMutation.mutateAsync({ profile_photo: e.target.result });
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  return {
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    isSaving: updateMutation.isPending,
    toast,
    savePhone,
    savePhoto,
    validatePhone,
  };
}