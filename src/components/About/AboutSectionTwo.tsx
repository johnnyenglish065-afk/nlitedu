import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/graph-1.jpg"
                alt="NLIT internship and training support"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/about-image-2-dark.svg"
                alt="NLIT internship and training support in dark mode"
                fill
                className="drop-shadow-three hidden dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                  Hands-On Internship Experience
                </h3>
                <p className="text-body-color text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                  Gain real-world industry exposure with our 4-week and 6-week
                  internship certifications. Build a professional portfolio that
                  employers value.
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                  Expert Mentorship & Career Guidance
                </h3>
                <p className="text-body-color text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                  Learn from industry professionals and receive personalized
                  career advice to help you transition smoothly from student to
                  professional.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                  Flexible & Interactive Online Learning
                </h3>
                <p className="text-body-color text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                  Attend live classes via Webex, Zoom, or Google Meet,
                  participate in interactive sessions, and access course
                  materials anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
