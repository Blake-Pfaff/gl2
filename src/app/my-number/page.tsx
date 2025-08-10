"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Dropdown, { DropdownOption } from "../components/Dropdown";
import { animations } from "@/lib/animations";
import { APP_NAME } from "@/lib/constants";

const countryOptions: DropdownOption[] = [
  { value: "IR +98", label: "IR +98", icon: "🇮🇷" },
  { value: "US +1", label: "US +1", icon: "🇺🇸" },
  { value: "UK +44", label: "UK +44", icon: "🇬🇧" },
  { value: "CA +1", label: "CA +1", icon: "🇨🇦" },
  { value: "DE +49", label: "DE +49", icon: "🇩🇪" },
  { value: "FR +33", label: "FR +33", icon: "🇫🇷" },
  { value: "IT +39", label: "IT +39", icon: "🇮🇹" },
  { value: "ES +34", label: "ES +34", icon: "🇪🇸" },
];

export default function MyNumberPage() {
  const [countryCode, setCountryCode] = useState("IR +98");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save phone number (for now just store locally, could save to user profile later)
    if (phoneNumber.trim()) {
      // Store the phone number in localStorage for now
      localStorage.setItem("userPhoneNumber", `${countryCode} ${phoneNumber}`);

      // Navigate to the main app (users page)
      router.push("/users");
    }
  };

  const getPlaceholderText = (country: string) => {
    switch (country) {
      case "US +1":
      case "CA +1":
        return "(555) 123-4567";
      case "UK +44":
        return "1234 567 8901";
      case "DE +49":
        return "123 4567890";
      case "FR +33":
        return "12 34 56 78 90";
      case "IT +39":
        return "123 456 7890";
      case "ES +34":
        return "123 456 789";
      case "IR +98":
      default:
        return "912 752 99 26";
    }
  };

  const formatPhoneNumber = (value: string, country: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format based on country
    switch (country) {
      case "US +1":
      case "CA +1":
        // Format: (XXX) XXX-XXXX
        if (digits.length >= 7) {
          return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
            6,
            10
          )}`;
        } else if (digits.length >= 4) {
          return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length >= 1) {
          return `(${digits}`;
        } else {
          return digits;
        }

      case "UK +44":
        // Format: XXXX XXX XXXX
        if (digits.length >= 8) {
          return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(
            7,
            11
          )}`;
        } else if (digits.length >= 5) {
          return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        } else {
          return digits;
        }

      case "DE +49":
        // Format: XXX XXXXXXX
        if (digits.length >= 4) {
          return `${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
        } else {
          return digits;
        }

      case "FR +33":
        // Format: XX XX XX XX XX
        if (digits.length >= 9) {
          return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(
            4,
            6
          )} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
        } else if (digits.length >= 7) {
          return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(
            4,
            6
          )} ${digits.slice(6)}`;
        } else if (digits.length >= 5) {
          return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(
            4
          )}`;
        } else if (digits.length >= 3) {
          return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        } else {
          return digits;
        }

      case "IR +98":
      default:
        // Format: XXX XXX XX XX (Iranian format)
        if (digits.length >= 9) {
          return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
            6,
            8
          )} ${digits.slice(8, 10)}`;
        } else if (digits.length >= 7) {
          return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
            6
          )}`;
        } else if (digits.length >= 4) {
          return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        } else {
          return digits;
        }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, countryCode);
    setPhoneNumber(formatted);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountryCode(newCountry);
    // Reformat existing phone number when country changes
    if (phoneNumber) {
      const reformatted = formatPhoneNumber(phoneNumber, newCountry);
      // Only update if the format actually changed
      if (reformatted !== phoneNumber) {
        setPhoneNumber(reformatted);
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Status bar mockup */}
        <div className="flex justify-between items-center px-page-x pt-4 pb-2 text-secondary text-body">
          <span>4:20 A.M</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
            </div>
            <svg
              className="w-5 h-5 ml-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48c.3.52.91.83 1.56.83H18c.65 0 1.26-.31 1.56-.83L20.41 11 19.56 9.52c-.3-.52-.91-.83-1.56-.83H6c-.65 0-1.26.31-1.56.83z" />
            </svg>
            <div className="w-6 h-3 border border-gray-900 rounded-sm ml-1">
              <div className="w-4 h-2 bg-gray-900 rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>

        {/* Custom Header with Back Button */}
        <div className="flex items-center px-page-x pt-4 pb-6">
          <motion.button
            onClick={() => router.back()}
            className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center shadow-lg mr-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 text-white"
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
          </motion.button>

          {/* Header Text */}
          <motion.h1
            className="text-heading font-bold text-primary"
            {...animations.utils.createEntrance(0.3)}
          >
            My number is
          </motion.h1>
        </div>

        {/* Form Container */}
        <div className="px-page-x py-page-y flex flex-col min-h-[calc(100vh-8rem)]">
          <motion.div
            className="flex-1"
            {...animations.utils.createEntrance(0.4)}
          >
            {/* Input Fields */}
            <div className="space-y-4 mb-8">
              {/* Country and Phone Row */}
              <div className="flex gap-4">
                {/* Country Code */}
                <div className="w-36">
                  <Dropdown
                    value={countryCode}
                    onChange={handleCountryChange}
                    options={countryOptions}
                    label="Country"
                    className="w-full"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex-1">
                  <label className="block text-body font-medium text-muted mb-3">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder={getPlaceholderText(countryCode)}
                    className="w-full px-4 py-4 bg-white border-2 border-primary-300 rounded-small focus:border-primary-400 focus:outline-none focus:ring-0 transition-all duration-200 placeholder-gray-400 text-secondary font-medium shadow-sm"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* Description Text */}
            <motion.div
              className="mb-8"
              {...animations.utils.createEntrance(0.5)}
            >
              <p className="text-body text-muted text-center leading-relaxed">
                Enter you number here to get verfication
                <br />
                code to verify your number and sign up in
                <br />
                <span className="text-primary-400 font-medium">
                  {APP_NAME}
                </span>{" "}
                to find you partner easy
              </p>
            </motion.div>
          </motion.div>

          {/* Continue Button - Fixed at bottom like other pages */}
          <motion.div
            className="pt-8"
            {...animations.utils.createEntrance(0.6)}
          >
            <button
              onClick={handleSubmit}
              disabled={!phoneNumber.trim()}
              className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-semibold py-component px-6 rounded-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Continue
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
