"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    emoji: "🏠",
  },
  {
    name: "Discover",
    href: "/discover",
    emoji: "💕",
  },
  {
    name: "Matches",
    href: "/matches",
    emoji: "💬",
  },
  {
    name: "Users",
    href: "/users",
    emoji: "👥",
  },
  {
    name: "Profile",
    href: "/profile",
    emoji: "👤",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-1">
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 text-caption transition-colors duration-200 ${
                  isActive ? "text-link" : "text-muted hover:text-secondary"
                }`}
              >
                <span className="text-xl mb-1">{item.emoji}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
