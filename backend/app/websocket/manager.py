from collections import defaultdict

class ConnectionManager:

    def __init__(self):
        self.active_connections = defaultdict(dict)

    async def connect(self, room_id, user_id, websocket):
        await websocket.accept()
        self.active_connections[room_id][user_id] = websocket

    def disconnect(self, room_id, user_id):
        if user_id in self.active_connections[room_id]:
            del self.active_connections[room_id][user_id]

    async def send_to_room(
        self,
        room_id,
        sender_id,
        message
    ):
        room = self.active_connections[room_id]

        for user_id, connection in room.items():

            if user_id != sender_id:
                await connection.send_json(message)

manager = ConnectionManager()