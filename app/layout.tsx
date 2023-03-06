import "./globals.css";

export const metadata = {
  title: "Autonav AI",
  description: "AI learns how to drive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-800">{children}</body>
    </html>
  );
}
