import Link from "next/link";
import React from "react";
import Image from "next/image";

const CoursesSection = () => {
  const courses = [
    {
      title: "AutoCAD (Civil)",
      description:
        "Design and draft 2D/3D models for engineering and architecture. 3-month program.",
      link: "/enroll?course=autocad-2d-3d-design",
      image: "/fontimage/autocad.png",
      duration: "3 Months",
      displayPrice: 5999,
      startingPrice: 1999,
    },
    {
      title: "Revit",
      description:
        "Learn building information modeling (BIM) for architecture. 3-month program.",
      link: "/enroll?course=revit-bim",
      image: "/fontimage/revit.jpg",
      duration: "3 Months",
      displayPrice: 6999,
      startingPrice: 2499,
    },
    {
      title: "STAAD Pro",
      description:
        "Structural analysis and design software for civil engineers. 3-month program.",
      link: "/enroll?course=staadpro",
      image: "/fontimage/staadpro.jpg",
      duration: "3 Months",
      displayPrice: 6999,
      startingPrice: 2499,
    },
    {
      title: "SolidWorks",
      description:
        "Mechanical design and simulation using SolidWorks CAD. 3-month program.",
      link: "/enroll?course=solidworks",
      image: "/fontimage/solid2.png",
      duration: "3 Months",
      displayPrice: 9999,
      startingPrice: 2999,
    },
    {
      title: "3DS Max + VRay",
      description:
        "Create photorealistic 3D visualizations and architectural renders. 4-month program.",
      link: "/enroll?course=3dsmax-vray",
      image: "/fontimage/3dsmax.png",
      duration: "4 Months",
      displayPrice: 12999,
      startingPrice: 3999,
    },
    {
      title: "CATIA",
      description:
        "Advanced CAD/CAM for aerospace, automotive, and engineering. 2-month program.",
      link: "/enroll?course=catia",
      image: "/fontimage/CATI2.png",
      duration: "2 Months",
      displayPrice: 9999,
      startingPrice: 2999,
    },
    {
      title: "SketchUp",
      description:
        "Intuitive 3D modeling for architecture, interior, and landscape design. 3-month program.",
      link: "/enroll?course=sketchup",
      image: "/fontimage/sketchup.png",
      duration: "3 Months",
      displayPrice: 9999,
      startingPrice: 2999,
    },
    {
      title: "ETABS",
      description:
        "Structural analysis and design of buildings and multi-story structures. 3-month program.",
      link: "/enroll?course=etabs",
      image: "/fontimage/etabs.png",
      duration: "3 Months",
      displayPrice: 14999,
      startingPrice: 3999,
    },
    {
      title: "Java Programming",
      description:
        "Learn object-oriented programming and backend fundamentals. 3-month program.",
      link: "/enroll?course=java-programming",
      image: "/fontimage/java.png",
      duration: "3 Months",
      displayPrice: 6999,
      startingPrice: 1999,
    },
    {
      title: "Python Programming",
      description:
        "Master Python for data science, automation, and scripting. 3-month program.",
      link: "/enroll?course=python-programming",
      image: "/fontimage/python.png",
      duration: "3 Months",
      displayPrice: 6999,
      startingPrice: 1999,
    },
    {
      title: "Data Science",
      description:
        "Analyze data, build predictive models, and drive business decisions. 3-month program.",
      link: "/enroll?course=data-science",
      image: "/fontimage/datascience.png",
      duration: "3 Months",
      displayPrice: 6999,
      startingPrice: 1999,
    },
    {
      title: "Android & iOS Development",
      description:
        "Build mobile applications using modern frameworks. 6-month program.",
      link: "/enroll?course=android-ios-mobile-development",
      image: "/fontimage/iosand2.png",
      duration: "6 Months",
      displayPrice: 14999,
      startingPrice: 3999,
    },
    {
      title: "Artificial Intelligence",
      description:
        "Master AI concepts, neural networks, and deep learning frameworks. 3-month program.",
      link: "/enroll?course=artificial-intelligence",
      image: "/fontimage/ai.png",
      duration: "3 Months",
      displayPrice: 9999,
      startingPrice: 2999,
    },
    {
      title: "MATLAB",
      description:
        "Programming and simulation for engineering and scientific tasks. 3-month program.",
      link: "/enroll?course=matlab-scientific-computing",
      image: "/fontimage/matlab2.png",
      duration: "3 Months",
      displayPrice: 9999,
      startingPrice: 2999,
    },
    {
      title: "C++",
      description:
        "Learn system-level programming, DSA, and competitive coding with C++. 3-month program.",
      link: "/enroll?course=cpp-programming",
      image: "/fontimage/cpp.png",
      duration: "3 Months",
      displayPrice: 8999,
      startingPrice: 2499,
    },
    {
      title: "ANSYS",
      description:
        "Finite element analysis and simulation for mechanical & structural engineering. 3-month program.",
      link: "/enroll?course=ansys",
      image: "/fontimage/ansys.png",
      duration: "3 Months",
      displayPrice: 14999,
      startingPrice: 3999,
    },
    {
      title: "Primavera P6",
      description:
        "Project planning, scheduling, and management for construction & engineering. 2-month program.",
      link: "/enroll?course=primavera-p6",
      image: "/fontimage/primavera.png",
      duration: "2 Months",
      displayPrice: 14999,
      startingPrice: 2999,
    },
    {
      title: "CorelDRAW",
      description:
        "Vector graphic design, illustration, and layout for print & digital media. 3-month program.",
      link: "/enroll?course=coreldraw",
      image: "/fontimage/coreldraw.png",
      duration: "3 Months",
      displayPrice: 7999,
      startingPrice: 1999,
    },
    {
      title: "AutoCAD 2.0 Advance",
      description:
        "Advanced AutoCAD techniques for complex 3D modeling and parametric design. 3-month program.",
      link: "/enroll?course=autocad-advance",
      image: "/fontimage/autocad_advance.png",
      duration: "3 Months",
      displayPrice: 9999,
      startingPrice: 2999,
    },
    {
      title: "AutoCAD (Electrical)",
      description:
        "Electrical schematic design, panel layouts, and circuit diagrams using AutoCAD. 3-month program.",
      link: "/enroll?course=autocad-electrical",
      image: "/fontimage/autocad_electrical.png",
      duration: "3 Months",
      displayPrice: 5999,
      startingPrice: 1999,
    },
    {
      title: "AutoCAD (Mechanical)",
      description:
        "Mechanical part design, assembly drawings, and manufacturing documentation. 3-month program.",
      link: "/enroll?course=autocad-mechanical",
      image: "/fontimage/autocad_mechanical.png",
      duration: "3 Months",
      displayPrice: 5999,
      startingPrice: 1999,
    },
  ];

  const discount = (course: { displayPrice: number; startingPrice: number }) =>
    Math.round(((course.displayPrice - course.startingPrice) / course.displayPrice) * 100);

  return (
    <section
      id="courses"
      className="bg-gray-50 py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
          Explore Our Foundation Courses & Enroll
        </h2>
        <p className="mb-12 text-center text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Industry-recognized certifications with flexible pricing for Govt. College, Private College & Job Professionals
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                {discount(course)}% OFF
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 left-3 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                ⏱ {course.duration}
              </div>

              {/* Course Image */}
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                <Image
                  src={course.image}
                  alt={course.title}
                  layout="fill"
                  className="transition-transform duration-300 group-hover:scale-105 object-contain"
                />
              </div>

              {/* Course Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {course.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {course.description}
                </p>

                {/* Pricing */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-lg font-extrabold text-green-600 dark:text-green-400 tracking-wider">
                    ₹****
                  </span>
                  <span className="text-sm font-medium text-gray-400 line-through">
                    ₹{course.displayPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  🔒 Enroll to reveal special offer price
                </p>

                <Link
                  href={course.link}
                  className="mt-4 inline-block w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-center text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                >
                  Enroll Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
