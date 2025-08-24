import { useMutation } from '@tanstack/react-query';
import { sendFrame } from '../api/frameApi';

export function useSendFrame() {
  return useMutation({
    mutationFn: (imageData: string) => sendFrame(imageData),
    onSuccess: (data) => {
      console.log('Frame sent successfully:', data.file);
    },
    onError: (error) => {
      console.error('Failed to send frame:', error);
    },
  });
}