"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaDownload, FaMobileAlt } from "react-icons/fa";

const AppDownloadPopup = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only for logged-in users and if not dismissed in this session
    const isDismissed = sessionStorage.getItem("app_download_dismissed");
    if (user && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("app_download_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white dark:bg-gray-dark shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="relative p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl">
            <FaMobileAlt className="text-primary w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-black dark:text-white mb-1">
              Download NLITedu App
            </h4>
            <p className="text-sm text-body-color dark:text-body-color-dark mb-4">
              Get the best experience on your phone. Stay updated with courses and live classes on the go.
            </p>
            <div className="flex space-x-3">
              <a
                href="/app-release.apk"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                download
                onClick={handleDismiss}
              >
                <FaDownload size={16} className="mr-2" />
                Download APK
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadPopup;
