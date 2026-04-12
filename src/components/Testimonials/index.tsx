"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";

type Testimonial = {
  id: number;
  name: string;
  designation: string;
  content: string;
  image: string;
  star: number;
};

const testimonialData: Testimonial[] = [
  // same data as your original
  {
    id: 1,
    name: "Rohan Singh",
    designation: "Mechanical Engineering Student",
    content:
      "NLIT gave me hands-on experience with AutoCAD and SolidWorks that I never got in college.",
    image: "/review/anshJPG.jpg",
    star: 5,
  },
  {
    id: 2,
    name: "Amit Verma",
    designation: "Civil Engineering Student",
    content:
      "I learned practical skills in Revit and StaadPro which made my resume stand out.",
    image: "/review/IMAGE2.PNG",
    star: 5,
  },
  {
    id: 3,
    name: "Pooja Kumari",
    designation: "Architecture Student",
    content:
      "The mentorship and training at NLIT are excellent. I feel fully ready for my career now.",
    image: "/review/ert.jpg",
    star: 5,
  },
  {
    id: 4,
    name: "Sahil kumar",
    designation: "Electrical Engineering Student",
    content:
      "Hands-on sessions and projects gave me practical insights I never expected.",
    image: "/review/IMG4867.PNG",
    star: 5,
  },
  {
    id: 5,
    name: "Sneha Roy",
    designation: "Interior Design Student",
    content:
      "The real-world projects at NLIT really boosted my confidence and skills.",
    image: "/review/Wha.jpg",
    star: 5,
  },
  {
    id: 6,
    name: "Vikas Kumar",
    designation: "Civil Engineer Student",
    content:
      "Best institute for learning industry-oriented tools and gaining confidence.",
    image: "/review/image_4.JPG",
    star: 5,
  },
  {
    id: 7,
    name: "Ravi Ranjan",
    designation: "AutoMobile Engineer",
    content:
      "Mentors are super helpful and training quality is top-notch. Highly recommend.",
    image: "/review/IMG4868.PNG",
    star: 5,
  },
  {
    id: 8,
    name: "Nikhil Kumar Shaw",
    designation: "Electrical & Electronic Engineer",
    content:
      "NLIT made me job-ready with their real-time projects and career guidance.",
    image: "/review/IMG4869.PNG",
    star: 5,
  },
  {
    id: 9,
    name: "Divya Mehta",
    designation: "Computer science Engineering Student",
    content:
      "Supportive environment and real learning. Loved the experience at NLIT.",
    image: "/review/IMG4870.PNG",
    star: 5,
  },
  // ...rest of testimonials
];

const Testimonials = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
    >
      {testimonialData.map((t) => (
        <SwiperSlide key={t.id}>
          <div className="flex h-full flex-col items-center rounded-lg bg-white p-6 text-center shadow border-dashed border-bule-500">

            {/* Avatar */}
            <img
              src={t.image}
              alt={t.name}
              className="mb-4 h-16 w-16 rounded-full border-2 border-bule-500 object-cover"
            />

            {/* Testimonial Content */}
            <p className="mb-6 text-sm text-gray-700">“{t.content}”</p>

            {/* Footer (Name + Role) */}
            <div className="mt-auto">
              <h4 className="text-base font-semibold text-gray-900">
                {t.name}
              </h4>
              <p className="text-sm text-gray-500">{t.designation}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Testimonials;
