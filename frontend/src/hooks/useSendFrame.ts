import { useMutation } from "@tanstack/react-query";
import { sendFrameForPrediction } from "../api/frameApi";

interface SendFrameVariables {
  imageData: string;
  roomId: string;
  userId: string;
}

export function useSendFrame() {
  return useMutation({
    mutationFn: (variables: SendFrameVariables) =>
      sendFrameForPrediction(
        variables.imageData,
        variables.roomId,
        variables.userId
      ),

    onSuccess: () => {
      console.log("Frame sent successfully");
    },
    onError: (error) => {
      console.error("Failed to send frame:", error);
    },
  });
}
