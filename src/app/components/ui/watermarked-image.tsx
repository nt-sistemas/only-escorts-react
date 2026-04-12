import * as React from "react";

import OnlyLogo from "../../assets/img/logo.svg";
import { cn } from "./utils";

type WatermarkedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string;
  watermarkClassName?: string;
};

export function WatermarkedImage({
  containerClassName,
  watermarkClassName,
  className,
  alt,
  ...props
}: WatermarkedImageProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img alt={alt} className={className} draggable={false} {...props} />
      <div
        className="pointer-events-none absolute bottom-2 right-2 rounded-md border border-white/20 bg-black/60 p-2 backdrop-blur-[1px]"
      >
        <img
          src={OnlyLogo}
          alt=""
          aria-hidden="true"
          className={cn("select-none w-[200px] opacity-90", watermarkClassName)}
          draggable={false}
        />
      </div>
    </div>
  );
}
