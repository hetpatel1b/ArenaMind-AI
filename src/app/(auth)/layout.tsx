export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">ArenaMind AI</h1>
          <p className="text-slate-400">Intelligent Stadium Operations</p>
        </div>
        {children}
      </div>
    </div>
  );
}
