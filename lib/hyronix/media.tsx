'use client';
import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import type { Media } from './types';
export function PublishedImage({
  media,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { media?: Media }) {
  const [failed, setFailed] = useState<string | null>(null);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (media && image.current?.complete && image.current.naturalWidth === 0)
      setFailed(media.url);
  }, [media]);
  const remote = media && failed !== media.url;
  return (
    <img
      {...props}
      ref={image}
      src={remote ? media.url : props.src}
      srcSet={remote ? undefined : props.srcSet}
      alt={remote ? media.alt : props.alt}
      width={props.width ?? media?.width ?? undefined}
      height={props.height ?? media?.height ?? undefined}
      onError={() => {
        if (media) setFailed(media.url);
      }}
    />
  );
}
