import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata: Metadata = {
  title: "Floofie Funventures - AI Travel Planner",
  description: "AI-powered personalized travel itinerary planner with real-time integrations",
  keywords: "travel, itinerary, AI, personalized, planning, Google Maps, calendar",
  authors: [{ name: "Floofie Travels Team" }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Floofie Funventures - AI Travel Planner",
    description: "Create personalized travel itineraries with AI-powered recommendations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Maps API key moved to environment variables for security */}
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <script
            async
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        )}
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
