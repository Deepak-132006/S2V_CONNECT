import { useRef, useState } from "react";

export default function useWebRTC() {

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const streamRef = useRef(null);
  const peerRef = useRef(null);

  const [connected, setConnected] = useState(false);

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
        remoteVideoRef.current.srcObject = remoteStream;
      }

      setConnected(true);
    };

    peerRef.current = peer;

    return peer;
  };

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

  const addLocalTracks = () => {

    const peer = createPeer();

    streamRef.current
      ?.getTracks()
      .forEach(track => {

        const alreadyAdded =
          peer.getSenders().find(
            sender => sender.track === track
          );

        if (!alreadyAdded) {
          peer.addTrack(track, streamRef.current);
        }

      });
  };

  return {
    localVideoRef,
    remoteVideoRef,
    streamRef,
    peerRef,
    connected,
    createPeer,
    startCamera,
    addLocalTracks,
    setConnected,
  };
}