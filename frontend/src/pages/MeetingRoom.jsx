import { useEffect, useRef, useState } from "react";
import { MessageSquareMore } from "lucide-react";
import Share from "../assets/Share_screen.png";
import Caption from "../assets/close-caption.png";
import Chat from "../assets/comment.png";
import Hand from "../assets/palm.png";
import Link from "../assets/link.png"
import Happy from "../assets/happy.png"
import Phone from "../assets/phone.png"
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
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const hoverTimeout = useRef(null);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const emojiRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [stream, setStream] = useState(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const [callEnded, setCallEnded] = useState(false);
  const [connected, setConnected] = useState(false);

  const [selectedLanguage, setSelectedLanguage] =
    useState("English");

  const [chatOpen, setChatOpen] = useState(false);

  const [chatMessage, setChatMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [showConversationMenu, setShowConversationMenu] =
    useState(false);

  const [showOptionsMenu, setShowOptionsMenu] =
    useState(false);

  const [captionsEnabled, setCaptionsEnabled] =
    useState(false);

  const [handRaised, setHandRaised] = useState(false);

  const [meetingLink, setMeetingLink] = useState("");


  const [flyingEmojis, setFlyingEmojis] = useState([]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    startCamera();
  }, []);

  // CAMERA
  const startCamera = async () => {
    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setStream(mediaStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject =
          mediaStream;
      }

    } catch (error) {
      console.log(error);
    }
  };

  // MIC
  const toggleMic = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMicOn(!micOn);
  };

  // CAMERA
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

  // CONNECT
  const connectCall = () => {
    setConnected(true);
  };

  // EMOJI
  const sendEmoji = (emoji) => {
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
        prev.filter((item) => item.id !== id)
      );
    }, 4000);
  };

  return (
    <div className="w-full h-screen bg-[#f1ECF4] overflow-hidden text-[#111827]">

      <div className="w-full h-full flex flex-col p-4 gap-4">

        {/* TOP BAR */}
        <div className="w-full min-h-16 bg-white border border-[#E5E7EB] rounded-[28px] px-5 py-3 flex items-center justify-between shadow-sm">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button className="w-11 h-11 rounded-2xl bg-[#f1ECF4] hover:bg-[#E0E7FF] transition flex items-center justify-center">

              <div className="flex flex-col gap-1">
                <span className="w-5 h-[2px] bg-[#111827] rounded-full"></span>
                <span className="w-5 h-[2px] bg-[#111827] rounded-full"></span>
                <span className="w-5 h-[2px] bg-[#111827] rounded-full"></span>
              </div>

            </button>

            <div>

              <h1 className="text-xl font-semibold text-[#000000]">
                S2V Connect
              </h1>

              <p className="text-xs text-[#6B7280]">
                AI Meeting Platform
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* LANGUAGE */}
            <div className="relative">

              <select
                value={selectedLanguage}
                onChange={(e) =>
                  setSelectedLanguage(e.target.value)
                }
                className="
                  bg-white
                  border
                  border-[#E5E7EB]
                  rounded-2xl
                  px-4
                  py-3
                  pr-10
                  outline-none
                  appearance-none
                  text-[#111827]
                "
              >

                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Malayalam</option>
                <option>Kannada</option>
                <option>Telugu</option>

              </select>

              <div className="absolute right-3 top-1/2 -translate-y-1/2">

                <Languages
                  size={18}
                  className="text-[#675B84]"
                />

              </div>

            </div>

            {/* MORE */}
            <button className="w-11 h-11 rounded-2xl bg-[#f1ECF4] hover:bg-[#675B84] transition flex items-center justify-center">

              <MoreVertical
                size={20}
                className="text-[#000000]"
              />

            </button>

          </div>

        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col xl:flex-row gap-4 overflow-hidden">

          {/* VIDEOS */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">

            {/* MY VIDEO */}
            <div className="flex-1 relative rounded-[32px] bg-black border border-[#E5E7EB] overflow-hidden shadow-sm">

              {!callEnded && cameraOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                  Camera Off
                </div>
              )}

              {/* LABEL */}
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl text-sm shadow-sm">
                You
              </div>

              {/* AI */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl shadow-sm">

                <p className="text-sm text-[#2563EB]">
                  ✨ AI Hand Tracking Active
                </p>

              </div>

              {/* HAND */}
              {handRaised && (
                <div className="absolute top-4 right-4 text-4xl animate-bounce">
                  ✋
                </div>
              )}

              {/* EMOJIS */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {flyingEmojis.map((item, index) => (
                  <div
                    key={item.id}
                    className="absolute bottom-10 text-2xl animate-[gmeetFloat_4s_ease-in-out_forwards]"
                    style={{
                      left: `calc(50% + ${(index % 4) * 16 - 24}px)`,
                    }}
                  >
                    {item.emoji}
                  </div>
                ))}

              </div>

            </div>

            {/* REMOTE VIDEO */}
            <div className="flex-1 relative rounded-[32px] bg-black border border-[#E5E7EB] overflow-hidden shadow-sm">

              {connected && !callEnded ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">

                  <div className="w-24 h-24 rounded-full bg-[#f1ECF4] flex items-center justify-center text-3xl mb-4">
                    👤
                  </div>

                  <p className="text-lg text-[#ecedf0]">
                    Waiting for participant...
                  </p>

                  <button
                    onClick={connectCall}
                    className="
                      mt-6
                      px-6
                      py-3
                      rounded-2xl
                      bg-[#675B84]
                      hover:bg-[#271C44]
                      text-white
                      transition
                      font-medium
                    "
                  >
                    Connect Peer
                  </button>

                </div>
              )}

              {/* LABEL */}
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl text-sm shadow-sm">
                Participant
              </div>

              {/* CAPTIONS */}
              {captionsEnabled && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl border border-[#E5E7EB] px-4 py-3 rounded-2xl shadow-sm max-w-[70%]">

                  <p className="text-sm text-[#111827]">
                    Real-time captions appear here...
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* CHAT */}
          {chatOpen && (
            <div className="w-full xl:w-[360px] bg-white border border-[#E5E7EB] rounded-[32px] flex flex-col overflow-hidden shadow-sm">

              {/* HEADER */}
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-[#2563EB]">
                    Meeting Chat
                  </h2>

                  <p className="text-xs text-[#6B7280] mt-1">
                    Live participant messages
                  </p>

                </div>

                <button
                  onClick={() => setChatOpen(false)}
                  className="text-[#6B7280] hover:text-black"
                >
                  ✕
                </button>

              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#6B7280] text-sm">
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "You"
                        ? "justify-end"
                        : "justify-start"
                        }`}
                    >

                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.sender === "You"
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#f1ECF4]"
                          }`}
                      >

                        <p className="text-xs opacity-70 mb-1">
                          {msg.sender}
                        </p>

                        <p className="text-sm">
                          {msg.text}
                        </p>

                      </div>

                    </div>
                  ))
                )}

              </div>

              {/* INPUT */}
              <div className="p-4 border-t border-[#E5E7EB] flex gap-3">

                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) =>
                    setChatMessage(e.target.value)
                  }
                  placeholder="Type message..."
                  className="
                    flex-1
                    bg-white
                    border
                    border-[#E5E7EB]
                    rounded-2xl
                    px-4
                    py-3
                    outline-none
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
                  className="px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium"
                >
                  Send
                </button>

              </div>

            </div>
          )}

        </div>

        {/* BOTTOM BAR */}
        <div className="w-full flex justify-center">

          <div className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 flex items-center gap-4 shadow-lg flex-wrap justify-center">

            {/* MIC */}
            <button
              onClick={toggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${micOn
                ? "bg-[#f1ECF4] hover:bg-[#E0E7FF]"
                : "bg-[#675B84]"
                }`}
            >
              {micOn ? (
                <Mic
                  size={22}
                  className="text-[#2563EB]"
                />
              ) : (
                <MicOff
                  size={22}
                  className="text-white"
                />
              )}
            </button>

            {/* CAMERA */}
            <button
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${cameraOn
                ? "bg-[#f1ECF4] hover:bg-[#E0E7FF]"
                : "bg-[#675B84]"
                }`}
            >
              {cameraOn ? (
                <Video
                  size={22}
                  className="text-[#2563EB]"
                />
              ) : (
                <VideoOff
                  size={22}
                  className="text-white"
                />
              )}
            </button>

            {/* END */}
            <button
              onClick={endCall}
              className="
                w-14
                h-14
                rounded-full
                bg-[#EF4444]
                hover:bg-[#DC2626]
                flex
                items-center
                justify-center
                transition
              "
            >
              <img className="w-5" src={Phone} alt="" />
            </button>
            <div ref={emojiRef} className="relative flex items-center justify-center">

              {/* Toggle Button */}
              <button
                onClick={() => setShowEmojiMenu(prev => !prev)}
                className="w-14 h-14 rounded-full bg-[#E6DDF9] hover:bg-[#675B84] flex items-center justify-center transition"
              >
                <img className="w-5" src={Happy} alt="" />
              </button>

              {/* Dropdown */}
              {showEmojiMenu && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 min-w-[220px] bg-[#E6DDF9] p-3 rounded-3xl shadow-xl flex gap-3 flex-wrap justify-center z-50">

                  {["👍", "👏", "🔥", "❤️", "😂", "😮"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => sendEmoji(emoji)}   // ❌ NO CLOSE HERE
                      className="w-10 h-10 rounded-full bg-white hover:bg-[#f1ECF4] flex items-center justify-center text-xl border"
                    >
                      {emoji}
                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* CONVERSATION */}
            <div className="relative">

              <button
                onClick={() =>
                  setShowConversationMenu(
                    !showConversationMenu
                  )
                }
                className="
                  p-5
                  h-14
                  rounded-full
                  bg-[#E6DDF9] hover:bg-[#675B84]
                  text-white
                  font-medium
                  transition
                "
              >
                <img className="w-5" src={Chat} alt="" />
              </button>

              {showConversationMenu && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xl z-50">

                  {[
                    "Sign → Voice",
                    "Sign → Text",
                    "Voice → Text",
                  ].map((item) => (
                    <button
                      key={item}
                      className="w-full px-5 py-4 text-left hover:bg-[#E6DDF9] border-b border-[#E5E7EB]"
                    >
                      <p className="font-medium">
                        {item}
                      </p>
                    </button>
                  ))}

                </div>
              )}

            </div>
            {/* LINK */}
            <div className="relative">
              {/* ORIGINAL BUTTON */}
              <div className="h-15 w-15 rounded-full bg-[#E6DDF9] p-3 flex items-center justify-center">
                <button
                  onClick={() => {
                    const roomId = Math.random().toString(36).substring(2, 10);
                    const link = `https://s2v-connect.vercel.app/room/${roomId}`;

                    setMeetingLink(link);
                    navigator.clipboard.writeText(link);
                  }}
                  className="flex items-center justify-center"
                >
                  <img className="w-5 h-5" src={Link} alt="" />
                </button>
              </div>

              {/* POPUP CARD */}
              {meetingLink && (
                <div
                  className="
        absolute
        bottom-20
        left-0
        w-80
        bg-white
        rounded-2xl
        shadow-2xl
        border
        border-[#E6DDF9]
        p-4
        z-50
      "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-[#F3EEFF] flex items-center justify-center">
                      <img className="w-5 h-5" src={Link} alt="" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#675B84]">
                        Meeting Link Created
                      </h2>
                      <p className="text-xs text-gray-500">
                        Share this link with participants
                      </p>
                    </div>
                  </div>

                  <div
                    className="
          bg-[#F8F5FF]
          border
          border-[#E6DDF9]
          rounded-xl
          p-3
          text-sm
          text-[#675B84]
          break-all
          mb-4
        "
                  >
                    {meetingLink}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                      }}
                      className="
            flex-1
            bg-[#675B84]
            hover:bg-[#57486f]
            text-white
            py-2.5
            rounded-xl
            text-sm
            font-medium
            transition
          "
                    >
                      Copy Link
                    </button>

                    <button
                      onClick={() => setMeetingLink("")}
                      className="
            px-4
            py-2.5
            rounded-xl
            border
            border-[#E6DDF9]
            text-[#675B84]
            hover:bg-[#F8F5FF]
            transition
          "
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>



            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(hoverTimeout.current);
                setShowOptionsMenu(true);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(() => {
                  setShowOptionsMenu(false);
                }, 250);
              }}
            >

              {/* OPTIONS BUTTON */}
              <button
                className="
      w-14
      h-14
      rounded-full
      bg-[#E6DDF9]
      hover:bg-[#D8C7FF]
      transition-all
      duration-300
      flex
      items-center
      justify-center
      shadow-md
    "
              >
                <MoreVertical
                  size={22}
                  className="text-[#675B84]"
                />
              </button>

              {/* HOVER MENU */}
              {showOptionsMenu && (
                <div
                  className="
        absolute
        bottom-20
        left-1/2
        -translate-x-1/2
        bg-white
        border
        border-[#E6DDF9]
        rounded-3xl
        p-5
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        z-50
        min-w-[340px]
      "
                  onMouseEnter={() => {
                    clearTimeout(hoverTimeout.current);
                    setShowOptionsMenu(true);
                  }}
                  onMouseLeave={() => {
                    hoverTimeout.current = setTimeout(() => {
                      setShowOptionsMenu(false);
                    }, 250);
                  }}
                >

                  {/* TITLE */}
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-[#675B84]">
                      Meeting Controls
                    </h2>
                    <p className="text-xs text-gray-500">
                      Quick access tools
                    </p>
                  </div>

                  {/* OPTIONS GRID */}
                  <div className="grid grid-cols-4 gap-4">

                    {/* SHARE */}
                    <button
                      className="
            h-20
            rounded-2xl
            bg-[#F8F5FF]
            hover:bg-[#E6DDF9]
            transition-all
            flex
            flex-col
            items-center
            justify-center
            gap-2
            group
          "
                    >
                      <img
                        src={Share}
                        className="w-6 h-6 object-contain"
                      />

                      <span className="text-[11px] text-[#675B84] font-medium">
                        Share
                      </span>
                    </button>

                    {/* CAPTIONS */}
                    <button
                      onClick={() =>
                        setCaptionsEnabled(!captionsEnabled)
                      }
                      className="
            h-20
            rounded-2xl
            bg-[#F8F5FF]
            hover:bg-[#E6DDF9]
            transition-all
            flex
            flex-col
            items-center
            justify-center
            gap-2
          "
                    >
                      <img
                        src={Caption}
                        className="w-6 h-6 object-contain"
                      />

                      <span className="text-[11px] text-[#675B84] font-medium">
                        Captions
                      </span>
                    </button>

                    {/* CHAT */}
                    <button
                      onClick={() => setChatOpen(!chatOpen)}
                      className="
            h-20
            rounded-2xl
            bg-[#F8F5FF]
            hover:bg-[#E6DDF9]
            transition-all
            flex
            flex-col
            items-center
            justify-center
            gap-2
          "
                    >
                      <img
                        src={Chat}
                        className="w-6 h-6 object-contain"
                      />

                      <span className="text-[11px] text-[#675B84] font-medium">
                        Chat
                      </span>
                    </button>

                    {/* HAND */}
                    <button
                      onClick={() => setHandRaised(!handRaised)}
                      className="
            h-20
            rounded-2xl
            bg-[#F8F5FF]
            hover:bg-[#E6DDF9]
            transition-all
            flex
            flex-col
            items-center
            justify-center
            gap-2
          "
                    >
                      <img
                        src={Hand}
                        className="w-6 h-6 object-contain"
                      />

                      <span className="text-[11px] text-[#675B84] font-medium">
                        Raise
                      </span>
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