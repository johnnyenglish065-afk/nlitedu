import Image from "next/image";

const CertificateInfo = () => {
  return (
    <>
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
            <div className="max-w-md flex-shrink-0 rounded-lg border border-yellow-800 shadow-lg dark:border-yellow-700">
              <div className="relative w-full overflow-hidden rounded-lg">
                <Image
                  src="/company/nlitdemo.jpg"
                  alt="Certificate Sample"
                  height={400}
                  width={500}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ✅ Certificate Verification Section */}
      <section
        id="certificate-verification"
        className="bg-gray-50 py-16 md:py-20 lg:py-28 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">
            Verify Your Certificate
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Use our official certificate verification tool to confirm the
            authenticity of any certificate issued by NexGen Learning Institute
            of Technology (NLIT).
          </p>

          <a
            href="https://wits-education.com/certificate-verification.php"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary-dark inline-block rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-md transition dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Verify Certificate
          </a>
          {/* Image Row Below CTA */}
          {/* Image Row Below CTA */}
          <div className="mt-12 rounded-lg border-4 border-blue-500 px-6 py-8 text-center">
            {/* Heading inside the box */}
<h3 className="bg-primary justify-self-center rounded-lg border-[0px] border-transparent bg-gradient-to-r from-green-300 to-purple-500 px-6 py-4 text-2xl font-bold text-black">
  Wits Education Tag / Certification
</h3>


            {/* Logo Grid */}
            <div className="grid grid-cols-2 place-items-center gap-10 md:grid-cols-4">
              <Image
                src="/iss/mcf.png"
                width={180}
                height={120}
                className="object-contain"
                alt="MCF Logo"
              />
              <Image
                src="/iss/msme.png"
                width={180}
                height={120}
                className="object-contain"
                alt="MSME Logo"
              />
              <Image
                src="/iss/niti.png"
                width={150}
                height={100}
                className="object-contain"
                alt="ISO Logo"
              />
              <Image
                src="/iss/iso5-.png"
                width={160}
                height={110}
                className="object-contain"
                alt="AICTE Logo"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CertificateInfo;
