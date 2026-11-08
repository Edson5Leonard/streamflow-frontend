import { Disc3, Film, Sparkles } from 'lucide-react';

export function StoreSleeve({ category }: { category: string }) {
  const genre = category.toLocaleLowerCase('es');
  const style = genre.includes('música') ? 'music' : genre.includes('anime') ? 'anime' : 'film';
  const Icon = { music: Disc3, anime: Sparkles, film: Film }[style];
  return (
    <div className={`sf-product-sleeve sf-product-sleeve--${style}`}>
      <span className="sf-sleeve-lines" aria-hidden="true" />
      <Icon size={38} strokeWidth={1.25} aria-hidden="true" />
      <span className="sf-sleeve-category">{category}</span>
    </div>
  );
}
