export default function VideoSection({

  localVideoRef,
  remoteVideoRef,

  cameraOn,
  callEnded,
  connected,

  handRaised,
  captionsEnabled,

  flyingEmojis,

}) {

  return (

    <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">

      {/* MY VIDEO */}
      <div className="flex-1 relative rounded-[32px] bg-black border border-[#E5E7EB] overflow-hidden shadow-sm">

        {!callEnded && cameraOn ? (

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

        )}

        {/* YOU */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl text-sm shadow-sm">

          You

        </div>

        {/* AI */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl shadow-sm">

          <p className="text-sm text-[#2563EB]">
            ✨ AI Hand Tracking Active
          </p>

        </div>

        {/* RAISE HAND */}
        {handRaised && (

          <div className="absolute top-6 right-6 text-5xl animate-bounce z-50">

            ✋

          </div>

        )}

        {/* EMOJI RAIN */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">

          {flyingEmojis.map((item, index) => (

            <div
              key={item.id}
              className="absolute text-4xl animate-[emojiRain_4s_linear_forwards]"
              style={{
                left: `${20 + (index * 12)}%`,
                top: "-20px",
              }}
            >

              {item.emoji}

            </div>

          ))}

        </div>

      </div>

      {/* REMOTE */}
      <div className="flex-1 relative rounded-[32px] bg-black border border-[#E5E7EB] overflow-hidden shadow-sm">

        {connected && !callEnded ? (

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

        ) : (

          <div className="w-full h-full flex flex-col items-center justify-center">

            <div className="w-24 h-24 rounded-full bg-[#f1ECF4] flex items-center justify-center text-3xl mb-4">

              👤

            </div>

            <p className="text-lg text-[#ecedf0]">
              Waiting for participant...
            </p>

          </div>

        )}

        {/* PARTICIPANT */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] px-4 py-2 rounded-2xl text-sm shadow-sm">

          Participant

        </div>

        {/* CAPTIONS */}
        {captionsEnabled && (

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl border border-[#E5E7EB] px-4 py-3 rounded-2xl shadow-sm max-w-[70%] z-50">

            <p className="text-sm text-[#111827]">
              🎤 Real-time captions enabled...
            </p>

          </div>

        )}

      </div>

    </div>

  );

}