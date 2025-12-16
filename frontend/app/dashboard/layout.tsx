import Layout from "../components/Layout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="pt-24">{children}</div>
    </Layout>
  );
}
