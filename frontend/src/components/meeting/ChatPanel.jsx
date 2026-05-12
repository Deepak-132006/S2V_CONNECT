export default function ChatPanel({
  messages,
  chatMessage,
  setChatMessage,
  setMessages,
  setChatOpen,
}) {

  return (
    <div className="w-full xl:w-[360px] bg-white border border-[#E5E7EB] rounded-[32px] flex flex-col overflow-hidden shadow-sm">

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

    </div>
  );
}