"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiservice";
import ConfirmationModal from "../components/forms/ConfirmationModal";
import { resetAuthCookies } from "../lib/actions";

type UserProfile = {
  email: string;
  is_verified: boolean;
  image?: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    showCancelButton?: boolean;
  }>({
    title: "",
    message: "",
    showCancelButton: true,
  });

  useEffect(() => {
    if (isDeleted) {
      console.log("User deleted, skipping profile fetch");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userData: UserProfile = await apiService.get("/api/auth/profile/");
        setProfile(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isDeleted]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setEditImage(file);
      } else {
        setError("Only image files are allowed.");
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      if (editImage) {
        formData.append("image", editImage);
      }

      // Send the patch request to update the profile
      await apiService.patch("/api/auth/profile/", formData);

      // After the patch is successful, fetch the updated profile data
      const updatedUserData: UserProfile = await apiService.get("/api/auth/profile/");
      setProfile(updatedUserData); // Update the local profile state with the new data
      setEditImage(null);
      setError(null);

      setModalConfig({
        title: "Success",
        message: "Your profile has been updated successfully!",
        confirmText: "OK",
        showCancelButton: false,
      });
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleDeleteProfile = () => {
    setModalConfig({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete your profile? This action cannot be undone.",
      onConfirm: confirmDeleteProfile,
      confirmText: "Yes, Delete",
      showCancelButton: true,
    });
    setIsModalOpen(true);
  };

  const confirmDeleteProfile = async () => {
    try {
      console.log("Deleting profile...");
      await apiService.delete("/api/auth/delete-profile/");

      // Call logout API to clear cookies
      // await fetch("/api/logout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // Reset authentication cookies
      resetAuthCookies();

      setIsDeleted(true);
      setIsModalOpen(false);
      console.log("Profile deleted and cookies cleared, redirecting to /");
      router.replace("/"); // Replace to avoid history issues

   
    
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete profile";
      console.error("Delete error:", errorMessage);
      setError(errorMessage);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Change Profile</h1>
      <p className="mb-2">{profile?.email}</p>

      <div className="mb-4">
        <label className="block mb-1">User:</label>
        <input
          type="text"
          value={profile?.email || ""}
          disabled
          className="border p-2 rounded w-full bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Image:</label>
        {profile?.image && (
          <img src={profile.image} alt="Profile" className="w-24 h-24 mb-2 rounded" />
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Verified:</label>
        <p>{profile?.is_verified ? "Yes" : "No"}</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleUpdateProfile}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={handleDeleteProfile}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete Profile
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        showCancelButton={modalConfig.showCancelButton}
      />
    </div>
  );
};

export default ProfilePage;