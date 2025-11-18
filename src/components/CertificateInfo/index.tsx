import Image from "next/image";

const CertificateInfo = () => {
  return (
    <section
      id="certificate-info"
      className="overflow-hidden bg-white py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-black sm:text-4xl dark:text-white">
          Sample Certificate & Benefits
        </h2>

        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:gap-24">
          {/* Benefits Description */}
          <div className="max-w-xl text-center md:text-left">
            <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Upon successful completion, you’ll receive a certificate from
              NexGen Learning Institute of Technology (NLIT) — both soft and
              hard copies.
            </p>

            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              This certificate validates your skills and enhances your job
              prospects by standing out to employers and universities.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 text-left">
              {[
                "Proof of practical skills and internship experience.",
                "Boosts your resume for potential employers.",
                "May count towards academic credits.",
                "Improves career growth opportunities.",
                "Validates your knowledge and efforts.",
              ].map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-3 text-gray-800 dark:text-gray-200"
                >
                  <svg
                    className="text-primary mt-1 h-6 w-6 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample Certificate Image */}
          <div className="max-w-md flex-shrink-0 rounded-lg border border-gray-300 shadow-lg dark:border-gray-700">
            <div className="relative w-full overflow-hidden rounded-lg">
              <Image
                src="/company/cert-sample.jpg"
                alt="Certificate Sample"
                height={400}
                width={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateInfo;
