export const imageDimensions: Record<
  string,
  { width: number; height: number }
> = {
  IMG_0099: { width: 1650, height: 2200 },
  IMG_0121: { width: 1237, height: 2200 },
  IMG_0159: { width: 1650, height: 2200 },
  IMG_0371: { width: 1650, height: 2200 },
  IMG_0383: { width: 1650, height: 2200 },
  'IMG_0436-2': { width: 1650, height: 2200 },
  IMG_0441: { width: 1986, height: 2200 },
  IMG_0442: { width: 1650, height: 2200 },
  IMG_0444: { width: 1650, height: 2200 },
  IMG_0460: { width: 1650, height: 2200 },
  IMG_0463: { width: 1650, height: 2200 },
  IMG_0466: { width: 1863, height: 2200 },
  IMG_0467: { width: 1650, height: 2200 },
  IMG_0476: { width: 1650, height: 2200 },
  IMG_0512: { width: 1247, height: 2200 },
  IMG_0513: { width: 1238, height: 2200 },
  IMG_0514: { width: 1247, height: 2200 },
  IMG_6435: { width: 1086, height: 1448 },
  IMG_8415: { width: 2169, height: 2200 },
  IMG_9054: { width: 1200, height: 1600 },
};

export function dimensionsFor(src: string) {
  return imageDimensions[src] ?? { width: 1200, height: 1200 };
}
