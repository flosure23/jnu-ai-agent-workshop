export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
