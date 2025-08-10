"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href} className="relative">
                <motion.div
                  className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 text-caption transition-colors duration-200 ${
                    isActive ? "text-link" : "text-muted hover:text-secondary"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-xl mb-1"
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.emoji}
                  </motion.span>
                  <span className="truncate">{item.name}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 left-1/2 w-1 h-1 bg-primary-500 rounded-full"
                      layoutId="activeTab"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ transform: "translateX(-50%)" }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
