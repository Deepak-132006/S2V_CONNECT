import Share from "../../assets/Share_screen.png";
import Caption from "../../assets/close-caption.png";
import Chat from "../../assets/comment.png";
import Hand from "../../assets/palm.png";

export default function OptionsMenu({

  hoverTimeout,
  setShowOptionsMenu,

  captionsEnabled,
  setCaptionsEnabled,

  chatOpen,
  setChatOpen,

  handRaised,
  setHandRaised,

}) {

  return (

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

      <div className="mb-4">

        <h2 className="text-sm font-semibold text-[#675B84]">
          Meeting Controls
        </h2>

        <p className="text-xs text-gray-500">
          Quick access tools
        </p>

      </div>

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
          onClick={() =>
            setChatOpen(!chatOpen)
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
            src={Chat}
            className="w-6 h-6 object-contain"
          />

          <span className="text-[11px] text-[#675B84] font-medium">
            Chat
          </span>

        </button>

        {/* HAND */}
        <button
          onClick={() =>
            setHandRaised(!handRaised)
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
            src={Hand}
            className="w-6 h-6 object-contain"
          />

          <span className="text-[11px] text-[#675B84] font-medium">
            Raise
          </span>

        </button>

      </div>

    </div>

  );

}