"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import PageTransition from "../components/PageTransition";
import { animations } from "@/lib/animations";

export default function VerificationPage() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [timeRemaining, setTimeRemaining] = useState(207); // 3:27 in seconds
  const [phoneNumber, setPhoneNumber] = useState<string>("+98 912 752 9926");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Get phone number from sessionStorage (secure, not in URL)
  useEffect(() => {
    const storedPhone = sessionStorage.getItem("verificationPhone");
    if (storedPhone) {
      setPhoneNumber(storedPhone);
    } else {
      // If no phone number stored, redirect back to my-number page
      router.push("/my-number");
    }
  }, [router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Design token-based class combinations
  const keypadButtonClasses =
    "w-16 h-16 bg-gray-50 hover:bg-gray-100 rounded-small text-heading font-medium text-secondary transition-all duration-200 active:scale-95";
  const codeDigitClasses =
    "w-16 h-16 bg-white border-2 border-gray-300 rounded-small flex items-center justify-center text-heading font-bold text-primary shadow-sm transition-all duration-200";
  const codeDigitFilledClasses =
    "w-16 h-16 bg-white border-2 border-primary-400 rounded-small flex items-center justify-center text-heading font-bold text-primary shadow-md scale-105 transition-all duration-200";

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleKeypadPress = (value: string) => {
    if (value === "backspace") {
      // Find the last filled position and clear it
      for (let i = 3; i >= 0; i--) {
        if (code[i] !== "") {
          const newCode = [...code];
          newCode[i] = "";
          setCode(newCode);
          break;
        }
      }
    } else if (value.match(/[0-9]/)) {
      // Find the first empty position and fill it
      for (let i = 0; i < 4; i++) {
        if (code[i] === "") {
          const newCode = [...code];
          newCode[i] = value;
          setCode(newCode);
          break;
        }
      }
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      // Since we don't send actual SMS, just navigate to users page
      // In a real app, this would verify the code with the backend
      console.log("Code entered:", fullCode, "for phone:", phoneNumber);

      // Clear verification phone from storage since we're done
      sessionStorage.removeItem("verificationPhone");

      // Navigate to users page
      router.push("/users");
    }
  };

  const handleResend = () => {
    // Reset timer and clear inputs for fresh start
    setTimeRemaining(207);
    setCode(["", "", "", ""]);
    // In a real app, this would trigger sending a new SMS
    console.log("Resending verification code to:", phoneNumber);
  };

  const handleSkip = () => {
    // Skip verification for development/testing
    console.log("Skipping verification for:", phoneNumber);
    sessionStorage.removeItem("verificationPhone");
    router.push("/users");
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Status bar mockup */}
        <div className="flex justify-between items-center px-page-x pt-4 pb-2 text-secondary text-body">
          <span>1:30 P.M</span>
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
        <div className="flex items-center px-page-x pt-4 pb-6 relative">
          <motion.button
            onClick={() => router.back()}
            className="w-12 h-12 bg-primary-400 rounded-button flex items-center justify-center shadow-lg mr-4 absolute top-2"
            variants={animations.variants.phoneInput.backButton}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            transition={animations.transitions.fast}
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
            className="text-heading font-bold text-primary flex-1 text-center"
            {...animations.utils.createEntrance(0.3)}
          >
            Verification
          </motion.h1>
        </div>

        {/* Form Container */}
        <div className="px-page-x py-page-y flex flex-col min-h-[calc(100vh-8rem)]">
          <motion.div
            className="flex-1 flex flex-col items-center"
            {...animations.utils.createEntrance(0.4)}
          >
            {/* Code Input Display - 4 boxes showing entered values */}
            <div className="flex gap-component mb-section">
              {code.map((digit, index) => (
                <motion.div
                  key={index}
                  className={digit ? codeDigitFilledClasses : codeDigitClasses}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: digit ? 1.05 : 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <motion.span
                    key={digit || "empty"} // Re-animate when digit changes
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="text-heading font-bold"
                  >
                    {digit || ""}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Confirmation Text */}
            <motion.div
              className="text-center mb-component"
              {...animations.utils.createEntrance(0.5)}
            >
              <p className="text-body text-secondary font-medium mb-compact">
                Please Confirm that Number
              </p>
              <p className="text-body text-secondary mb-compact">
                we send to{" "}
                <span className="text-link font-medium">{phoneNumber}</span>
              </p>

              <p className="text-body text-muted">
                Remain {formatTime(timeRemaining)}
              </p>
            </motion.div>

            {/* Resend and Skip Buttons */}
            <div className="flex gap-component mb-section">
              <motion.button
                onClick={handleResend}
                disabled={timeRemaining > 0}
                className="border-2 border-primary-400 text-link font-medium px-6 py-compact rounded-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50"
                {...animations.utils.createEntrance(0.6)}
              >
                Resend
              </motion.button>

              <motion.button
                onClick={handleSkip}
                className="border-2 border-gray-300 text-muted font-medium px-6 py-compact rounded-button transition-all duration-200 hover:bg-gray-50"
                {...animations.utils.createEntrance(0.65)}
              >
                Skip for now
              </motion.button>
            </div>

            {/* Number Keypad */}
            <motion.div
              className="bg-white rounded-card p-component shadow-lg mb-section"
              {...animations.utils.createEntrance(0.7)}
            >
              <div className="grid grid-cols-3 gap-component">
                {/* Row 1 */}
                {["1", "2", "3"].map((num) => (
                  <motion.button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className={keypadButtonClasses}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Row 2 */}
                {["4", "5", "6"].map((num) => (
                  <motion.button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className={keypadButtonClasses}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Row 3 */}
                {["7", "8", "9"].map((num) => (
                  <motion.button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className={keypadButtonClasses}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Row 4 */}
                <motion.button
                  onClick={() => handleKeypadPress("*")}
                  className={keypadButtonClasses}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  *
                </motion.button>
                <motion.button
                  onClick={() => handleKeypadPress("0")}
                  className={keypadButtonClasses}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  0
                </motion.button>
                <motion.button
                  onClick={() => handleKeypadPress("backspace")}
                  className={`${keypadButtonClasses} flex items-center justify-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
                      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Submit Button - Fixed at bottom like other pages */}
          <motion.div
            className="pt-8"
            {...animations.utils.createEntrance(0.8)}
          >
            <motion.button
              onClick={handleSubmit}
              disabled={!isCodeComplete}
              className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-semibold py-component px-component rounded-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileHover={!isCodeComplete ? { scale: 1.02 } : {}}
              whileTap={!isCodeComplete ? { scale: 0.98 } : {}}
              transition={animations.transitions.fast}
            >
              Continue to App
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
