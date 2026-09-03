"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Background audio level when the visitor opts in (§ hero is a bed, not a feature). */
const HERO_VOLUME = 0.15;

/**
 * Homepage hero (§5.1): full-bleed campaign video (Drive → public/video),
 * poster fallback, honors prefers-reduced-motion, and exposes
 * play/pause plus sound controls for accessibility.
 *
 * Audio starts muted — browsers block autoplay of audible media, so sound is
 * opt-in via an explicit user gesture. Note that iOS Safari ignores
 * `video.volume` entirely (volume is hardware-only there), so on iPhone the
 * track plays at its authored level; lowering it for iOS means baking the
 * gain into the file itself.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(false);

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

  // Stage the level up front so unmuting never lets a full-volume frame through.
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = HERO_VOLUME;
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

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    // Order matters: set the level before unmuting, never after.
    video.volume = HERO_VOLUME;
    video.muted = !next;
    if (next && video.paused) {
      video.play();
      setPlaying(true);
    }
    setSoundOn(next);
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
          src="/video/Running_opt.mp4"
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
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute background video" : "Unmute background video"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-surface/60 text-surface transition-colors hover:bg-surface hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 5h2.5L7 2v10L3.5 9H1V5z" fill="currentColor" />
              {soundOn ? (
                <g
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M9.3 5.3a2.6 2.6 0 010 3.4" />
                  <path d="M11.2 3.6a5.2 5.2 0 010 6.8" />
                </g>
              ) : (
                <g
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M9.5 5.5l3.5 3.5" />
                  <path d="M13 5.5L9.5 9" />
                </g>
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause background video" : "Play background video"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-surface/60 text-surface transition-colors hover:bg-surface hover:text-ink"
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
        </div>
      )}
    </section>
  );
}
