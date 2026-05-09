import BottomControls from "./BottomControls";

export default function VideoSection() {
  return (
    <div className="flex-1 p-5 flex flex-col">

      <div className="flex-1 bg-[#1E293B] rounded-3xl relative overflow-hidden border border-cyan-500/20">

        {/* Other Person */}
        <div className="absolute inset-4 rounded-3xl bg-black flex items-center justify-center text-gray-500">
          OTHER USER VIDEO
        </div>

        {/* AI Status */}
        <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-lg px-4 py-2 rounded-xl text-sm">

          ✋ Hand Tracking Active

        </div>

        {/* Live Caption */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-3 rounded-2xl text-lg">

          Vanakkam! How are you?

        </div>

        {/* My Camera */}
        <div className="absolute bottom-6 right-6 w-64 h-44 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-gray-700 flex items-center justify-center">
          MY CAMERA
        </div>

      </div>

      <BottomControls />

    </div>
  );
}