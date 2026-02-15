import { Navbar } from "@/components/shared/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="md:pt-14">{children}</main>
    </>
  );
}
