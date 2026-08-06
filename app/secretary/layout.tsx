import SecretarySidebar from "@/components/layout/SecretarySidebar";

export default function SecretaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <SecretarySidebar />

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}