import React from "react";

export default function Lobby() {

  const history =
    JSON.parse(localStorage.getItem("s2vMeetHistory")) || [];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-cyan-400">
          S2V Lobby
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome back to your meeting workspace
        </p>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mb-10 flex-wrap">

        <button className="px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold">
          New Meeting
        </button>

        <button className="px-6 py-4 rounded-2xl bg-[#1E293B] hover:bg-[#334155] transition">
          Join with Code
        </button>

      </div>

      {/* HISTORY */}
      <div>

        <h2 className="text-2xl font-semibold mb-5">
          Meeting History
        </h2>

        {history.length === 0 ? (

          <div className="bg-[#111827] rounded-3xl p-8 text-gray-500">
            No meetings yet
          </div>

        ) : (

          <div className="space-y-4">

            {history.map((meet) => (
              <div
                key={meet.id}
                className="bg-[#111827] border border-gray-800 rounded-3xl p-5 flex items-center justify-between"
              >

                <div>

                  <h3 className="text-lg font-semibold">
                    {meet.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {meet.time}
                  </p>

                </div>

                <button className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition">
                  Rejoin
                </button>

              </div>
            ))}

          </div>

        )}

      </div>

    </div>
  );
}