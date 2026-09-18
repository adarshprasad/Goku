import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track order" };

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
