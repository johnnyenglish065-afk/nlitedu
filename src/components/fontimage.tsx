"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/fornt page image/IMG.jpg",
  "/fornt page image/image12.jpeg",
  "/fornt page image/image2.jpeg",
  "/fornt page image/image7.jpeg",
  "/fornt page image/IMG4.jpg",
  "/fornt page image/image15.jpeg",
  "/fornt page image/Image 20264.jpeg",
  "/fornt page image/image0.jpeg",
  "/fornt page image/IMG3.jpg",
  "/fornt page image/IMG2.jpg",
  "/fornt page image/IMG-20251009-WA0024.jpg",
  "/fornt page image/Image 01.jpeg",
  
];

export default function HomePage() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [index]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="w-full overflow-hidden pt-[120px]">
      <section className="relative h-[300px] md:h-screen">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition"
        >
          ❮
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition"
        >
          ❯
        </button>
      </section>
    </main>
  );
}
