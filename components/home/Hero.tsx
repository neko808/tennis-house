"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Homepage hero (§5.1): full-bleed campaign video (Drive → public/video),
 * poster fallback, honors prefers-reduced-motion, and exposes a
 * play/pause control for accessibility.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause();
  }, [reducedMotion]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink text-surface">
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/video/hero-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/Running.mp4"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-40 sm:px-6 lg:pb-24">
        <p className="text-small uppercase tracking-[0.35em]">Sport-lifestyle essentials</p>
        <h1 className="text-hero mt-4 max-w-4xl uppercase">
          Court to street.
        </h1>
        <p className="mt-6 max-w-md text-body text-surface/85">
          Performance-grade pieces for the game — and everything after it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop?tags=new"
            className="inline-flex min-h-11 items-center justify-center rounded-btn bg-surface px-8 py-3 font-medium text-ink transition-colors hover:bg-ball"
          >
            Shop New Arrivals
          </Link>
          <Link
            href="/shop?category=tennis"
            className="inline-flex min-h-11 items-center justify-center rounded-btn border border-surface px-8 py-3 font-medium text-surface transition-colors hover:bg-surface hover:text-ink"
          >
            Explore Tennis
          </Link>
        </div>
      </div>

      {!reducedMotion && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-surface/60 text-surface transition-colors hover:bg-surface hover:text-ink"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 1.5h2.5v11H3zM8.5 1.5H11v11H8.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 1.5l9 5.5-9 5.5v-11z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </section>
  );
}
