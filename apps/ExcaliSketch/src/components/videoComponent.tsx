import React, { Ref, useEffect, useRef } from "react";

export default function Video() {
  const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play(); // Auto-play when in view
          } else {
            videoRef.current.pause(); // Pause when out of view
          }
        }
      },
      { threshold: 0.7 } // Adjust threshold for when video should start playing
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <section id="video" className=" my-10 drop-shadow-sm ">
      <div className="  max-w-5xl max-h-4xl mx-auto  px-2">
        <div className=" relative overflow-hidden rounded-xl shadow-2xl bg-black  ">
          <video
            src={videoUrl}
            loop
            muted
            ref={videoRef}
            playsInline
            className=" w-full h-full  object-cover  rounded-xl"
          >
            Demo Video not found
          </video>
        </div>
      </div>
    </section>
  );
}
