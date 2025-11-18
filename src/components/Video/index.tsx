"use client";

import { useState, useRef } from "react";
import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";

export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="We are ready to help"
          paragraph="Watch our quick introduction to learn how NLIT equips you with skills for the future."
          center
          mb="80px"
        />

        <div
          className="relative mx-auto w-full max-w-[1080px] overflow-hidden rounded-md"
          style={{
            aspectRatio: "16 / 9",
            maxHeight: "90vh", // max height limited to 90% of viewport height
          }}
        >
          <iframe
            ref={iframeRef}
            className="absolute top-0 left-0 h-full w-full"
            src={`https://www.youtube.com/embed/rlwMsnro6Fo?autoplay=${isPlaying ? "1" : "0"}&rel=0&showinfo=0&enablejsapi=1`}
            title="NLIT Introduction Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {!isPlaying && (
            <button
              aria-label="Play Video"
              onClick={handlePlay}
              className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/40 transition hover:bg-black/50"
            >
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/75 hover:bg-white">
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  className="text-primary fill-current"
                >
                  <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                </svg>
              </div>
            </button>
          )}
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat">
          <div className="absolute right-0 bottom-0 left-0 z-[-1]">
            <Image
              src="/images/video/shape.svg"
              alt="shape"
              className="w-full"
              fill
            />
          </div>
        </div>
      </div>
    </section>
  );
}
