"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";

const Header = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => setSticky(window.scrollY >= 80);
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => setOpenIndex(openIndex === index ? -1 : index);

  const usePathName = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Scrolling Announcement Top Bar */}
      <div className="fixed top-0 left-0 w-full bg-primary text-white text-sm overflow-hidden z-[60]">
        <div className="flex animate-marquee whitespace-nowrap py-2 font-medium">
          <span className="px-8 flex items-center">
            🚀 4-Week & 6-Week Internship Registration Open - Limited Slots!
          </span>
          <span className="px-8 flex items-center">
            🎓 Get Certified in Python, AutoCAD, Java, Android - Apply Now!
          </span>
          <span className="px-8 flex items-center">
            🏆 Top 5 Test Performers Will Receive Surprise Gifts!
          </span>
          <span className="px-8 flex items-center">
            📢 NLIT Internships Now Count for Academic Credits - Ask Your College!
          </span>
          {/* Duplicate ALL for seamless continuous scroll */}
          <span className="px-8 flex items-center">
            🚀 4-Week & 6-Week Internship Registration Open - Limited Slots!
          </span>
          <span className="px-8 flex items-center">
            🎓 Get Certified in Python, AutoCAD, Java, Android - Apply Now!
          </span>
          <span className="px-8 flex items-center">
            🏆 Top 5 Test Performers Will Receive Surprise Gifts!
          </span>
          <span className="px-8 flex items-center">
            📢 NLIT Internships Now Count for Academic Credits - Ask Your College!
          </span>
        </div>
      </div>

      {/* Spacer so header doesn't overlap the top bar */}
      <div className="h-8"></div>

      {/* Main Header */}
      <header className={`header fixed top-8 left-0 z-50 w-full transition-all duration-300 ${sticky ? "bg-white/90 shadow-md backdrop-blur-md dark:bg-dark/90" : "bg-white dark:bg-dark"}`}>
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-40 max-w-full px-4 xl:mr-12 sm:w-60">
              <Link href="/" className={`header-logo block w-full ${sticky ? "py-3 lg:py-2" : "py-4 sm:py-6"}`}>
                <Image src="/company/logo.png" alt="logo" width={140} height={30} className="w-[120px] sm:w-[140px] dark:hidden transition-all" />
                <Image src="/company/logo-trans-p.png" alt="logo" width={140} height={30} className="hidden w-[120px] sm:w-[140px] dark:block transition-all" />
              </Link>
            </div>

            <div className="flex w-full items-center justify-end px-4">
              <div className="mr-4">
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[7px] rotate-45" : ""}`} />
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0" : ""}`} />
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[-8px] -rotate-45" : ""}`} />
                </button>

                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-full max-w-[600px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-full lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen ? "visibility top-full opacity-100" : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block w-full space-y-4 lg:flex lg:justify-end lg:items-center lg:space-y-0 lg:space-x-10">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={() => setNavbarOpen(false)}
                            className={`flex py-2 text-base font-semibold lg:inline-flex lg:px-0 lg:py-6 ${
                              usePathName === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base font-semibold lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="15" height="14" viewBox="0 0 15 14" className="fill-current">
                                  <path d="M7.5 10.5L2.5 5.5L3.9 4.1L7.5 7.7L11.1 4.1L12.5 5.5L7.5 10.5Z" />
                                </svg>
                                
                              </span>
                            </p>
                            <div
                              className={`submenu dark:bg-dark relative top-full left-0 rounded-xl bg-white transition-all duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-2xl lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu?.map((submenuItem, idx) => (
                                <Link
                                  href={submenuItem.path || '#'}
                                  key={idx}
                                  onClick={() => setNavbarOpen(false)}
                                  className="text-dark hover:text-primary block rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-primary/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="flex items-center justify-end space-x-2 sm:space-x-4 pr-16 lg:pr-0">
                {user ? (
                  <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-all dark:text-white ${usePathName === '/profile' ? 'text-primary' : ''}`}
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                         <FaUser size={16} />
                      </div>
                      <span className="hidden sm:inline whitespace-nowrap">
                        {user.user_metadata.full_name?.split(' ')[0] || "Profile"}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 sm:space-x-5">
                    <Link
                      href="/signin"
                      className="hidden text-base font-bold text-dark hover:text-primary md:block dark:text-white transition-all"
                    >
                      Sign In
                    </Link>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/signup"
                        className="rounded-xl bg-primary px-5 sm:px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </div>
                )}
                <div className="ml-2 sm:ml-4 border-l border-stroke dark:border-white/10 pl-2 sm:pl-4">
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
