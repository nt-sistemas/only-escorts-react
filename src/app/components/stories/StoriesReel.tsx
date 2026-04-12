import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Story } from "./types";

interface StoriesReelProps {
  stories: Story[];
  onStoryClick: (storyIndex: number) => void;
}

export function StoriesReel({ stories, onStoryClick }: StoriesReelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="relative mb-8">
      {/* Left scroll button */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 items-center justify-center text-white hover:bg-neutral-700 transition shadow-lg"
        aria-label="Scroll esquerda"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable reel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2 px-1"
      >
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => onStoryClick(index)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            aria-label={`Ver story de ${story.userName}`}
          >
            {/* Avatar ring */}
            <div
              className={`w-16 h-16 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                story.viewed
                  ? "bg-neutral-700"
                  : "bg-gradient-to-tr from-pink-500 via-rose-400 to-orange-400"
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-neutral-950">
                <img
                  src={story.userImage}
                  alt={story.userName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <span className="text-xs text-neutral-300 max-w-[64px] truncate">
              {story.userName}
            </span>
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 items-center justify-center text-white hover:bg-neutral-700 transition shadow-lg"
        aria-label="Scroll direita"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
