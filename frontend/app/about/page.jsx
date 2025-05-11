
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const timeline = [
  { year: "2023", event: "BookLux founded in Itahari International College" },
  { year: "2023", event: "Shipped 1,000th book internationally" },
  { year: "2024", event: "Launched Curator’s Box subscription" },
  { year: "2025", event: "Opened pop-up bookstore in Ithahari" },
];

const team = [
  {
    name: "James Shrestha",
    role: "Frontend Developer & UI/Ux Designer",
    img: "https://static.deltiasgaming.com/2025/01/Blue-Lock-1.jpg",
  },
  {
    name: "Anish Jaiswal",
    role: "Backend Developer",
    img: "https://www.shutterstock.com/image-illustration/this-meguru-bachira-blue-lock-600nw-2224055983.jpg",
  },
  {
    name: "Pramesh Katuwal",
    role: "Full Stack Developer",
    img: "https://i.pinimg.com/736x/c4/42/56/c4425643ddf5cd6924528d029eb56b62.jpg",
  },
  {
    name: "Arjun Jung Rana",
    role: "Operations Manager",
    img: "https://static1.dualshockersimages.com/wordpress/wp-content/uploads/2023/11/ikki-niko-from-blue-lock.jpg",
  },
  {
    name: "Birag Acharya",
    role: "Database designer",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxTIzCRFDgAXvFUZlCQe86i4FrjphkFHtuXQ&s",
  }
];

// Testimonials now also include all five, if desired:
const testimonials = [
  {
    quote: "“Building BookLux has been my passion project—curating unique reads for every soul.”",
    ...team[0],
  },
  {
    quote: "“Every book I handpick feels like introducing a friend to someone special.”",
    ...team[1],
  },
  {
    quote: "“Connecting with our community is what fuels my love for this platform.”",
    ...team[2],
  },
  {
    quote: "“Behind the scenes, I make sure your orders arrive safely and swiftly.”",
    ...team[3],
  },
  {
    quote: "“I love hearing your feedback and making BookLux even better for everyone.”",
    ...team[4],
  },
];

export default function AboutPage() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIdx(i => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-32">
      {/* Hero */}
      <section
        className="h-80 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://i.ebayimg.com/images/g/VuUAAOSwKbFiVw8x/s-l1200.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">About BookLux</h1>
            <p className="mt-2 text-xl text-gray-200">Curating stories that stay with you</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 md:px-24 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Our Mission</h2>
        <p className="mx-auto max-w-3xl text-white leading-relaxed text-lg">
          We believe every reader deserves a handpicked journey—modern bestsellers or rare editions—delivered right to their door.
        </p>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gradient-to-r from-[#F1C56F]/20 to-transparent">
        <h3 className="text-3xl font-semibold text-center mb-12 text-white">Our Journey</h3>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-y-0 left-1/2 w-1 transform -translate-x-1/2"></div>
          <ul className="space-y-12">
            {timeline.map((t, i) => (
              <li key={t.year + t.event} className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-lg">
                  <span className="text-xl font-bold text-[#F1C40F]">{t.year}</span>
                </div>
                <p className="bg-white p-6 rounded-lg shadow-lg text-gray-700 flex-1">{t.event}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-24">
        <h3 className="text-4xl font-bold text-center mb-12 text-white">Meet the Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {team.map((m) => (
            <div key={m.name} className="bg-white p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition-transform">
              <img src={m.img} alt={m.name} className="mx-auto w-32 h-32 rounded-full object-cover mb-4" />
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
            <li key={v} className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-lg hover:bg-[#F1C40F]/10 transition">
              <div className="w-4 h-4 bg-[#F1C40F] rounded-full" />
              <span className="text-gray-700 font-medium">{v}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials Carousel */}
      <section className="px-6 md:px-24">
        <h3 className="text-4xl font-bold text-center mb-12 text-white">Testimonials</h3>
        <div className="relative max-w-3xl mx-auto bg-blue-900 rounded-3xl overflow-hidden">
          <div className="p-12 flex flex-col md:flex-row items-center text-white">
            <img
              src={testimonials[idx].img}
              alt={testimonials[idx].name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-2xl mb-6 md:mb-0 md:mr-8"
            />
            <div>
              <p className="italic text-lg leading-relaxed">{testimonials[idx].quote}</p>
              <p className="mt-4 font-semibold">{testimonials[idx].name}</p>
              <p className="text-blue-200">{testimonials[idx].role}</p>
            </div>
          </div>
          <button onClick={prev} className="absolute top-1/2 left-6 -translate-y-1/2 bg-blue-500 hover:bg-blue-400 p-3 rounded-full">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button onClick={next} className="absolute top-1/2 right-6 -translate-y-1/2 bg-blue-500 hover:bg-blue-400 p-3 rounded-full">
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>
      <div className="bg-black"> <p> hi </p></div>
    </div>
  );
}
