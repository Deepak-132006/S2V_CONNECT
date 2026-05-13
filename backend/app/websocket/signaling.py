from fastapi import WebSocket
from app.websocket.manager import manager

async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    user_id: str
):

    await manager.connect(
        websocket,
        room_id,
        user_id
    )

    try:

        while True:

            data = await websocket.receive_json()

            print(data)

            await manager.broadcast(
                room_id,
                user_id,
                data
            )

    except Exception as e:

        print("Disconnected", e)

        manager.disconnect(
            room_id,
            user_id
        )