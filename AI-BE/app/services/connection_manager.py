from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, message: dict, room_id: str, sender: WebSocket):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                if connection != sender:
                    await connection.send_json(message)
    
    async def send_to_user(self, message: dict, target_ws: WebSocket):
        await target_ws.send_json(message)

    def get_other_users_in_room(self, room_id: str, sender: WebSocket) -> List[WebSocket]:
        if room_id in self.rooms:
            return [ws for ws in self.rooms[room_id] if ws != sender]
        return []

manager = ConnectionManager()