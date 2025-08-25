import { apiClient } from "./apiClient";

export const sendFrame = async (
  imageData: string
): Promise<{ message: string; file: string }> => {
  const response = await apiClient.post("/frames", { imageData });
  return response.data;
};
