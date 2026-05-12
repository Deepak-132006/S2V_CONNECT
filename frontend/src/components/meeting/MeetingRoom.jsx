import { useEffect, useRef, useState } from "react";

import TopBar from "./TopBar.jsx";
import VideoSection from "./VideoSection.jsx";
import ChatSidebar from "./ChatSidebar.jsx";
import BottomBar from "./BottomBar.jsx";

export default function MeetingRoom() {
  const streamRef = useRef(null);

const peerRef = useRef(null);

const socketRef = useRef(null);

const localVideoRef = useRef(null);

const remoteVideoRef = useRef(null);

const emojiRef = useRef(null);

const hoverTimeout = useRef(null);

const userIdRef = useRef(
  Math.random().toString(36).slice(2, 8)
);

const userId = userIdRef.current;

const roomId = "room1";

const [showOptionsMenu, setShowOptionsMenu] =
  useState(false);

const [showEmojiMenu, setShowEmojiMenu] =
  useState(false);

const [micOn, setMicOn] =
  useState(true);

const [cameraOn, setCameraOn] =
  useState(true);

const [callEnded, setCallEnded] =
  useState(false);

const [connected, setConnected] =
  useState(false);

const [selectedLanguage, setSelectedLanguage] =
  useState("English");

const [chatOpen, setChatOpen] =
  useState(false);

const [chatMessage, setChatMessage] =
  useState("");

const [messages, setMessages] =
  useState([]);

const [captionsEnabled, setCaptionsEnabled] =
  useState(false);

const [handRaised, setHandRaised] =
  useState(false);

const [meetingLink, setMeetingLink] =
  useState("");

const [flyingEmojis, setFlyingEmojis] =
  useState([]);


useEffect(() => {

  const handleClickOutside =
    (event) => {

      if (
        emojiRef.current &&
        !emojiRef.current.contains(
          event.target
        )
      ) {

        setShowEmojiMenu(false);

      }

    };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);



const startCamera = async () => {

  try {

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

  } catch (err) {

    console.log(err);

  }

};
    startCamera();

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

  peer.onicecandidate = (event) => {

    if (
      event.candidate &&
      socketRef.current?.readyState ===
        WebSocket.OPEN
    ) {

      socketRef.current.send(
        JSON.stringify({
          type: "ice-candidate",
          candidate: event.candidate,
        })
      );

    }

  };

  peer.onconnectionstatechange = () => {

    console.log(
      "STATE:",
      peer.connectionState
    );

  };

  peerRef.current = peer;

  return peer;

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

        peer.addTrack(
          track,
          streamRef.current
        );

      }

    });

};

const connectSocket = () => {

  if (socketRef.current) return;

  socketRef.current = new WebSocket(
    `ws://localhost:8000/ws/${roomId}/${userId}`
  );

  socketRef.current.onopen = () => {

    console.log("Socket Connected");

    addLocalTracks();

  };

  socketRef.current.onmessage =
    async (event) => {

      const data =
        JSON.parse(event.data);

      switch (data.type) {

        case "ready":
          await createOffer();
          break;

        case "offer":
          await handleOffer(
            data.offer
          );
          break;

        case "answer":
          await handleAnswer(
            data.answer
          );
          break;

        case "ice-candidate":
          await handleICE(
            data.candidate
          );
          break;

      }

    };

};

const createOffer = async () => {

  const peer = createPeer();

  addLocalTracks();

  const offer =
    await peer.createOffer();

  await peer.setLocalDescription(
    offer
  );

  socketRef.current.send(
    JSON.stringify({
      type: "offer",
      offer,
    })
  );

};

const handleOffer = async (offer) => {

  const peer = createPeer();

  addLocalTracks();

  await peer.setRemoteDescription(
    new RTCSessionDescription(
      offer
    )
  );

  const answer =
    await peer.createAnswer();

  await peer.setLocalDescription(
    answer
  );

  socketRef.current.send(
    JSON.stringify({
      type: "answer",
      answer,
    })
  );

};

