import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-center">
      <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-8 max-w-md">
        <h1 className="mb-4 text-4xl font-bold text-red-500">403</h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">Access Denied</h2>
        <p className="mb-8 text-slate-400">
          You do not have the required permissions to view this resource. If you believe this is an
          error, please contact the System Administrator.
        </p>
        <Link
          href="/command-center"
          className="inline-block rounded-md bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
