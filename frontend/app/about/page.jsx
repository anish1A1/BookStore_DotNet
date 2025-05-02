
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const timeline = [
  { year: "2025", event: "BookLux founded in a Dharan loft" },
  { year: "2025", event: "Shipped 1,000th book internationally" },
  { year: "2025", event: "Launched Curator’s Box subscription" },
  { year: "2025", event: "Opened pop-up bookstore in Ithahari" },
];

const team = [
  {
    name: "James Shrestha",
    role: "Frontend,Backend Developer & UI/Ux Designer",
    img: "https://scontent.fjkr1-1.fna.fbcdn.net/v/t39.30808-6/480279133_679768504377427_305959478652547150_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=gUNBTfXqZx4Q7kNvwGl7dFf&_nc_oc=AdkSH87gkscwo3gq_nEbsPF1zG3jOc43mo2tU_rgY-LDg0kJ_ss5lBmDaBls9bhngd8&_nc_zt=23&_nc_ht=scontent.fjkr1-1.fna&_nc_gid=MWrgZyhVRfmNkBTm0sleyQ&oh=00_AfFzhKpAlXR0TaQ5HoGr_9p6pcOKlIWrsb6jkokTq2agIA&oe=68191957",
  },
  {
    name: "Anish Jaiswal",
    role: "Frontend & Backend Developer",
    img: "https://scontent.fjkr1-1.fna.fbcdn.net/v/t39.30808-1/358633294_922879958811877_360171551869024495_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=nFbYjF9jHtoQ7kNvwHkvUXh&_nc_oc=AdmdX27E5tRw0ZEZXEQzAhyn9pFrhz5sNT2qxgx_Xzo85Tm1z3BHuHePDfYDqolWIq0&_nc_zt=24&_nc_ht=scontent.fjkr1-1.fna&_nc_gid=0n4JdYvLDzUYjzNffyehvg&oh=00_AfFMrExt4mPazSvu0HdnqukJAidyXHaVe690PhKrwoPmYg&oe=6819176C",
  },
  {
    name: "Arjun Jung Rana",
    role: "Backend Developer & Database designer,",
    img: "https://scontent.fjkr1-1.fna.fbcdn.net/v/t39.30808-1/381240115_1490514911771588_1013657100644636504_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=1OUsYc95p28Q7kNvwEpvmiV&_nc_oc=AdnpiD7eU_aYj2YRnkWw9O-hWfkcT93A6XtwrWcWcxfpDA5sKeO94V0pj-tOEovS2lU&_nc_zt=24&_nc_ht=scontent.fjkr1-1.fna&_nc_gid=pQmS27YJLJ40j4CKpuRmPA&oh=00_AfG8bouQD9Q4xPwZsNkUisp1bdo4xSl2TqaGhAQMvfu4LQ&oe=6818ED52",
  },
  {
    name: "Biraj Acharya",
    role: "Database designer, Backend Developer & frontend Developer",
    img: "https://scontent.fjkr1-1.fna.fbcdn.net/v/t39.30808-1/310849821_2031386607070268_5217937948458780696_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_ohc=MG0X5nGMOJsQ7kNvwE7wJ_D&_nc_oc=AdnEfmH25qZ3_1ozUXGu5ZzWvK6Pxxs2YE-v1WimB1wnZQrRJ_GbhWXkx5pmTV64OgE&_nc_zt=24&_nc_ht=scontent.fjkr1-1.fna&_nc_gid=dw2A78Sbms8hq6FtSEFXQA&oh=00_AfH0lQGpaaY74NRWVg3tG5RLek8ngrthyRODkCXSoymr9A&oe=681903B5",
  },
  {
    name: "Pra Mesh",
    role: "Operations Manager",
    img: "https://scontent.fjkr1-1.fna.fbcdn.net/v/t39.30808-1/463900645_1950048432173429_3295198303052127186_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=Nt5xrYMNsF4Q7kNvwEKqnNX&_nc_oc=AdlC9aHydNkQAAkjpp02ISZeB0OUo8QKPWtyHHvlKrX9xKtbr5USV9hsJE55fIsunPM&_nc_zt=24&_nc_ht=scontent.fjkr1-1.fna&_nc_gid=JmISO4qYxh-4YGLZCY_h4Q&oh=00_AfGX2iFwVFW5AOOu6866jYHr7ICInFBBe_shT0OPAdnF6Q&oe=6818F80D",
  },
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
          backgroundImage: "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1350&q=80')"
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
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="mx-auto max-w-3xl text-gray-600 leading-relaxed text-lg">
          We believe every reader deserves a handpicked journey—modern bestsellers or rare editions—delivered right to their door.
        </p>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gradient-to-r from-[#F1C40F]/20 to-transparent">
        <h3 className="text-3xl font-semibold text-center mb-12">Our Journey</h3>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-y-0 left-1/2 w-1 bg-gray-300 transform -translate-x-1/2"></div>
          <ul className="space-y-12">
            {timeline.map((t, i) => (
              <li key={t.year} className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
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
        <h3 className="text-4xl font-bold text-center mb-12">Meet the Team</h3>
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
        <h3 className="text-4xl font-bold text-center mb-12">Testimonials</h3>
        <div className="relative max-w-3xl mx-auto bg-blue-600 rounded-3xl overflow-hidden">
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

      {/* CTA */}
      <section className="py-16 text-center">
        <Link href="/catalog" className="inline-block bg-[#F1C40F] hover:bg-yellow-500 text-gray-900 font-bold px-10 py-4 rounded-full shadow-lg transition">
          Browse Our Collection
        </Link>
      </section>
    </div>
  );
}
