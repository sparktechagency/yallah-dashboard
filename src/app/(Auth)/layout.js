"use client";
import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "@/assets/images/bg_2.jpg";

export default function AuthLayout({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const playAudio = () => {
      const audio = audioRef.current;
      if (audio && !isPlaying) {
        audio.volume = 0.4; // optional (nice UX)
        audio.play().catch(() => {});
        setIsPlaying(true);
      }

      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };

    window.addEventListener("click", playAudio);
    window.addEventListener("keydown", playAudio);
    window.addEventListener("touchstart", playAudio);

    return () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };
  }, [isPlaying]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* ✅ CORRECT AUDIO PATH */}
      {/* <audio ref={audioRef} src="/audio/themesong.mp3" loop preload="auto" /> */}

      <div className="flex w-1/3 items-center justify-center">{children}</div>
    </div>
  );
}
