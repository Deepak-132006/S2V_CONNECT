import {
  Languages,
  MoreVertical,
} from "lucide-react";

export default function TopBar({
  selectedLanguage,
  setSelectedLanguage,
}) {

  return (
    <div className="w-full min-h-16 bg-white border border-[#E5E7EB] rounded-[28px] px-5 py-3 flex items-center justify-between shadow-sm">

      <div className="flex items-center gap-4">

        <button className="w-11 h-11 rounded-2xl bg-[#f1ECF4] hover:bg-[#E0E7FF] transition flex items-center justify-center">

          <div className="flex flex-col gap-1">
            <span className="w-5 h-[2px] bg-[#111827] rounded-full"></span>
            <span className="w-5 h-[2px] bg-[#111827] rounded-full"></span>
            <span className="w-5 h-[2px] bg-[#111827] rounded-full"></span>
          </div>

        </button>

        <div>

          <h1 className="text-xl font-semibold text-[#000000]">
            S2V Connect
          </h1>

          <p className="text-xs text-[#6B7280]">
            AI Meeting Platform
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <div className="relative">

          <select
            value={selectedLanguage}
            onChange={(e) =>
              setSelectedLanguage(e.target.value)
            }
            className="bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 pr-10 outline-none appearance-none text-[#111827]"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
            <option>Malayalam</option>
            <option>Kannada</option>
            <option>Telugu</option>
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2">

            <Languages
              size={18}
              className="text-[#675B84]"
            />

          </div>

        </div>

        <button className="w-11 h-11 rounded-2xl bg-[#f1ECF4] hover:bg-[#675B84] transition flex items-center justify-center">

          <MoreVertical
            size={20}
            className="text-[#000000]"
          />

        </button>

      </div>

    </div>
  );
}