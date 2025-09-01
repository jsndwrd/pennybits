import Layout from "@/app/components/Layout";

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="flex items-center justify-center pb-2 pt-24">
        {children}
      </div>
    </Layout>
  );
}
