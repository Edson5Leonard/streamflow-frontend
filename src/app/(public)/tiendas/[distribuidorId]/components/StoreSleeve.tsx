import { Disc3, Film, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { getStoreImageSrc } from '@/features/stores/utils/stores.utils';

export function StoreSleeve({ category, imageUrl }: { category: string; imageUrl?: string | null }) {
  const genre = category.toLocaleLowerCase('es');
  const style = genre.includes('música') ? 'music' : genre.includes('anime') ? 'anime' : 'film';
  const Icon = { music: Disc3, anime: Sparkles, film: Film }[style];
  const image = getStoreImageSrc(imageUrl ?? null);
  return (
    <div className={`sf-product-sleeve sf-product-sleeve--${style}`}>
      <span className="sf-sleeve-lines" aria-hidden="true" />
      {image && <Image unoptimized src={image} alt="" width={640} height={320} className="sf-product-sleeve-image" />}
      <Icon size={38} strokeWidth={1.25} aria-hidden="true" />
      <span className="sf-sleeve-category">{category}</span>
    </div>
  );
}
