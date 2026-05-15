import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">404</p>
        <h1 className="mt-3 text-4xl font-extrabold">This page moved on.</h1>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back to marketplace</Button>
        </Link>
      </div>
    </div>
  );
}
