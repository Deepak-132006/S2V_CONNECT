import { useEffect, useRef, useState } from "react";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Languages,
  Users,
  MoreVertical,
} from "lucide-react";

export default function MeetingRoom() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [stream, setStream] = useState(null);

  const [micOn, setMicOn] = useState(true);

  const [cameraOn, setCameraOn] = useState(true);

  const [callEnded, setCallEnded] = useState(false);

  const [connected, setConnected] = useState(false);

  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    startCamera();
  }, []);

  // START CAMERA + MIC
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      // MY VIDEO
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      // TEMP REMOTE VIDEO
      // later replace with WebRTC remote stream
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = mediaStream;
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
    <div className="w-full h-[calc(100vh-70px)] bg-[#0F172A] overflow-hidden">

      <div className="w-full h-full flex flex-col p-4 lg:p-6 gap-4">

        {/* TOP BAR */}
<div className="w-full min-h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-between px-5 py-3">

  {/* LEFT SECTION */}
  <div className="flex items-center gap-4">

    {/* HAMBURGER MENU */}
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

  {/* RIGHT SECTION */}
  <div className="flex items-center gap-3">

    {/* LANGUAGE SELECTOR */}
<div className="relative">

  <select
    className="
      bg-[#1E293B]
      hover:bg-[#334155]
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

  {/* ICON */}
  <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">

    <Languages size={18} className="text-cyan-400" />

  </div>

</div>

    {/* USERS */}
    <button className="w-11 h-11 rounded-xl bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center transition">

      <Users size={20} />

    </button>

    {/* MORE */}
    <button className="w-11 h-11 rounded-xl bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center transition">

      <MoreVertical size={20} />

    </button>

  </div>
</div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">

{/* VIDEO SECTION */}
<div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">

  {/* MY VIDEO FRAME */}
  <div className="flex-1 relative rounded-3xl bg-[#111827] border border-cyan-500/20 overflow-hidden min-h-[300px]">

    {/* MY VIDEO */}
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

  </div>

  {/* PEER VIDEO FRAME */}
  <div className="flex-1 relative rounded-3xl bg-[#111827] border border-purple-500/20 overflow-hidden min-h-[300px]">

    {/* PEER VIDEO */}
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

    </div>

  </div>

</div>

          {/* RIGHT PANEL */}
          {showChat && (
            <div className="w-full lg:w-[350px] bg-[#111827] rounded-3xl border border-gray-800 p-5 flex flex-col">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-5">

                <h2 className="text-xl font-semibold text-cyan-400">
                  Live Translation
                </h2>

                <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">
                  LIVE
                </div>

              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">

                <div className="bg-[#1E293B] rounded-2xl p-4 border border-cyan-500/10">

                  <p className="text-xs text-cyan-300 mb-2">
                    Sign → Text
                  </p>

                  <p className="text-gray-200">
                    Hello, nice to meet you.
                  </p>

                </div>

                <div className="bg-[#1E293B] rounded-2xl p-4 border border-purple-500/10">

                  <p className="text-xs text-purple-300 mb-2">
                    Voice → Text
                  </p>

                  <p className="text-gray-200">
                    Welcome to the S2V platform.
                  </p>

                </div>

                <div className="bg-[#1E293B] rounded-2xl p-4 border border-pink-500/10">

                  <p className="text-xs text-pink-300 mb-2">
                    Translation
                  </p>

                  <p className="text-gray-200">
                    வணக்கம் எப்படி இருக்கிறீர்கள்?
                  </p>

                </div>

              </div>

              {/* INPUT */}
              <div className="mt-4">

                <input
                  type="text"
                  placeholder="Type message..."
                  className="w-full bg-[#1E293B] border border-gray-700 rounded-2xl px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="w-full flex justify-center flex-wrap gap-4 py-2">

          {/* MIC BUTTON */}
          <button
            onClick={toggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              micOn
                ? "bg-[#1E293B] hover:bg-[#334155]"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {micOn ? <Mic /> : <MicOff />}
          </button>

          {/* CAMERA BUTTON */}
          <button
            onClick={toggleCamera}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              cameraOn
                ? "bg-[#1E293B] hover:bg-[#334155]"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {cameraOn ? <Video /> : <VideoOff />}
          </button>

          {/* JOIN CALL */}
          <button
            onClick={connectCall}
            className="px-6 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 font-semibold transition"
          >
            {connected ? "Connected" : "Join Call"}
          </button>

          {/* CHAT BUTTON */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition"
          >
            <MessageSquare />
          </button>

          {/* END CALL */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition shadow-2xl"
          >
            <PhoneOff size={28} />
          </button>

        </div>
      </div>
    </div>
  );
}