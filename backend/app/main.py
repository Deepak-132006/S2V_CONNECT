from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.websocket.signaling import websocket_endpoint

app = FastAPI()

# FRONTEND URL
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(health_router)

# WEBSOCKET
app.websocket("/ws/{room_id}/{user_id}")(websocket_endpoint)