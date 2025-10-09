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
        audio.play().catch((err) => console.log(err));
        setIsPlaying(true);
      }
      // Remove listeners after first interaction
      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("scroll", playAudio);
      window.removeEventListener("touchstart", playAudio);
      window.removeEventListener("hover", playAudio);
    };

    // Listen for first user interaction
    window.addEventListener("click", playAudio);
    window.addEventListener("keydown", playAudio);
    window.addEventListener("scroll", playAudio);
    window.addEventListener("touchstart", playAudio);
    window.addEventListener("hover", playAudio);

    return () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("scroll", playAudio);
      window.removeEventListener("touchstart", playAudio);
      window.removeEventListener("hover", playAudio);
    };
  }, [isPlaying]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage?.src})` }}
    >
      <audio ref={audioRef} src="/src/assets/audio/themesong.mp3" loop />
      <div className="flex w-1/3 items-center justify-center">{children}</div>
    </div>
  );
}
