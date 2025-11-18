const InternshipProgram = () => {
  const cards = [
    {
      title: "Flexible Internship Durations",
      description:
        "Choose between a focused 4-week program to gain foundational experience or an in-depth 6-week internship for comprehensive project involvement.",
      icon: (
        <svg
          className="text-primary h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Build Real-World Experience",
      description:
        "Apply your training on live projects, create a robust professional portfolio, and gain confidence by working in a professional environment.",
      icon: (
        <svg
          className="text-primary h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h11M3 6h11M3 14h7m4 0l4 4m0 0l4-4m-4 4V4"
          ></path>
        </svg>
      ),
    },
    {
      title: "Boost Employability & Network",
      description:
        "Gain a competitive edge with hands-on skills, enhance your resume with certification, and connect with industry professionals during your internship.",
      icon: (
        <svg
          className="text-primary h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h8m-8 4h6m-6 0l-1 2m8-2l1 2"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <section
      id="internship-program"
      className="overflow-hidden bg-gray-50 py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-black sm:text-4xl dark:text-white">
          Internship Program Details
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, description, icon }, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="bg-primary/10 text-primary mb-4 flex items-center justify-center rounded-full p-4">
                {icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                {title}
              </h3>
              <p className="text-body-color dark:text-gray-300">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternshipProgram;
