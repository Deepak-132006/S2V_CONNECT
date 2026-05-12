export default function ChatSidebar({
  messages,
  chatMessage,
  setChatMessage,
  setMessages,
  setChatOpen,
}) {
  return (
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
              className={`flex ${
                msg.sender === "You"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.sender === "You"
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

            setMessages(prev => [
              ...prev,
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
  );
}