import { AlertTriangle } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button } from '@components/ui/Button';

export function AppErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'Something went wrong while loading this view.';

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="max-w-md rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-soft dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-600">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">The app hit a snag.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Return home</Button>
        </Link>
      </div>
    </div>
  );
}
