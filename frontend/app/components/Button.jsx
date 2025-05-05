"use client";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-4 py-2 rounded font-medium focus:outline-none";
  const styles =
    variant === "primary"
      ? "bg-yellow-500 text-white hover:bg-yellow-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
