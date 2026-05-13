from collections import defaultdict

class ConnectionManager:

    def __init__(self):
        self.rooms = defaultdict(dict)

    async def connect(
        self,
        websocket,
        room_id,
        user_id
    ):

        await websocket.accept()

        # LIMIT 2 USERS
        if len(self.rooms[room_id]) >= 2:

            await websocket.close()

            return

        self.rooms[room_id][user_id] = websocket

        print(f"{user_id} joined {room_id}")

        print(
            "ROOM USERS:",
            len(self.rooms[room_id])
        )

        # SEND READY TO FIRST USER
        if len(self.rooms[room_id]) == 2:

            users = list(
                self.rooms[room_id].values()
            )

            print("SENDING READY")

            await users[0].send_json({
                "type": "ready"
            })

    def disconnect(
        self,
        room_id,
        user_id
    ):

        if user_id in self.rooms[room_id]:

            del self.rooms[room_id][user_id]

            print(f"{user_id} disconnected")

        if len(self.rooms[room_id]) == 0:
            del self.rooms[room_id]

    async def broadcast(
        self,
        room_id,
        sender_id,
        message
    ):

        print("BROADCAST:", message["type"])

        for uid, socket in self.rooms[room_id].items():

            if uid != sender_id:

                await socket.send_json(message)

manager = ConnectionManager()