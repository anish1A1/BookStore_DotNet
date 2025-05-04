"use client";

export function Input({ label, startAdornment, ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 font-medium">{label}</label>}
      <div className="relative flex items-center">
        {startAdornment && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {startAdornment}
          </span>
        )}
        <input
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          {...props}
        />
      </div>
    </div>
  );
}
