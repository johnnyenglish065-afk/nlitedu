import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS for migration, or anon if RLS is relaxed
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Pricing from enroll/page.tsx
const coursePricing: Record<string, { govt: number; private: number; job: number }> = {
  "autocad-2d-3d-design": { govt: 1999, private: 2999, job: 3999 },
  "java-programming": { govt: 1999, private: 2999, job: 3999 },
  "python-data-science-ai": { govt: 1999, private: 2999, job: 3999 },
  "matlab-scientific-computing": { govt: 1999, private: 2999, job: 3999 },
  "android-ios-mobile-development": { govt: 1999, private: 2999, job: 3999 },
  "iot-embedded": { govt: 1999, private: 2999, job: 3999 },
  "revit-bim": { govt: 1999, private: 2999, job: 3999 },
  "solidworks": { govt: 1999, private: 2999, job: 3999 },
  "catia": { govt: 1999, private: 2999, job: 3999 },
  "3dsmax-vray": { govt: 1999, private: 2999, job: 3999 },
  "sketchup": { govt: 1999, private: 2999, job: 3999 },
  "etabs": { govt: 1999, private: 2999, job: 3999 },
  "data-science": { govt: 1999, private: 2999, job: 3999 },
  "artificial-intelligence": { govt: 1999, private: 2999, job: 3999 },
  "cpp-programming": { govt: 1999, private: 2999, job: 3999 },
  "ansys": { govt: 1999, private: 2999, job: 3999 },
  "primavera-p6": { govt: 1999, private: 2999, job: 3999 },
  "coreldraw": { govt: 1999, private: 2999, job: 3999 },
  "autocad-advance": { govt: 1999, private: 2999, job: 3999 },
  "autocad-electrical": { govt: 1999, private: 2999, job: 3999 },
  "autocad-mechanical": { govt: 1999, private: 2999, job: 3999 },
};

// Course list from courses.ts
const courseList = [
  { slug: "autocad-2d-3d-design", title: "AutoCAD & BIM", description: "Master industrial drafting and 3D modeling for modern construction and engineering projects.", image_url: "/courses/autocad.jpg", duration: "2 Months" },
  { slug: "java-programming", title: "Java Full Stack", description: "Build robust enterprise-grade applications using the world's most versatile programming language.", image_url: "/courses/java.jpg", duration: "2 Months" },
  { slug: "python-data-science-ai", title: "Python for AI", description: "Dive into Data Science and Artificial Intelligence with Python scripting and automation.", image_url: "/courses/python.jpg", duration: "2 Months" },
  { slug: "matlab-scientific-computing", title: "MATLAB Simulation", description: "Advanced mathematical computation and algorithm development for engineering research.", image_url: "/courses/matlab.jpg", duration: "2 Months" },
  { slug: "android-ios-mobile-development", title: "Mobile App Dev", description: "Create high-performance mobile applications from UI design to backend integration.", image_url: "/courses/mobile.jpg", duration: "2 Months" },
  { slug: "iot-embedded", title: "IoT & Embedded", description: "Connect the physical world to the digital with hardware programming and network sensors.", image_url: "/courses/iot.jpg", duration: "2 Months" },
  { slug: "revit-bim", title: "Revit & Architecture", description: "Learn building information modeling (BIM) for modern architecture and construction.", image_url: "/courses/revit.jpg", duration: "2 Months" },
  { slug: "solidworks", title: "SolidWorks CAD", description: "Mechanical design and simulation using SolidWorks for product development.", image_url: "/courses/solidworks.jpg", duration: "2 Months" },
  { slug: "catia", title: "CATIA Design", description: "Advanced CAD/CAM for aerospace, automotive, and complex engineering.", image_url: "/courses/catia.jpg", duration: "2 Months" },
  { slug: "3dsmax-vray", title: "3DS Max + VRay", description: "Create photorealistic 3D visualizations and architectural renders.", image_url: "/courses/3dsmax.jpg", duration: "2 Months" },
  { slug: "sketchup", title: "SketchUp", description: "Intuitive 3D modeling for architecture, interior, and landscape design.", image_url: "/courses/sketchup.jpg", duration: "2 Months" },
  { slug: "etabs", title: "ETABS", description: "Structural analysis and design of buildings and multi-story structures.", image_url: "/courses/etabs.jpg", duration: "2 Months" },
  { slug: "data-science", title: "Data Science", description: "Analyze data, build predictive models, and drive business decisions.", image_url: "/courses/datascience.jpg", duration: "2 Months" },
  { slug: "artificial-intelligence", title: "Artificial Intelligence", description: "Master AI concepts, neural networks, and deep learning frameworks.", image_url: "/courses/ai.jpg", duration: "2 Months" },
  { slug: "cpp-programming", title: "C++ Programming", description: "System-level programming, DSA, and competitive coding with C++.", image_url: "/courses/cpp.jpg", duration: "2 Months" },
  { slug: "ansys", title: "ANSYS Simulation", description: "Finite element analysis and simulation for engineering problems.", image_url: "/courses/ansys.jpg", duration: "2 Months" },
  { slug: "primavera-p6", title: "Primavera P6", description: "Project planning, scheduling, and management for construction & engineering.", image_url: "/courses/primavera.jpg", duration: "2 Months" },
  { slug: "coreldraw", title: "CorelDRAW", description: "Vector graphic design, illustration, and layout for print & digital media.", image_url: "/courses/coreldraw.jpg", duration: "2 Months" },
  { slug: "autocad-advance", title: "AutoCAD 2.0 Advance", description: "Advanced AutoCAD techniques for complex 3D modeling and parametric design.", image_url: "/courses/autocad-advance.jpg", duration: "2 Months" },
  { slug: "autocad-electrical", title: "AutoCAD (Electrical)", description: "Electrical schematic design, panel layouts, and circuit diagrams.", image_url: "/courses/autocad-electrical.jpg", duration: "2 Months" },
  { slug: "autocad-mechanical", title: "AutoCAD (Mechanical)", description: "Mechanical part design, assembly drawings, and manufacturing documentation.", image_url: "/courses/autocad-mechanical.jpg", duration: "2 Months" },
];

async function run() {
  console.log('Starting migration...');
  for (const course of courseList) {
    const pricing = coursePricing[course.slug] || { govt: 1999, private: 2999, job: 3999 };
    const { data, error } = await supabase.from('courses').upsert({
      slug: course.slug,
      title: course.title,
      description: course.description,
      image_url: course.image_url,
      duration: course.duration,
      govt_price: pricing.govt,
      pvt_price: pricing.private,
      job_price: pricing.job,
      is_legacy_pricing: false
    }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error upserting ${course.slug}:`, error);
    } else {
      console.log(`Successfully migrated ${course.slug}`);
    }
  }
  console.log('Migration complete!');
}

run();
