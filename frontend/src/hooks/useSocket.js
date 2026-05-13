import { useRef } from "react";

export default function useSocket({
  roomId,
  userId,
  createOffer,
  handleOffer,
  handleAnswer,
  handleICE,
  addLocalTracks,
}) {

  const socketRef = useRef(null);

  const connectSocket = () => {

    if (socketRef.current) return;

    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/${roomId}/${userId}`
    );

    socketRef.current.onopen = () => {

      console.log("Socket Connected");

      addLocalTracks();
    };

    socketRef.current.onmessage = async (event) => {
~!
      const data = JSON.parse(event.data);

      switch (data.type) {

        case "ready":
          await createOffer();
          break;

        case "offer":
          await handleOffer(data.offer);
          break;

        case "answer":
          await handleAnswer(data.answer);
          break;

        case "ice-candidate":
          await handleICE(data.candidate);
          break;
      }
    };
  };

  return {
    socketRef,
    connectSocket,
  };
}