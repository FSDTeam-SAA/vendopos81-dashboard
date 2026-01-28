export function createSocket(userId?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";
    const socketUrl = userId 
        ? `${baseUrl}/notification/admin/${userId}`
        : `${baseUrl}/notification`;
    return new WebSocket(socketUrl);
}