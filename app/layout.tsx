import "./globals.css";

export const metadata = {
  title: "Autonav AI",
  description: "Think you can beat an AI self driving car? Try now",
  openGraph: {
    title: "Autonav AI",
    description: "Think you can beat an AI self driving car? Try now",
    url: "https://autonav-ai.vercel.app/",
    images: [
      {
        url: "https://i.imgur.com/LVls7Cl.png",
      },
    ],
    locale: "en-US",
    type: "website",
  },
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
