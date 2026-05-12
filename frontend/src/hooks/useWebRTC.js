import { useEffect, useRef, useState } from "react";

export default function useWebRTC() {

  const localVideoRef = useRef(null);

  const remoteVideoRef = useRef(null);

  const streamRef = useRef(null);

  const peerRef = useRef(null);

  const socketRef = useRef(null);

  const [micOn, setMicOn] = useState(true);

  const [cameraOn, setCameraOn] =
    useState(true);

  const [connected, setConnected] =
    useState(false);

  const [callEnded, setCallEnded] =
    useState(false);

  const roomId = "room1";

  const userIdRef = useRef(
    Math.random().toString(36).slice(2, 8)
  );

  const userId = userIdRef.current;

  useEffect(() => {

    const startCamera = async () => {

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = mediaStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject =
          mediaStream;
      }

    };

    startCamera();

  }, []);

  const toggleMic = () => {

    streamRef.current
      ?.getAudioTracks()
      .forEach(track => {
        track.enabled = !track.enabled;
      });

    setMicOn(prev => !prev);

  };

  const toggleCamera = () => {

    streamRef.current
      ?.getVideoTracks()
      .forEach(track => {
        track.enabled = !track.enabled;
      });

    setCameraOn(prev => !prev);

  };

  const endCall = () => {

    streamRef.current
      ?.getTracks()
      .forEach(track => track.stop());

    peerRef.current?.close();

    socketRef.current?.close();

    setConnected(false);

    setCallEnded(true);

  };

  return {
    localVideoRef,
    remoteVideoRef,
    streamRef,
    micOn,
    cameraOn,
    connected,
    callEnded,
    toggleMic,
    toggleCamera,
    endCall,
  };
}