import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApi";

interface Photo {
  id: string;
  url: string;
  caption?: string | null;
  order: number;
  isMain: boolean;
}

interface PhotoUploadData {
  photo: File;
  caption?: string;
  isMain?: boolean;
}

interface PhotoUpdateData {
  photoId: string;
  caption?: string;
  isMain?: boolean;
}

// Custom fetch function for file uploads (multipart/form-data)
// Note: Can't use useApiMutation for file uploads since it sends JSON
async function uploadPhoto(data: PhotoUploadData): Promise<{ photo: Photo }> {
  const formData = new FormData();
  formData.append("photo", data.photo);
  if (data.caption) formData.append("caption", data.caption);
  if (data.isMain !== undefined)
    formData.append("isMain", data.isMain.toString());

  const response = await fetch("/api/user/photos", {
    method: "POST",
    body: formData, // Don't set Content-Type header - browser will set it correctly
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData.error || message;
    } catch {
      // If we can't parse JSON, use status text
    }
    throw new Error(message);
  }

  return response.json();
}

export function usePhotoUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      // Invalidate and refetch profile data to update photos
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Use the existing useApiMutation pattern for JSON requests
export function usePhotoUpdate() {
  const queryClient = useQueryClient();

  return useApiMutation<{ photo: Photo }, PhotoUpdateData>(
    "/api/user/photos",
    "PUT",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
    }
  );
}

export function usePhotoDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      console.log("usePhotoDelete - Starting delete for photoId:", photoId);

      const url = `/api/user/photos?id=${photoId}`;
      console.log("usePhotoDelete - Making DELETE request to:", url);

      const response = await fetch(url, {
        method: "DELETE",
      });

      console.log("usePhotoDelete - Response status:", response.status);
      console.log("usePhotoDelete - Response ok:", response.ok);

      if (!response.ok) {
        let message = response.statusText;
        try {
          const errorData = await response.json();
          console.log("usePhotoDelete - Error response data:", errorData);
          message = errorData.error || message;
        } catch {
          // If we can't parse JSON, use status text
        }
        throw new Error(message);
      }

      const result = await response.json();
      console.log("usePhotoDelete - Success response data:", result);
      return result;
    },
    onSuccess: () => {
      console.log(
        "usePhotoDelete - onSuccess called, invalidating profile query"
      );
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("usePhotoDelete - onError called:", error);
    },
  });
}
