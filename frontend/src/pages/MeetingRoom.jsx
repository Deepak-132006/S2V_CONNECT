import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Languages,
  MoreVertical,
} from "lucide-react";

export default function MeetingRoom() {
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [showConversationMenu, setShowConversationMenu] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [flyingEmojis, setFlyingEmojis] = useState([]);

const [chatMessage, setChatMessage] = useState("");

const [messages, setMessages] = useState([]);
  // STATES
const [showOptionsMenu, setShowOptionsMenu] = useState(false);

const [captionsEnabled, setCaptionsEnabled] = useState(false);

const [handRaised, setHandRaised] = useState(false);



const [emojiReaction, setEmojiReaction] = useState("");

//const meetingLink = "https://s2v-meet.vercel.app/room/12345";


  const [stream, setStream] = useState(null);

  const [micOn, setMicOn] = useState(true);

  const [cameraOn, setCameraOn] = useState(true);

  const [callEnded, setCallEnded] = useState(false);

  const [connected, setConnected] = useState(false);

  const [showConversation, setShowConversation] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    startCamera();
  }, []);

  // START CAMERA
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      // LOCAL VIDEO
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

    } catch (error) {
      console.log("Permission denied:", error);
    }
  };

  // MIC TOGGLE
  const toggleMic = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMicOn(!micOn);
  };

  // CAMERA TOGGLE
  const toggleCamera = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCameraOn(!cameraOn);
  };

  // END CALL
  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setCallEnded(true);
  };

  // CONNECT CALL
  const connectCall = () => {
    setConnected(true);
  };

  return (
    <div className="w-full h-screen bg-[#0F172A] overflow-hidden">

      <div className="w-full h-full flex flex-col p-4 lg:p-6 gap-4">

        {/* TOP BAR */}
        <div className="w-full min-h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-between px-5 py-3">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* HAMBURGER */}
            <button className="w-11 h-11 rounded-xl bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center transition">

              <div className="flex flex-col gap-1">
                <span className="w-5 h-[2px] bg-white rounded-full"></span>
                <span className="w-5 h-[2px] bg-white rounded-full"></span>
                <span className="w-5 h-[2px] bg-white rounded-full"></span>
              </div>

            </button>
            

            {/* TITLE */}
            <h1 className="text-lg md:text-xl font-semibold text-cyan-400">
              S2V Live Meet
            </h1>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* LANGUAGE */}
            <div className="relative">

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="
                  bg-[#1E293B]
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-gray-700
                  outline-none
                  cursor-pointer
                  text-sm
                  appearance-none
                  pr-10
                "
              >

                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Malayalam</option>
                <option>Kannada</option>
                <option>Telugu</option>
                <option>Marathi</option>

              </select>

              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
                <Languages size={18} className="text-cyan-400" />
              </div>

            </div>

            {/* MORE */}
            <button className="w-11 h-11 rounded-xl bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center transition">

              <MoreVertical size={20} />

            </button>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col xl:flex-row gap-4 overflow-hidden">

          {/* VIDEO SECTION */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">

            {/* MY VIDEO */}
            <div className="flex-1 relative rounded-3xl bg-[#111827] border border-cyan-500/20 overflow-hidden min-h-[300px]">

              {!callEnded && cameraOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                  Camera Off
                </div>
                
              )}

              {/* MY LABEL */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-white border border-white/10">
                You
              </div>

              {/* AI STATUS */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-cyan-400/20">
                <p className="text-sm text-cyan-300">
                  ✋ Hand Tracking Active
                </p>
              </div>
              {/* FLYING EMOJIS */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">

  {flyingEmojis.map((item, index) => (
    <div
      key={item.id}
      className="absolute bottom-6 text-xl md:text-2xl animate-[gmeetFloat_4s_ease-in-out_forwards]"
      style={{
        left: `calc(50% + ${(index % 4) * 12 - 24}px)`,
        animationDelay: `${index * 0.15}s`,
      }}
    >
      {item.emoji}
    </div>
  ))}

</div>

            </div>

            {/* PEER VIDEO */}
            <div className="flex-1 relative rounded-3xl bg-[#111827] border border-purple-500/20 overflow-hidden min-h-[300px]">

              {connected && !callEnded ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">

                  <div className="w-24 h-24 rounded-full bg-[#1E293B] flex items-center justify-center text-3xl mb-4">
                    👤
                  </div>

                  <p className="text-lg">
                    Waiting for participant...
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    Peer-to-peer connection ready
                  </p>

                  <button
                    onClick={connectCall}
                    className="mt-6 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition"
                  >
                    Connect Peer
                  </button>


                </div>
              )}

              {/* PEER LABEL */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-white border border-white/10">
                Participant
              </div>

              {/* LIVE CAPTION */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/20 max-w-[70%]">

                <p className="text-sm text-white">
                  Real-time captions appear here...
                </p>
                {/* FLYING EMOJIS */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">

  {flyingEmojis.map((item) => (
    <div
      key={item.id}
      className="absolute bottom-10 text-5xl animate-[floatUp_4s_linear_forwards]"
      style={{
        left: `${Math.random() * 80}%`,
      }}
    >
      {item.emoji}
    </div>
  ))}

</div>

              </div>

            </div>
          </div>
        {/* CHAT PANEL */}
{chatOpen && (
  <div className="w-full xl:w-[350px] bg-[#111827] border border-gray-800 rounded-3xl flex flex-col overflow-hidden">

    {/* HEADER */}
    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">

      <div>

        <h2 className="text-lg font-semibold text-cyan-400">
          Meeting Chat
        </h2>

        <p className="text-xs text-gray-400 mt-1">
          Live participant messages
        </p>

      </div>

      <button
        onClick={() => setChatOpen(false)}
        className="text-gray-400 hover:text-white text-xl"
      >
        ✕
      </button>

    </div>

    {/* CHAT MESSAGES */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">

      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
          No messages yet
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "You"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === "You"
                  ? "bg-cyan-500 text-white"
                  : "bg-[#1E293B] text-gray-200"
              }`}
            >

              <p className="text-xs opacity-70 mb-1">
                {msg.sender}
              </p>

              <p className="text-sm break-words">
                {msg.text}
              </p>

            </div>

          </div>
        ))
      )}

    </div>

    {/* INPUT */}
    <div className="p-4 border-t border-gray-800 flex gap-3">

      <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Type message..."
        className="
          flex-1
          bg-[#1E293B]
          border
          border-gray-700
          rounded-2xl
          px-4
          py-3
          outline-none
          text-white
          focus:border-cyan-400
        "
      />

      <button
        onClick={() => {

          if (!chatMessage.trim()) return;

          setMessages([
            ...messages,
            {
              sender: "You",
              text: chatMessage,
            },
          ]);

          setChatMessage("");

        }}
        className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-medium"
      >
        Send
      </button>

    </div>

  </div>
)}

          {/* CONVERSATION PANEL */}
          {showConversation && (
            <div className="w-full xl:w-[340px] bg-[#111827] border border-gray-800 rounded-3xl p-5 flex flex-col">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-xl font-semibold text-cyan-400">
                  Conversation
                </h2>

                <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                  LIVE
                </div>

              </div>

              {/* LANGUAGE */}
              <div className="bg-[#1E293B] rounded-2xl p-4 border border-cyan-500/10 mb-4">

                <p className="text-xs text-gray-400 mb-2">
                  Selected Language
                </p>

                <p className="text-cyan-300">
                  {selectedLanguage}
                </p>

              </div>

              {/* LIVE CHAT */}
              <div className="flex-1 overflow-y-auto">

                <div className="bg-[#1E293B] rounded-2xl p-4 border border-purple-500/10">

                  <p className="text-xs text-purple-300 mb-2">
                    Waiting for captions
                  </p>

                  <p className="text-gray-300">
                    Real-time sign-to-text and voice captions will appear here.
                  </p>

                </div>

              </div>

            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="w-full flex justify-center py-2">

          <div className="bg-[#111827] border border-gray-800 px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl flex-wrap justify-center">

            {/* MIC */}
            <button
              onClick={toggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                micOn
                  ? "bg-[#1E293B] hover:bg-[#334155]"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {micOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            {/* CAMERA */}
            <button
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                cameraOn
                  ? "bg-[#1E293B] hover:bg-[#334155]"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {cameraOn ? <Video size={22} /> : <VideoOff size={22} />}
            </button>

            {/* END CALL */}
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition shadow-2xl"
            >
              <PhoneOff size={28} />
            </button>

            {/* CONVERSATION MENU */}
<div className="relative">

  <button
    onClick={() => setShowConversationMenu(!showConversationMenu)}
    className="px-5 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition font-medium"
  >
    Conversation
  </button>

  {/* DROPDOWN */}
  {showConversationMenu && (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-60 bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">

      {/* SIGN TO VOICE */}
      <button
        className="
          w-full
          text-left
          px-5
          py-4
          hover:bg-[#1E293B]
          transition
          border-b
          border-gray-800
        "
      >
        <p className="text-white font-medium">
          Sign → Voice
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Convert sign language into speech
        </p>
      </button>

      {/* SIGN TO TEXT */}
      <button
        className="
          w-full
          text-left
          px-5
          py-4
          hover:bg-[#1E293B]
          transition
          border-b
          border-gray-800
        "
      >
        <p className="text-white font-medium">
          Sign → Text
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Convert sign language into captions
        </p>
      </button>

      {/* VOICE TO TEXT */}
      <button
        className="
          w-full
          text-left
          px-5
          py-4
          hover:bg-[#1E293B]
          transition
        "
      >
        <p className="text-white font-medium">
          Voice → Text
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Convert voice into live subtitles
        </p>
      </button>

    </div>
  )}

</div>

{/* MORE OPTIONS */}
<div className="relative">

  {/* BUTTON */}
  <button
    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
    className="w-14 h-14 rounded-full bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center transition"
  >
    <MoreVertical size={22} />
  </button>

 {/* OPTIONS PANEL */}
{showOptionsMenu && (
  <div className="
    fixed
bottom-24
left-1/2
-translate-x-1/2
    bg-[#111827]
    border
    border-gray-700
    rounded-3xl
    shadow-2xl
    z-50
    p-4
    max-w-[95vw]
    overflow-x-auto
  ">

    <div className="flex items-center gap-4">

      {/* SHARE SCREEN */}
      <button
        onClick={() => {

          navigator.mediaDevices.getDisplayMedia({
            video: true,
          });

          

        }}
        className="
          min-w-[110px]
          h-[110px]
          rounded-3xl
          bg-[#1E293B]
          hover:bg-[#334155]
          transition
          flex
          flex-col
          items-center
          justify-center
        "
      >

        <span className="text-3xl mb-2">
          🖥️
        </span>

        <p className="text-xs text-white">
          Screen
        </p>

      </button>

      {/* CAPTIONS */}
      <button
        onClick={() => {

          setCaptionsEnabled(!captionsEnabled);

          

        }}
        className="
          min-w-[110px]
          h-[110px]
          rounded-3xl
          bg-[#1E293B]
          hover:bg-[#334155]
          transition
          flex
          flex-col
          items-center
          justify-center
        "
      >

        <span className="text-3xl mb-2">
          💬
        </span>

        <p className="text-xs text-white">
          Captions
        </p>

        <p className="text-[10px] text-cyan-400 mt-1">
          {captionsEnabled ? "ON" : "OFF"}
        </p>

      </button>

      {/* ADD PEOPLE */}
      <button
        onClick={() => {

          alert("Invite participant feature connected later.");

          setShowOptionsMenu(false);

        }}
        className="
          min-w-[110px]
          h-[110px]
          rounded-3xl
          bg-[#1E293B]
          hover:bg-[#334155]
          transition
          flex
          flex-col
          items-center
          justify-center
        "
      >

        <span className="text-3xl mb-2">
          👥
        </span>

        <p className="text-xs text-white">
          Add People
        </p>

      </button>

      {/* CREATE LINK */}
      <div className="
        min-w-[220px]
        min-h-[110px]
        rounded-3xl
        bg-[#1E293B]
        p-4
        flex
        flex-col
        justify-center
      ">

        {!meetingLink ? (

          <button
            onClick={() => {

              const roomId =
                Math.random().toString(36).substring(2, 10);

              const generatedLink =
                `https://s2v-meet.vercel.app/room/${roomId}`;

              setMeetingLink(generatedLink);

              navigator.clipboard.writeText(generatedLink);

            }}
            className="w-full h-full flex flex-col items-center justify-center"
          >

            <span className="text-3xl mb-2">
              🔗
            </span>

            <p className="text-xs text-white">
              Create Link
            </p>

          </button>

        ) : (

          <>

            <p className="text-[10px] text-cyan-400 mb-2">
              Meeting Link
            </p>

            <div className="bg-[#0F172A] rounded-xl px-3 py-2 text-[10px] text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap mb-3">
              {meetingLink}
            </div>

            <button
              onClick={() => {

                navigator.clipboard.writeText(meetingLink);

                setMeetingLink("");

              }}
              className="
                py-2
                rounded-xl
                bg-cyan-500
                hover:bg-cyan-600
                text-xs
                font-medium
                transition
              "
            >
              Copy
            </button>

          </>

        )}

      </div>

      {/* HAND RAISE */}
      <button
        onClick={() => {

          setHandRaised(!handRaised);

          setShowOptionsMenu(false);

        }}
        className="
          min-w-[110px]
          h-[110px]
          rounded-3xl
          bg-[#1E293B]
          hover:bg-[#334155]
          transition
          flex
          flex-col
          items-center
          justify-center
        "
      >

        <span className="text-3xl mb-2">
          ✋
        </span>

        <p className="text-xs text-white">
          {handRaised ? "Lower" : "Raise"}
        </p>

      </button>

      {/* CHAT */}
      <button
        onClick={() => {

          setChatOpen(!chatOpen);

          setShowOptionsMenu(false);

        }}
        className="
          min-w-[110px]
          h-[110px]
          rounded-3xl
          bg-[#1E293B]
          hover:bg-[#334155]
          transition
          flex
          flex-col
          items-center
          justify-center
        "
      >

        <span className="text-3xl mb-2">
          💬
        </span>

        <p className="text-xs text-white">
          Chat
        </p>

      </button>

      {/* EMOJIS */}
      <div className="
        min-w-[220px]
        h-[110px]
        rounded-3xl
        bg-[#1E293B]
        p-4
        flex
        flex-wrap
        items-center
        justify-center
        gap-3
      ">

        {["👍", "👏", "🔥", "❤️", "😂", "😮"].map((emoji) => (
          <button
            key={emoji}
            onClick={() => {

              const id = Date.now();

              const newEmoji = {
                id,
                emoji,
              };

              setFlyingEmojis((prev) => [
                ...prev,
                newEmoji,
              ]);

              setTimeout(() => {
                setFlyingEmojis((prev) =>
                  prev.filter(
                    (item) => item.id !== id
                  )
                );
              }, 4000);

            }}
            className="
              w-10
              h-10
              rounded-full
              bg-[#0F172A]
              hover:bg-[#334155]
              text-xl
              transition
              flex
              items-center
              justify-center
            "
          >
            {emoji}
          </button>
        ))}

      </div>

      {/* CLOSE */}
      <button
        onClick={() => setShowOptionsMenu(false)}
        className="
          min-w-[70px]
          h-[110px]
          rounded-3xl
          bg-red-500/20
          hover:bg-red-500/30
          transition
          flex
          items-center
          justify-center
          text-3xl
        "
      >
        ✕
      </button>

    </div>

  </div>
)}

</div>

          </div>
        </div>
      </div>
    </div>
  );
}