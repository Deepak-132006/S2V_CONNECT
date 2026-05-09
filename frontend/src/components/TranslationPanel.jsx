import { useState } from "react";

export default function TranslationPanel({
  selectedLanguage,
  translatedText,
  detectedMode,
}) {

  const [messages, setMessages] = useState([]);

  return (
    <div className="w-full lg:w-[340px] bg-[#111827] border-l border-gray-800 p-5 flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-semibold text-cyan-400">
          Live Translation
        </h2>

        <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">
          LIVE
        </div>

      </div>

      {/* CURRENT LANGUAGE */}
      <div className="mb-4 bg-[#1E293B] rounded-2xl p-4 border border-cyan-500/10">

        <p className="text-xs text-gray-400 mb-2">
          Selected Language
        </p>

        <p className="text-cyan-300 font-medium">
          {selectedLanguage}
        </p>

      </div>

      {/* LIVE AI MESSAGE */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">

        {/* REAL-TIME TRANSLATION BOX */}
        <div className="bg-[#1E293B] rounded-2xl p-4 border border-purple-500/10">

          <p className="text-xs text-purple-300 mb-2">
            {detectedMode || "Waiting for Input"}
          </p>

          <p className="text-gray-200 leading-relaxed">

            {translatedText
              ? translatedText
              : "Real-time captions and translations will appear here..."}

          </p>

        </div>

        {/* FUTURE CHAT MESSAGES */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-[#1E293B] rounded-2xl p-4 border border-cyan-500/10"
          >

            <p className="text-xs text-cyan-300 mb-2">
              {msg.mode}
            </p>

            <p className="text-gray-200">
              {msg.text}
            </p>

          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="mt-4">

        <input
          type="text"
          placeholder="Type message..."
          className="
            w-full
            bg-[#1E293B]
            border
            border-gray-700
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:border-cyan-400
            text-white
          "
        />

      </div>
    </div>
  );
}