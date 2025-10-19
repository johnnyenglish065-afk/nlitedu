"use client";

import React, { useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  designation: string;
  content: string;
  image: string;
  star: number;
};

const testimonialData: Testimonial[] = [
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
];

const Testimonials = () => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section
      style={{
        backgroundColor: "#f9fafb",
        padding: "60px 20px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600 }}>
          What Our Users Say
        </h2>
        <p style={{ fontSize: "16px", color: "#555", marginTop: 10 }}>
          Hear from our students who have successfully transformed their careers
          with NLIT.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {testimonialData.slice(0, visibleCount).map((t) => (
          <div
            key={t.id}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
              <img
                src={t.image}
                alt={t.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "15px",
                }}
              />
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 600 }}>{t.name}</h4>
                <p style={{ fontSize: "14px", color: "#777" }}>{t.designation}</p>
              </div>
            </div>
            <p style={{ fontSize: "15px", color: "#333" }}>{t.content}</p>
          </div>
        ))}
      </div>

      {visibleCount < testimonialData.length && (
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button
            onClick={handleShowMore}
            style={{
              backgroundColor: "#4A6CF7",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
};

export default Testimonials;



