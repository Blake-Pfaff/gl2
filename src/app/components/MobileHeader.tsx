"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  title: string;
  backUrl?: string;
  showStatusBar?: boolean;
}

export function MobileHeader({
  title,
  backUrl,
  showStatusBar = true,
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <>
      {showStatusBar && (
        <div className="flex justify-between items-center px-6 pt-4 pb-2 text-gray-800 text-sm">
          <span>4:20 AM</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-800/50 rounded-full"></div>
            </div>
            <svg
              className="w-5 h-5 ml-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48c.3.52.91.83 1.56.83H18c.65 0 1.26-.31 1.56-.83L20.41 11 19.56 9.52c-.3-.52-.91-.83-1.56-.83H6c-.65 0-1.26.31-1.56.83z" />
            </svg>
            <div className="w-6 h-3 border border-gray-800 rounded-sm ml-1">
              <div className="w-4 h-2 bg-gray-800 rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center px-6 py-4">
        {backUrl && (
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors cursor-pointer border-0 outline-none focus:ring-2 focus:ring-primary-300"
            type="button"
            style={{ zIndex: 1000 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <h1
          className={`flex-1 text-center text-2xl font-bold text-gray-800 ${
            backUrl ? "-ml-12" : ""
          }`}
        >
          {title}
        </h1>
      </div>
    </>
  );
}
