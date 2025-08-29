import { base64ToBlob } from "../lib/utils";
import { apiClient } from "./apiClient";

interface PredictionResult {
  label: string;
  confidence_real: number;
  confidence_fake: number;
}

export const sendFrameForPrediction = async (
  imageData: string,
  roomId: string,
  userId: string
): Promise<PredictionResult> => {
  const imageBlob = base64ToBlob(imageData);
  const formData = new FormData();
  formData.append("file", imageBlob, "frame.jpg");

  const response = await apiClient.post<PredictionResult>(
    `/predict/${roomId}/${userId}`,
    formData
  );

  return response.data;
};
