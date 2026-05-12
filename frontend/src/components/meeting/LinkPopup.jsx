import Link from "../../assets/link.png";

export default function LinkPopup({
  meetingLink,
  setMeetingLink,
}) {

  return (

    <div className="absolute bottom-20 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-[#E6DDF9] p-4 z-50">

      <div className="flex items-center gap-3 mb-4">

        <div className="w-11 h-11 rounded-full bg-[#F3EEFF] flex items-center justify-center">

          <img src={Link} className="w-5 h-5" />

        </div>

        <div>

          <h2 className="text-sm font-semibold text-[#675B84]">
            Meeting Link Created
          </h2>

        </div>

      </div>

      <div className="bg-[#F8F5FF] border border-[#E6DDF9] rounded-xl p-3 text-sm text-[#675B84] break-all mb-4">

        {meetingLink}

      </div>

      <div className="flex gap-3">

        <button
          onClick={() =>
            navigator.clipboard.writeText(
              meetingLink
            )
          }
          className="flex-1 bg-[#675B84] text-white py-2.5 rounded-xl"
        >
          Copy
        </button>

        <button
          onClick={() => setMeetingLink("")}
          className="px-4 py-2.5 rounded-xl border"
        >
          Close
        </button>

      </div>

    </div>

  );

}