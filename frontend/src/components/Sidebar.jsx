import { Settings, HelpCircle, User } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-20 bg-[#111827] border-r border-gray-800 flex flex-col items-center py-5 gap-6">

      <div className="text-2xl font-bold text-cyan-400">
        S2V
      </div>

      <button className="p-3 rounded-xl hover:bg-gray-800">
        <User />
      </button>

      <button className="p-3 rounded-xl hover:bg-gray-800">
        <Settings />
      </button>

      <button className="p-3 rounded-xl hover:bg-gray-800">
        <HelpCircle />
      </button>

    </div>
  );
}