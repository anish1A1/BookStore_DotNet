// app/about/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const timeline = [
  { year: "2018", event: "BookLux founded in a New York loft" },
  { year: "2019", event: "Shipped 1,000th book internationally" },
  { year: "2020", event: "Launched Curator’s Box subscription" },
  { year: "2022", event: "Opened pop-up bookstore in San Francisco" },
];

const team = [
  {
    name: "James Shrestha",
    role: "Founder & CEO",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "Anish Jaiswal",
    role: "Head Curator",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "Arjun Jung Rana",
    role: "Community Manager",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "Biraj Acharya",
    role: "Operations Lead",
    img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=400&q=60",
  },
];

// Now using team members as “testimonials”
const testimonials = [
  {
    quote:
      "“Building BookLux has been my passion project—curating unique reads for every soul.”",
    ...team[0],
  },
  {
    quote:
      "“Every book I handpick feels like introducing a friend to someone special.”",
    ...team[1],
  },
  {
    quote:
      "“Connecting with our community is what fuels my love for this platform.”",
    ...team[2],
  },
  {
    quote:
      "“Behind the scenes, I make sure your orders arrive safely and swiftly.”",
    ...team[3],
  },
];

export default function AboutPage() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-32">
      {/* Hero */}
      <section
        className="h-80 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
              About BookLux
            </h1>
            <p className="mt-2 text-xl text-gray-200">
              Curating stories that stay with you
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 md:px-24 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="mx-auto max-w-3xl text-gray-600 leading-relaxed text-lg">
          We believe that every reader deserves a handpicked journey through the
          world of books—from modern bestsellers to rare vintage editions.
          Partnering with independent presses and global gems, we bring boutique
          curation to your doorstep.
        </p>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gradient-to-r from-[#F1C40F]/20 to-transparent">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Our Journey
        </h3>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-y-0 left-1/2 w-1 bg-gray-300 transform -translate-x-1/2"></div>
          <ul className="space-y-12">
            {timeline.map((t, i) => (
              <li
                key={t.year}
                className={`flex items-center gap-6 ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-lg">
                  <span className="text-xl font-bold text-[#F1C40F]">
                    {t.year}
                  </span>
                </div>
                <p className="bg-white p-6 rounded-lg shadow-lg text-gray-700 flex-1">
                  {t.event}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-24">
        <h3 className="text-4xl font-bold text-center mb-12">Meet the Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {team.map((m) => (
            <div
              key={m.name}
              className="bg-white p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={m.img}
                alt={m.name}
                className="mx-auto w-32 h-32 rounded-full object-cover mb-4"
              />
              <h4 className="font-semibold text-lg">{m.name}</h4>
              <p className="text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <h3 className="text-4xl font-bold text-center mb-12">Our Values</h3>
        <ul className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            "Curation Over Convenience",
            "Eco-Friendly Packaging",
            "Community First",
            "Support Indies",
          ].map((v) => (
            <li
              key={v}
              className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-lg hover:bg-[#F1C40F]/10 transition"
            >
              <div className="w-4 h-4 bg-[#F1C40F] rounded-full"></div>
              <span className="text-gray-700 font-medium">{v}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials Carousel */}
      <section className="px-6 md:px-24">
        <h3 className="text-4xl font-bold text-center mb-12">Testimonials</h3>
        <div className="relative max-w-3xl mx-auto bg-blue-600 rounded-3xl overflow-hidden">
          <div className="p-12 flex flex-col md:flex-row items-center text-white">
            <img
              src={testimonials[idx].img}
              alt={testimonials[idx].name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-2xl mb-6 md:mb-0 md:mr-8"
            />
            <div>
              <p className="italic text-lg leading-relaxed">
                {testimonials[idx].quote}
              </p>
              <p className="mt-4 font-semibold">{testimonials[idx].name}</p>
              <p className="text-blue-200">{testimonials[idx].role}</p>
            </div>
          </div>
          <button
            onClick={prev}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-blue-500 hover:bg-blue-400 p-3 rounded-full"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-blue-500 hover:bg-blue-400 p-3 rounded-full"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <Link
          href="/catalog"
          className="inline-block bg-[#F1C40F] hover:bg-yellow-500 text-gray-900 font-bold px-10 py-4 rounded-full shadow-lg transition"
        >
          Browse Our Collection
        </Link>
      </section>
    </div>
  );
}
