import Navbar from "./Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="*:h-lvh *:pt-16">{children}</main>
    </>
  );
}