const handleAnswer = async (
  answer
) => {

  const peer = createPeer();

  await peer.setRemoteDescription(
    new RTCSessionDescription(
      answer
    )
  );

};

const handleICE = async (
  candidate
) => {

  try {

    const peer = createPeer();

    await peer.addIceCandidate(
      new RTCIceCandidate(
        candidate
      )
    );

  } catch (err) {

    console.log(err);

  }

};

useEffect(() => {

  const init = async () => {

    await startCamera();

    connectSocket();

  };

  init();

  return () => {

    streamRef.current
      ?.getTracks()
      .forEach(track =>
        track.stop()
      );

    peerRef.current?.close();

    socketRef.current?.close();

  };

}, []);


const toggleMic = () => {

  if (!streamRef.current) return;

  streamRef.current
    .getAudioTracks()
    .forEach(track => {

      track.enabled =
        !track.enabled;

    });

  setMicOn(prev => !prev);

};

const toggleCamera = () => {

  if (!streamRef.current) return;

  streamRef.current
    .getVideoTracks()
    .forEach(track => {

      track.enabled =
        !track.enabled;

    });

  setCameraOn(prev => !prev);

};

const endCall = () => {

  streamRef.current
    ?.getTracks()
    .forEach(track =>
      track.stop()
    );

  peerRef.current?.close();

  socketRef.current?.close();

  peerRef.current = null;

  socketRef.current = null;

  setConnected(false);

  setCallEnded(true);

};
const sendEmoji = (emoji) => {

  const id = Date.now();

  setFlyingEmojis(prev => [

    ...prev,

    {
      id,
      emoji,
    },

  ]);

  setTimeout(() => {

    setFlyingEmojis(prev =>
      prev.filter(
        item => item.id !== id
      )
    );

  }, 4000);

};

const createMeetingLink = () => {

  const roomId =
    Math.random()
      .toString(36)
      .substring(2, 10);

  const link =
    `https://s2v-connect.vercel.app/room/${roomId}`;

  setMeetingLink(link);

  navigator.clipboard.writeText(
    link
  );

};

const sendMessage = () => {

  if (!chatMessage.trim()) return;

  setMessages(prev => [

    ...prev,

    {
      sender: "You",
      text: chatMessage,
    },

  ]);

  setChatMessage("");

};


 

  return (

    <div className="w-full h-screen bg-[#f1ECF4] overflow-hidden text-[#111827]">

      <div className="w-full h-full flex flex-col p-4 gap-4">

        <TopBar
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />

        <div className="flex-1 flex flex-col xl:flex-row gap-4 overflow-hidden">

          <VideoSection
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            cameraOn={cameraOn}
            callEnded={callEnded}
            connected={connected}
            handRaised={handRaised}
            captionsEnabled={captionsEnabled}
            flyingEmojis={flyingEmojis}
          />

          {chatOpen && (

            <ChatSidebar
              messages={messages}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              setMessages={setMessages}
              setChatOpen={setChatOpen}
            />

          )}

        </div>

        <BottomBar
          micOn={micOn}
          toggleMic={toggleMic}
          cameraOn={cameraOn}
          toggleCamera={toggleCamera}
          endCall={endCall}

          showEmojiMenu={showEmojiMenu}
          setShowEmojiMenu={setShowEmojiMenu}
          sendEmoji={sendEmoji}
          emojiRef={emojiRef}

          meetingLink={meetingLink}
          setMeetingLink={setMeetingLink}
          createMeetingLink={createMeetingLink}

          showOptionsMenu={showOptionsMenu}
          setShowOptionsMenu={setShowOptionsMenu}
          hoverTimeout={hoverTimeout}

          setCaptionsEnabled={setCaptionsEnabled}
          captionsEnabled={captionsEnabled}

          setChatOpen={setChatOpen}
          chatOpen={chatOpen}

          handRaised={handRaised}
          setHandRaised={setHandRaised}
        />

      </div>

    </div>

  );

}