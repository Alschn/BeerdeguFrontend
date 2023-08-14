"use client";
import type { ReactNode } from "react";
import HomeFooter from "~/components/home/Footer";
import HomeHeader from "~/components/home/Header";

const footerLinks = [
  {
    title: "About",
    links: [
      { label: "About", link: "/about" },
      { label: "Contact", link: "/contact" },
      { label: "Privacy Policy", link: "/privacy-policy" },
      { label: "Terms of Service", link: "/terms-of-service" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", link: "/help-center" },
      { label: "FAQ", link: "/faq" },
      { label: "Contact", link: "/contact" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Facebook", link: "https://facebook.com" },
      { label: "Twitter", link: "https://twitter.com" },
      { label: "Instagram", link: "https://instagram.com" },
    ],
  },
];

export default function HomeLayout({ children }: { children: ReactNode }) {
  const headerHeight = 60;

  return (
    <>
      <HomeHeader height={headerHeight} />
      <main style={{ marginTop: headerHeight }}>{children}</main>
      <HomeFooter data={[]} />
    </>
  );
}
