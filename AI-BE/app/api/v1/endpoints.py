from fastapi import APIRouter, WebSocket, WebSocketDisconnect, File, UploadFile, Depends
from app.services.connection_manager import manager
from app.models.detector import detector 
from app.schemas.prediction import PredictionResult
import json

router = APIRouter()

@router.post("/predict/{room_id}/{user_id}", response_model=PredictionResult)
async def predict_frame(room_id: str, user_id: str, file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = detector.predict(image_bytes)
    
    ws_payload = {
        "event": "detection_result",
        "data": {
            "user_id": user_id, 
            "prediction": result
        }
    }
    
    if room_id in manager.rooms:
        for connection in manager.rooms[room_id]:
            await connection.send_json(ws_payload)

    return result


@router.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await manager.connect(websocket, room_id)
    websocket.user_id = user_id

    try:
        other_users = manager.get_other_users_in_room(room_id, websocket)
        other_user_ids = [user.user_id for user in other_users]
        await websocket.send_json({"event": "all users", "data": other_user_ids})
        
        while True:
            data_str = await websocket.receive_text()
            message = json.loads(data_str)
            event = message.get("event")
            data = message.get("data")

            user_to_signal = data.get("userToSignal")
            target_ws = next((ws for ws in manager.rooms.get(room_id, []) if ws.user_id == user_to_signal), None)

            if event == "sending signal" and target_ws:
                await manager.send_to_user({
                    "event": "user joined",
                    "data": {
                        "signal": data["signal"],
                        "callerID": data["callerID"]
                    }
                }, target_ws)

            elif event == "return signal" and target_ws:
                await manager.send_to_user({
                    "event": "receiving returned signal",
                    "data": {
                        "signal": data["signal"],
                        "id": websocket.user_id
                    }
                }, target_ws)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast({"event": "user left", "data": websocket.user_id}, room_id, websocket)