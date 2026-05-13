export default function VideoCard({
  type,
  localVideoRef,
  remoteVideoRef,
  callEnded,
  cameraOn,
  connected,
  captionsEnabled,
  handRaised,
  flyingEmojis,
}) {
  const isLocal = type === "local";

  return (
    <div className="flex-1 relative rounded-[32px] bg-black border border-[#E5E7EB] overflow-hidden shadow-sm">
      {isLocal ? (
        !callEnded && cameraOn ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
            Camera Off
          </div>
        )
      ) : connected && !callEnded ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              connected && !callEnded ? "block" : "hidden"
            }`}
          />

          {(!connected || callEnded) && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#f1ECF4] flex items-center justify-center text-3xl mb-4">
                👤
              </div>

              <p className="text-lg text-[#ecedf0]">
                Waiting for participant...
              </p>
            </div>
          )}
        </>
      )}

      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl text-sm shadow-sm">
        {isLocal ? "You" : "Participant"}
      </div>
    </div>
  );
}
