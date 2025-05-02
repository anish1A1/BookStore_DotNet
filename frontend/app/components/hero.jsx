import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-[#2C3E50] text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Your Next Favorite Book
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Premium editions, rare finds, and curated collections for the discerning reader.
        </p>
        <Link href="/collection" className="inline-block bg-[#F1C40F] hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-md">
          Browse Collection
        </Link>
      </div>
    </section>
  )
}
