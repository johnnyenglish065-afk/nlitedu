import { useState } from "react";

export default function EnrollDropdown() {
  const [selected, setSelected] = useState<{
    state: string;
    type: "govt" | "private";
  } | null>(null);

  const states = [
    "Bihar",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Maharashtra",
    "Gujarat",
    "Rajasthan",
    "Tamil Nadu",
    "Karnataka",
    "Delhi",
    "West Bengal",
    "Jharkhand",
    "Haryana",
    "Punjab",
    "Kerala",
    "Telangana",
    "Andhra Pradesh",
    "Goa",
    "Arunachal pradesh",
    "Chhattisgarh",
    "Himachal Pradesh",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Sikkim",
    "Tripura",
    "Uttarakhand",
  ];

  const handleSelect = (state: string, type: "govt" | "private") => {
    setSelected({ state, type });

    let formLink = "";

    if (type === "govt") {
      formLink =
        state === "Bihar"
          ? "https://forms.gle/xsFxaEjdXPKPi6ZK9" // Bihar Govt
          : "https://forms.gle/EUWHf7F3nVg3tb4H8"; // Other Govt
    } else {
      formLink =
        state === "Bihar"
          ? "https://forms.gle/m3AcGciiqKxfFUKK9" // Bihar Pvt
          : "https://forms.gle/DKPKjqEpdH9t55CH8"; // Other Pvt
    }

    // Open link in new tab
    window.open(formLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-full rounded-xl border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 font-semibold text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <div>State</div>
        <div className="text-center">Private College</div>
        <div className="text-center">Government College</div>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-200 overflow-y-auto dark:divide-gray-700">
        {states.map((state) => (
          <div
            key={state}
            className="grid grid-cols-3 items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {/* State Name */}
            <span>{state}</span>

            {/* Private Radio */}
            <div className="text-center">
              <input
                type="radio"
                name={`${state}-college`}
                checked={
                  selected?.state === state && selected?.type === "private"
                }
                onChange={() => handleSelect(state, "private")}
                className="h-4 w-4 accent-blue-600"
              />
            </div>

            {/* Government Radio */}
            <div className="text-center">
              <input
                type="radio"
                name={`${state}-college`}
                checked={selected?.state === state && selected?.type === "govt"}
                onChange={() => handleSelect(state, "govt")}
                className="h-4 w-4 accent-green-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
