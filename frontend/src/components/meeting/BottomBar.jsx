import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreVertical,
} from "lucide-react";

import EmojiMenu from "./EmojiMenu.jsx";
import LinkPopup from "./LinkPopup.jsx";
import OptionsMenu from "./OptionsMenu.jsx";

import Phone from "../../assets/phone.png";
import Happy from "../../assets/happy.png";
import Link from "../../assets/link.png";

export default function BottomBar({

  micOn,
  toggleMic,

  cameraOn,
  toggleCamera,

  endCall,

  showEmojiMenu,
  setShowEmojiMenu,
  sendEmoji,
  emojiRef,

  meetingLink,
  setMeetingLink,
  createMeetingLink,

  showOptionsMenu,
  setShowOptionsMenu,
  hoverTimeout,

  captionsEnabled,
  setCaptionsEnabled,

  chatOpen,
  setChatOpen,

  handRaised,
  setHandRaised,

}) {

  const handleMouseEnter = () => {

    clearTimeout(hoverTimeout.current);

    setShowOptionsMenu(true);

  };

  const handleMouseLeave = () => {

    hoverTimeout.current = setTimeout(() => {

      setShowOptionsMenu(false);

    }, 250);

  };

  const handleEmojiToggle = () => {

    setShowEmojiMenu(prev => !prev);

  };

  const handleCreateLink = async () => {

    createMeetingLink();

  };

  return (

    <div className="w-full flex justify-center">

      <div className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 flex items-center gap-4 shadow-lg flex-wrap justify-center">

        {/* MIC */}
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            micOn
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
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            cameraOn
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

        {/* END CALL */}
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
          <img
            className="w-5"
            src={Phone}
            alt=""
          />
        </button>

        {/* EMOJI */}
        <div
          ref={emojiRef}
          className="relative flex items-center justify-center"
        >

          <button
            onClick={handleEmojiToggle}
            className="
              w-14
              h-14
              rounded-full
              bg-[#E6DDF9]
              hover:bg-[#675B84]
              flex
              items-center
              justify-center
              transition
            "
          >
            <img
              className="w-5"
              src={Happy}
              alt=""
            />
          </button>

          {showEmojiMenu && (

            <EmojiMenu
              sendEmoji={sendEmoji}
            />

          )}

        </div>

        {/* LINK */}
        <div className="relative">

          <button
            onClick={handleCreateLink}
            className="
              w-14
              h-14
              rounded-full
              bg-[#E6DDF9]
              hover:bg-[#675B84]
              flex
              items-center
              justify-center
              transition
            "
          >
            <img
              className="w-5 h-5"
              src={Link}
              alt=""
            />
          </button>

          {meetingLink && (

            <LinkPopup
              meetingLink={meetingLink}
              setMeetingLink={setMeetingLink}
            />

          )}

        </div>

        {/* OPTIONS */}
        <div
          className="relative"

          onMouseEnter={handleMouseEnter}

          onMouseLeave={handleMouseLeave}
        >

          <button
            onClick={() =>
              setShowOptionsMenu(prev => !prev)
            }
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

          {showOptionsMenu && (

            <OptionsMenu

              hoverTimeout={hoverTimeout}

              setShowOptionsMenu={
                setShowOptionsMenu
              }

              captionsEnabled={
                captionsEnabled
              }

              setCaptionsEnabled={
                setCaptionsEnabled
              }

              chatOpen={chatOpen}

              setChatOpen={
                setChatOpen
              }

              handRaised={handRaised}

              setHandRaised={
                setHandRaised
              }

            />

          )}

        </div>

      </div>

    </div>

  );

}