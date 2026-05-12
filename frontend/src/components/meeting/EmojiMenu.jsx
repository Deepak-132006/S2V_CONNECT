export default function EmojiMenu({ sendEmoji }) {

  return (

    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 min-w-[220px] bg-[#E6DDF9] p-3 rounded-3xl shadow-xl flex gap-3 flex-wrap justify-center z-50">

      {["👍", "👏", "🔥", "❤️", "😂", "😮"].map((emoji) => (

        <button
          key={emoji}
          onClick={() => sendEmoji(emoji)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl"
        >
          {emoji}
        </button>

      ))}

    </div>

  );

}