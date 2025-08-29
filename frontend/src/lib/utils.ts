export function base64ToBlob(
  base64: string,
  contentType: string = "image/jpeg"
): Blob {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export function getWebSocketURL(roomId: string, userId: string): string {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const wsProtocol = backendUrl.startsWith("https") ? "wss" : "ws";
  const cleanUrl = backendUrl.replace(/^(https?:\/\/)/, "");
  return `${wsProtocol}://${cleanUrl}/api/v1/ws/${roomId}/${userId}`;
}
