import React from "react";
import Image from "next/image";

const CoursesSection = () => {
  const courses = [
    {
      title: "Java Programming",
      description:
        "Learn object-oriented programming and backend fundamentals.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/java.png",
    },
    {
      title: "Python Programming",
      description: "Master Python for data science, automation, and scripting.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/python.png",
    },
    {
      title: "AutoCAD",
      description:
        "Design and draft 2D/3D models for engineering and architecture.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/autocad.png",
    },
    {
      title: "Revit",
      description:
        "Learn building information modeling (BIM) for architecture.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/revit.jpg",
    },
    {
      title: "STAAD Pro",
      description:
        "Structural analysis and design software for civil engineers.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/staadpro.jpg",
    },
    {
      title: "SolidWorks",
      description: "Mechanical design and simulation using SolidWorks CAD.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/solid2.png",
    },
    {
      title: "CATIA",
      description:
        "Advanced CAD/CAM for aerospace, automotive, and engineering.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/CATI2.png",
    },
    {
      title: "Android / iOS Development",
      description: "Build mobile applications using modern frameworks.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/iosand2.png",
    },
    {
      title: "MATLAB",
      description:
        "Programming and simulation for engineering and scientific tasks.",
      link: "https://forms.gle/sTGcypKnp8DvNowy7",
      image: "/fontimage/matlab2.png",
    },
  ];

  return (
    <section
      id="courses"
      className="bg-gray-50 py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
          Explore Our FoundationCourses & Enroll
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Course Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={course.image}
                  alt={course.title}
                  layout="fill"
                //   objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105 object-contain"
                />
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block w-full rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Enroll Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
