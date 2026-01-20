import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Talrop | Building a strong ecosystem to empower the nation!",
  description:
    "Talrop is a company building a strong ecosystem spanning the whole of the nation since 2015, to foster entrepreneurship and innovative businesses, by focusing on various industries, and creating innovative yet sustainable solutions that will drive the nation to socio-economic prosperity.",
  robots: "https://talrop.com/",
  openGraph: {
    url: "https://talrop.com/",
    title: "Talrop | Building a strong ecosystem to empower the nation!",
    description:
      "CREATING AN ECOSYSTEM | BUILDING STARTUPS | BUILDING BUSINESSES | EMPOWERING THE NATION",
    images: [
      {
        url: "https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/14-11-2023/talrop-og.jpg",
        width: 1200,
        height: 600,
        alt: "Talrop | Talrop | Building a strong ecosystem to empower the nation!",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
