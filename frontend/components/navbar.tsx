"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Set initial timestamp
    const now = new Date();
    setLastUpdated(formatTimestamp(now));

    // Optional: Update timestamp periodically (e.g., every minute)
    const interval = setInterval(() => {
      setLastUpdated(formatTimestamp(new Date()));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left: Project Title */}
        <div className="flex items-center">
          <div className=" mt-3.5 mb-3.5">
            <h1 className="text-xl font-bold tracking-tight">
              Someone's Placement Tracker (refresh if data doesn't load)
            </h1>
            <p className="text-xs text-muted-foreground">
              Data may contain inaccuracies
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
