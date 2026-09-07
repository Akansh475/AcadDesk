import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUser, updateUser } from "../api/userApi";

function getStoredUserId() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored).id : null;
  } catch {
    return null;
  }
}

export function useProfile() {
  const queryClient = useQueryClient();
  const userId = getStoredUserId();
  const queryKey = ["user", userId];

  const profileQuery = useQuery({
    queryKey,
    queryFn: () => fetchUser(userId),
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateMutation = useMutation({
    mutationFn: (payload) => updateUser(userId, payload),
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey });
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem("user", JSON.stringify({ ...parsed, ...updatedData }));
          window.dispatchEvent(new Event("userUpdated"));
        }
      } catch (e) {
        console.error("Failed to sync localStorage user:", e);
      }
      showToast("Profile updated successfully", "success");
    },
    onError: () => {
      showToast("Failed to update, try again", "error");
    },
  });

  const validatePhone = (phone) => {
    if (!/^\d{10}$/.test(phone)) {
      return "Enter a valid 10-digit phone number";
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
        try {
          await updateMutation.mutateAsync({ profile_photo: e.target.result });
          resolve(null);
        } catch (err) {
          resolve("Failed to upload photo");
        }
      };
      reader.onerror = () => resolve("Failed to read file");
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = async () => {
    try {
      await updateMutation.mutateAsync({ profile_photo: null });
      return null;
    } catch (err) {
      return "Failed to remove photo";
    }
  };

  return {
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
    isSaving: updateMutation.isPending,
    toast,
    savePhone,
    savePhoto,
    removePhoto,
    validatePhone,
  };
}