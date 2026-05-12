import { useEffect, useRef, useState } from "react";

export default function useMeetingLogic() {

  // =========================
  // STATES
  // =========================

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [captionsEnabled, setCaptionsEnabled] =
    useState(false);

  const [handRaised, setHandRaised] =
    useState(false);

  const [meetingLink, setMeetingLink] =
    useState("");

  const [flyingEmojis, setFlyingEmojis] =
    useState([]);

  // =========================
  // REFS
  // =========================

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const streamRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  // =========================
  // CAMERA
  // =========================

  const startCamera = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

    } catch (err) {
      console.log(err);
    }

  };

  // =========================
  // PEER
  // =========================

  const createPeer = () => {

    if (peerRef.current) {
      return peerRef.current;
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peer.ontrack = (event) => {

      const remoteStream = event.streams[0];

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject =
          remoteStream;
      }

      setConnected(true);

    };

    peerRef.current = peer;

    return peer;

  };

  // =========================
  // SOCKET
  // =========================

  const connectSocket = () => {

    socketRef.current = new WebSocket(
      "ws://localhost:8000/ws/room1/user1"
    );

  };

  // =========================
  // MIC
  // =========================

  const toggleMic = () => {

    streamRef.current
      ?.getAudioTracks()
      .forEach(track => {
        track.enabled = !track.enabled;
      });

    setMicOn(prev => !prev);

  };

  // =========================
  // CAMERA
  // =========================

  const toggleCamera = () => {

    streamRef.current
      ?.getVideoTracks()
      .forEach(track => {
        track.enabled = !track.enabled;
      });

    setCameraOn(prev => !prev);

  };

  // =========================
  // EMOJI
  // =========================

  const sendEmoji = (emoji) => {

    const id = Date.now();

    setFlyingEmojis(prev => [
      ...prev,
      { id, emoji },
    ]);

    setTimeout(() => {

      setFlyingEmojis(prev =>
        prev.filter(item => item.id !== id)
      );

    }, 4000);

  };

  // =========================
  // RAISE HAND
  // =========================

  const toggleHand = () => {

    setHandRaised(prev => !prev);

  };

  // =========================
  // CAPTIONS
  // =========================

  const toggleCaptions = () => {

    setCaptionsEnabled(prev => !prev);

  };

  // =========================
  // CHAT
  // =========================

  const sendMessage = (text) => {

    if (!text.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        sender: "You",
        text,
      },
    ]);

  };

  // =========================
  // LINK
  // =========================

  const createMeetingLink = () => {

    const roomId =
      Math.random().toString(36).substring(2, 10);

    const link =
      `https://s2v-connect.vercel.app/room/${roomId}`;

    setMeetingLink(link);

    navigator.clipboard.writeText(link);

  };

  // =========================
  // END CALL
  // =========================

  const endCall = () => {

    streamRef.current
      ?.getTracks()
      .forEach(track => track.stop());

    peerRef.current?.close();

    socketRef.current?.close();

  };

  // =========================
  // INIT
  // =========================

  useEffect(() => {

    const init = async () => {

      await startCamera();

      connectSocket();

    };

    init();

    return () => {

      streamRef.current
        ?.getTracks()
        .forEach(track => track.stop());

      peerRef.current?.close();

      socketRef.current?.close();

    };

  }, []);

  return {

    micOn,
    toggleMic,

    cameraOn,
    toggleCamera,

    connected,

    localVideoRef,
    remoteVideoRef,

    chatOpen,
    setChatOpen,

    messages,
    setMessages,

    captionsEnabled,
    toggleCaptions,

    handRaised,
    toggleHand,

    meetingLink,
    setMeetingLink,
    createMeetingLink,

    flyingEmojis,
    sendEmoji,

    endCall,

  };

}