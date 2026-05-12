import { useRef, useState } from "react";

import Share from "../../assets/Share_screen.png";
import Caption from "../../assets/close-caption.png";
import Chat from "../../assets/comment.png";
import Hand from "../../assets/palm.png";

import { MoreVertical } from "lucide-react";

export default function OptionsMenu({
  setChatOpen,
  chatOpen,
  setCaptionsEnabled,
  captionsEnabled,
  setHandRaised,
}) {

  const [showOptionsMenu, setShowOptionsMenu] =
    useState(false);

  const hoverTimeout = useRef(null);

  return (
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

      <button className="w-14 h-14 rounded-full bg-[#E6DDF9]">
        <MoreVertical />
      </button>

      {showOptionsMenu && (
        <div className="absolute bottom-20 bg-white p-5 rounded-3xl">

          <div className="grid grid-cols-4 gap-4">

            <button>
              <img src={Share} className="w-6" />
            </button>

            <button
              onClick={() =>
                setCaptionsEnabled(!captionsEnabled)
              }
            >
              <img src={Caption} className="w-6" />
            </button>

            <button
              onClick={() =>
                setChatOpen(!chatOpen)
              }
            >
              <img src={Chat} className="w-6" />
            </button>

            <button
              onClick={() =>
                setHandRaised((prev) => !prev)
              }
            >
              <img src={Hand} className="w-6" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}