import { SlideIn } from '@/components/animation/SlideIn';

const editions = {
  login: ['De vuelta', 'a tu espacio.'],
  register: ['Tu primera', 'cara A.'],
  recovery: ['Retoma', 'tu sesión.'],
};
export type AuthView = keyof typeof editions;

export function AuthIllustration({ view = 'login' }: { view?: AuthView }) {
  const [line, accent] = editions[view];
  return (
    <aside className="sf-auth-art" data-view={view} aria-hidden="true">
      <SlideIn className="sf-auth-lettering">
        <span>{line}</span><em>{accent}</em>
      </SlideIn>
      <div className="sf-auth-pressing">
        <div className="sf-auth-disc" />
        <div className="sf-auth-cover"><span>stream<i>flow.</i></span></div>
      </div>
    </aside>
  );
}
