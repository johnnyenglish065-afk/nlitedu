"use client";
import Image from "next/image";
import Link from "next/link";
import AddressInfo from "./addressinfo";

const Footer = () => {
  return (
    <>
      <footer className="dark:bg-gray-dark relative z-10 bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <Image
                    src="/company/logo.jpg"
                    alt="logo"
                    className="w-full dark:hidden"
                    width={140}
                    height={30}
                  />
                  <Image
                    src="/company/logo.jpg"
                    alt="logo"
                    className="hidden w-full dark:block"
                    width={140}
                    height={30}
                  />
                </Link>
                <p className="text-body-color dark:text-body-color-dark mb-9 text-base leading-relaxed">
                  Empowering Future Innovators, Today!
                </p>
                <div className="flex items-center">
                  <a
                    href="https://www.facebook.com/share/1D43pbZNez/"
                    aria-label="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mr-6 duration-300"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.1 10.4939V7.42705C12.1 6.23984 13.085 5.27741 14.3 5.27741H16.5V2.05296L13.5135 1.84452C10.9664 1.66676 8.8 3.63781 8.8 6.13287V10.4939H5.5V13.7183H8.8V20.1667H12.1V13.7183H15.4L16.5 10.4939H12.1Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/918092378320" // Replace with your actual number
                    aria-label="WhatsApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color mr-6 dark:text-body-color-dark dark:hover:text-primary duration-300 hover:text-green-500"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M380.9 97.1C339 55.2 283.3 32 224.8 32 103.5 32 .3 135.2 0 256c-.3 49.7 13.1 98.3 38.3 140.5L2.2 480l88.9-23.4C132.6 478.7 177.6 488 224 488h.8c121.3 0 224.5-103.2 223.2-224.8.8-58.4-22.5-114.2-67.1-166.1zM224.8 440c-40.7.1-80.5-10.5-115.4-30.7l-8.2-4.8-52.7 13.9 14-51.3-5.3-8.3c-23.4-36.4-35.6-78.3-35.4-121.4.4-102.1 83.3-185 185.4-185 49.6 0 96.2 19.4 131.2 54.4 35 35 54.3 81.5 54 130.9.5 102.2-82.6 186.1-184.9 186.3zM314.3 302.6c-5.3-2.7-31.5-15.5-36.4-17.3-4.9-1.8-8.4-2.7-12 2.7s-13.8 17.3-16.9 20.8c-3.1 3.6-6.2 4-11.5 1.3s-22.4-8.2-42.7-26.3c-15.8-14.1-26.5-31.4-29.6-36.7-3.1-5.3-.3-8.2 2.3-11s5.3-6.2 7.9-9.3c2.6-3.1 3.5-5.3 5.3-8.9s.9-6.7-.4-9.3c-1.3-2.7-12-28.9-16.5-39.6-4.3-10.3-8.7-8.9-12.1-9.1-3.1-.2-6.7-.2-10.2-.2s-9.3 1.3-14.1 6.7c-4.8 5.3-18.4 18-18.4 43.8s18.8 50.8 21.4 54.3c2.6 3.6 36.9 56.4 89.4 79.1 12.5 5.4 22.2 8.6 29.8 11 12.5 4 23.9 3.4 32.9 2.1 10-1.5 31-12.6 35.4-24.8 4.3-12.2 4.3-22.7 3-24.8-1.3-2.2-4.8-3.5-10.1-6.2z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.youtube.com/@Nlit-v3k"
                    aria-label="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color dark:text-body-color-dark dark:hover:text-primary mr-6 duration-300 hover:text-[red]"
                  >
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      className="fill-current"
                    >
                      <path d="M17.5058 2.07119C17.3068 1.2488 16.7099 0.609173 15.9423 0.395963C14.5778 7.26191e-08 9.0627 0 9.0627 0C9.0627 0 3.54766 7.26191e-08 2.18311 0.395963C1.41555 0.609173 0.818561 1.2488 0.619565 2.07119C0.25 3.56366 0.25 6.60953 0.25 6.60953C0.25 6.60953 0.25 9.68585 0.619565 11.1479C0.818561 11.9703 1.41555 12.6099 2.18311 12.8231C3.54766 13.2191 9.0627 13.2191 9.0627 13.2191C9.0627 13.2191 14.5778 13.2191 15.9423 12.8231C16.7099 12.6099 17.3068 11.9703 17.5058 11.1479C17.8754 9.68585 17.8754 6.60953 17.8754 6.60953C17.8754 6.60953 17.8754 3.56366 17.5058 2.07119ZM7.30016 9.44218V3.77687L11.8771 6.60953L7.30016 9.44218Z" />
                    </svg>
                  </a>
                  <a
                    href="/"
                    aria-label="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mr-6 duration-300"
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      className="fill-current"
                    >
                      <path d="M15.2196 0H1.99991C1.37516 0 0.875366 0.497491 0.875366 1.11936V14.3029C0.875366 14.8999 1.37516 15.4222 1.99991 15.4222H15.1696C15.7943 15.4222 16.2941 14.9247 16.2941 14.3029V1.09448C16.3441 0.497491 15.8443 0 15.2196 0ZM5.44852 13.1089H3.17444V5.7709H5.44852V13.1089ZM4.29899 4.75104C3.54929 4.75104 2.97452 4.15405 2.97452 3.43269C2.97452 2.71133 3.57428 2.11434 4.29899 2.11434C5.02369 2.11434 5.62345 2.71133 5.62345 3.43269C5.62345 4.15405 5.07367 4.75104 4.29899 4.75104ZM14.07 13.1089H11.796V9.55183C11.796 8.7061 11.771 7.58674 10.5964 7.58674C9.39693 7.58674 9.222 8.53198 9.222 9.47721V13.1089H6.94792V5.7709H9.17202V6.79076H9.19701C9.52188 6.19377 10.2466 5.59678 11.3711 5.59678C13.6952 5.59678 14.12 7.08925 14.12 9.12897V13.1089H14.07Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/nlit.co.in?utm_source=qr&igsh=MXNqZW1udjY2eHg3bA=="
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color dark:text-body-color-dark dark:hover:text-primary duration-300 hover:text-[purple]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.75 2C4.57436 2 2 4.57436 2 7.75V16.25C2 19.4256 4.57436 22 7.75 22H16.25C19.4256 22 22 19.4256 22 16.25V7.75C22 4.57436 19.4256 2 16.25 2H7.75ZM4.5 7.75C4.5 5.67893 6.17893 4 8.25 4H15.75C17.8211 4 19.5 5.67893 19.5 7.75V16.25C19.5 18.3211 17.8211 20 15.75 20H8.25C6.17893 20 4.5 18.3211 4.5 16.25V7.75ZM17 7.25C16.3096 7.25 15.75 6.69036 15.75 6C15.75 5.30964 16.3096 4.75 17 4.75C17.6904 4.75 18.25 5.30964 18.25 6C18.25 6.69036 17.6904 7.25 17 7.25ZM12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Useful Links
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/certification"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/internship"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      Internship
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Terms, Support & Help
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      Open Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <AddressInfo />
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          {/* Add Footer */}
          <div className="py-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2025 NLIT Education. All rights reserved.
            </p>
          </div>
          {/* <div className="py-8">
            <p className="text-body-color text-center text-base dark:text-white">
              Developed by{" "}
              <a
                href="http://nlitedu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                nlit
              </a>
            </p>
          </div> */}
        </div>
        <div className="absolute top-14 right-0 z-[-1]">
          <svg
            width="55"
            height="99"
            viewBox="0 0 55 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
            <mask
              id="mask0_94:899"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="99"
              height="99"
            >
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="#4A6CF7"
              />
            </mask>
            <g mask="url(#mask0_94:899)">
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="url(#paint0_radial_94:899)"
              />
              <g opacity="0.8" filter="url(#filter0_f_94:899)">
                <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_94:899"
                x="12.4852"
                y="-15.1763"
                width="82.7646"
                height="82.7646"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10.5"
                  result="effect1_foregroundBlur_94:899"
                />
              </filter>
              <radialGradient
                id="paint0_radial_94:899"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)"
              >
                <stop stopOpacity="0.47" />
                <stop offset="1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-24 left-0 z-[-1]">
          <svg
            width="79"
            height="94"
            viewBox="0 0 79 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.3"
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              fill="url(#paint0_linear_94:889)"
            />
            <rect
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              stroke="url(#paint1_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
              fill="url(#paint2_linear_94:889)"
            />
            <path
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
              stroke="url(#paint3_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
              fill="url(#paint4_linear_94:889)"
            />
            <path
              d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
              stroke="url(#paint5_linear_94:889)"
              strokeWidth="0.7"
            />
            <defs>
              <linearGradient
                id="paint0_linear_94:889"
                x1="-41"
                y1="21.8445"
                x2="36.9671"
                y2="59.8878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_94:889"
                x1="25.6675"
                y1="95.9631"
                x2="-42.9608"
                y2="20.668"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_94:889"
                x1="20.325"
                y1="-3.98039"
                x2="90.6248"
                y2="25.1062"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_94:889"
                x1="18.3642"
                y1="-1.59742"
                x2="113.9"
                y2="80.6826"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_94:889"
                x1="61.1098"
                y1="62.3249"
                x2="-8.82468"
                y2="58.2156"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_94:889"
                x1="65.4236"
                y1="65.0701"
                x2="24.0178"
                y2="41.6598"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;
