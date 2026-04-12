import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Story } from "./types";

interface StoriesViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
}

export function StoriesViewer({
  stories,
  initialIndex,
  onClose,
  onStoryViewed,
}: StoriesViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  // Refs to avoid stale closures inside setInterval
  const storyIndexRef = useRef(currentStoryIndex);
  const slideIndexRef = useRef(currentSlideIndex);
  const storiesRef = useRef(stories);

  useEffect(() => { storyIndexRef.current = currentStoryIndex; }, [currentStoryIndex]);
  useEffect(() => { slideIndexRef.current = currentSlideIndex; }, [currentSlideIndex]);
  useEffect(() => { storiesRef.current = stories; }, [stories]);

  const currentStory = stories[currentStoryIndex];
  const currentSlide = currentStory?.slides[currentSlideIndex];

  const goToNext = useCallback(() => {
    const story = storiesRef.current[storyIndexRef.current];
    if (!story) return;

    if (slideIndexRef.current < story.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else if (storyIndexRef.current < storiesRef.current.length - 1) {
      onStoryViewed(story.id);
      setCurrentStoryIndex((prev) => prev + 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    } else {
      onStoryViewed(story.id);
      onClose();
    }
  }, [onClose, onStoryViewed]);

  const goToPrev = useCallback(() => {
    if (slideIndexRef.current > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setProgress(0);
    } else if (storyIndexRef.current > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    }
  }, []);

  // Keep refs updated
  const goToNextRef = useRef(goToNext);
  useEffect(() => { goToNextRef.current = goToNext; }, [goToNext]);

  // Mark current story as viewed when it opens
  useEffect(() => {
    onStoryViewed(stories[currentStoryIndex]?.id);
  }, [currentStoryIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Progress timer
  useEffect(() => {
    if (paused || !currentSlide) return;
    const duration = currentSlide.duration ?? 5000;

    setProgress(0);
    let prog = 0;
    const tick = 50;
    const step = (tick / duration) * 100;

    const timer = setInterval(() => {
      prog += step;
      if (prog >= 100) {
        clearInterval(timer);
        setProgress(100);
        goToNextRef.current();
      } else {
        setProgress(prog);
      }
    }, tick);

    return () => clearInterval(timer);
  }, [currentSlideIndex, currentStoryIndex, paused, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goToNext, goToPrev]);

  // Prevent body scroll while viewer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!currentStory || !currentSlide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      {/* Story card */}
      <div
        className="relative w-full max-w-[420px] h-full max-h-[100dvh] overflow-hidden bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image */}
        <img
          src={currentSlide.image}
          alt={currentStory.userName}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Progress bars */}
        <div className="absolute top-3 inset-x-3 flex gap-1 z-10">
          {currentStory.slides.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width:
                    i < currentSlideIndex
                      ? "100%"
                      : i === currentSlideIndex
                      ? `${progress}%`
                      : "0%",
                  transition: i === currentSlideIndex ? "none" : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header: avatar + name + close */}
        <div className="absolute top-8 inset-x-3 flex items-center gap-2 z-10">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
            <img
              src={currentStory.userImage}
              alt={currentStory.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-semibold text-sm drop-shadow">
            {currentStory.userName}
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-white/80 hover:text-white transition"
            aria-label="Fechar story"
          >
            <X className="w-6 h-6 drop-shadow" />
          </button>
        </div>

        {/* Interaction zones */}
        <div className="absolute inset-0 flex z-20">
          {/* Previous */}
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={goToPrev}
          />

          {/* Pause on hold */}
          <div
            className="w-1/3 h-full cursor-pointer"
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
          />

          {/* Next */}
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={goToNext}
          />
        </div>

        {/* Desktop previous / next buttons */}
        <button
          onClick={goToPrev}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 items-center justify-center text-white transition"
          aria-label="Story anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 items-center justify-center text-white transition"
          aria-label="Próximo story"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Story counter (mobile) */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center z-10 md:hidden">
          <span className="text-white/60 text-xs">
            {currentStoryIndex + 1} / {stories.length}
          </span>
        </div>
      </div>

      {/* Click outside backdrop (desktop) */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
