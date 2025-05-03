// app/notices/page.jsx

import Link from "next/link";

const notices = [
  {
    id: 1,
    title: "Free delivery on orders above Rs. 1000!",
    body: "Have your books delivered free when you spend over Rs. 1000. Valid until May 31, 2025.",
    date: "2025-05-01",
    link: "/?filter=delivery",
  },
  {
    id: 2,
    title: "Summer Book Sale — up to 50% off!",
    body: "Thousands of titles on sale. Don’t miss out on the best deals of the year.",
    date: "2025-04-25",
    link: "/collections/summer-sale",
  },
  {
    id: 3,
    title: "New arrivals: Bestsellers from 2024!",
    body: "Catch up on the hottest reads from last year—now in stock.",
    date: "2025-04-20",
    link: "/new-arrivals",
  },
  // …add more past notices here…
];

export default function NoticesPage() {
  // sort newest → oldest
  const sorted = [...notices].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">All Site Notices</h1>
      <p className="mb-6 text-gray-600">
        Browse our past and current announcements.
      </p>

      <ul className="space-y-6">
        {sorted.map(({ id, title, body, date, link }) => (
          <li
            key={id}
            className="relative border rounded-lg p-6 shadow-sm hover:shadow-md transition"
          >
            <time className="block text-xs text-gray-500">
              {new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </time>
            <h2 className="mt-1 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-gray-700">{body}</p>
            {link && (
              <Link
                href={link}
                className="inline-block mt-4 text-yellow-600 hover:underline"
              >
                Learn more →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
