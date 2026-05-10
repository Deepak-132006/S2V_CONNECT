import {
  Mic,
  Video,
  PhoneOff,
  Languages,
  MessageSquare,
} from "lucide-react";

export default function BottomControls() {
  return (
    <div className="h-24 flex items-center justify-center gap-5">

      <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
        <Mic />
      </button>

      <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
        <Video />
      </button>

      <button className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center">
        <PhoneOff />
      </button>

      <button className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center">
        <Languages />
      </button>

      <button className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center">
        <MessageSquare />
      </button>

    </div>
  );
}