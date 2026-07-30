const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseKey) {
  console.error("No Supabase key found!");
  process.exit(1);
}

console.log("Using URL:", supabaseUrl);
console.log("Using Key (truncated):", supabaseKey.substring(0, 15) + "...");

const supabase = createClient(supabaseUrl, supabaseKey);

const trendingCourses = [
  {
    slug: 'data-analytics-package',
    title: 'Data Analytics Package',
    description: 'Master Data Analytics from scratch. Learn Programming, SQL Database Querying, Business Intelligence, Statistics, and AI Analytics with 60+ hours of live training and a real-world project.',
    image_url: 'https://res.cloudinary.com/dx1ywq1pi/image/upload/v1784493341/course_thumbnails/Data_Analytics_Package.png',
    category: 'DATA SCIENCE',
    category_color: 'Colors.teal',
    duration: '60+ Hours of Live Training',
    level: 'Beginner to Advanced',
    rating: 4.8,
    price: '₹9,999',
    highlights: [
      'Learn Programming & Data Analysis with Python (Pandas, NumPy)',
      'Master SQL Database Setup and Querying (PostgreSQL & MySQL)',
      'Build Dynamic Dashboards with Power BI and Tableau',
      'Apply Practical Statistics & Analytics to real datasets',
      'Understand AI and Modern Predictive Analytics workflows',
      'Complete a Comprehensive Real-World Capstone Project'
    ],
    instructor_name: 'NLIT Company',
    instructor_image: '/company/logo.png',
    total_reviews: 4820,
    is_bestseller: true,
    is_featured: true,
    syllabus: [
      'Programming & Data Analysis (Python Core, Pandas, NumPy)',
      'Database & Querying (SQL Fundamentals, Subqueries, Joins)',
      'Business Intelligence (Tableau, Power BI, Dashboards)',
      'Statistics & Analytics (Hypothesis testing, Regression)',
      'AI & Modern Analytics (Machine Learning Basics, LLMs in Analytics)',
      'Real-World Project (End-to-end data analysis pipeline)'
    ],
    govt_price: 3999,
    pvt_price: 7999,
    job_price: 8999,
    is_legacy_pricing: false,
    program_type: 'Trending'
  },
  {
    slug: 'web-development-package',
    title: 'Full-Stack Web Development Package',
    description: 'Become a professional full-stack web developer. Learn HTML5, CSS3, modern JavaScript (ES6+), React libraries, Node.js Backend, Databases, and deploy live applications.',
    image_url: 'https://res.cloudinary.com/dx1ywq1pi/image/upload/v1784493344/course_thumbnails/Full_Stack_Web_Development_Package.png',
    category: 'WEB DEVELOPMENT',
    category_color: 'Colors.blue',
    duration: '3 Months',
    level: 'Beginner to Professional',
    rating: 4.9,
    price: '₹9,999',
    highlights: [
      'Build fully responsive and beautiful layouts using HTML5 & CSS3',
      'Master Javascript (ES6+) and modern frontend paradigms',
      'Create dynamic single-page applications using React.js',
      'Build robust APIs and server applications using Node.js & Express',
      'Integrate Databases (MongoDB, SQL) with your backend services',
      'Deploy full-stack applications to Vercel, Heroku, and Netlify'
    ],
    instructor_name: 'NLIT Company',
    instructor_image: '/company/logo.png',
    total_reviews: 12560,
    is_bestseller: true,
    is_featured: true,
    syllabus: [
      'Frontend Development (HTML5, CSS3, Flexbox, Grid)',
      'JavaScript Libraries & Frameworks (React, Hooks, State)',
      'Backend Development with Node.js & Express.js',
      'Database & Storage (MongoDB, Mongoose, PostgreSQL)',
      'Full Stack Integration (REST APIs, CORS, Auth)',
      'Tools & Technologies (Git, GitHub, NPM, Postman)',
      'Deployment (Vercel, Render, Cloud Configurations)',
      'Live Projects (E-commerce portal, Social App)',
      'Bonus Modules (Next.js Basics, Tailwind CSS)'
    ],
    govt_price: 3999,
    pvt_price: 7499,
    job_price: 8499,
    is_legacy_pricing: false,
    program_type: 'Trending'
  },
  {
    slug: 'ai-web-development-package',
    title: 'Full Stack Using AI Web Development',
    description: 'Accelerate your development workflow with AI tools. Master Frontend, Backend, Databases, DevOps, and learn how to design, build, and deploy AI-driven web applications.',
    image_url: 'https://res.cloudinary.com/dx1ywq1pi/image/upload/v1784493346/course_thumbnails/Full_Stack_Using_AI_Web_Development.png',
    category: 'WEB DEVELOPMENT',
    category_color: 'Colors.purple',
    duration: '3 Months',
    level: 'Intermediate to Advanced',
    rating: 4.8,
    price: '₹11,999',
    highlights: [
      'Leverage AI tools (GitHub Copilot, ChatGPT) to write code 3x faster',
      'Design modern, intelligent web frontends with React and Tailwind',
      'Build backend services that consume OpenAI and Google Gemini APIs',
      'Configure automated CI/CD pipelines and DevOps workflows',
      'Implement authentication, state management, and real-time features',
      'Deploy and scale AI web apps on cloud platforms'
    ],
    instructor_name: 'NLIT Company',
    instructor_image: '/company/logo.png',
    total_reviews: 3120,
    is_bestseller: false,
    is_featured: true,
    syllabus: [
      'Frontend Development (Advanced HTML5/CSS3, Tailwind)',
      'JavaScript Libraries & Frameworks (React, Redux, Context)',
      'Backend Development with Node.js & Express API',
      'Database & Storage (SQL, MongoDB, Redis Caching)',
      'Full Stack Integration (JSON Web Tokens, Secure Cookies)',
      'AI in Web Development (Prompt Engineering, API integration)',
      'Development & DevOps (Docker, Git Actions, Vercel)',
      'Live Projects (AI Chatbot, Intelligent Search Tool)',
      'Bonus Modules (Introduction to Vector Databases)'
    ],
    govt_price: 4999,
    pvt_price: 7999,
    job_price: 8999,
    is_legacy_pricing: false,
    program_type: 'Trending'
  },
  {
    slug: 'front-end-development-package',
    title: 'Front End Development Package',
    description: 'Become a master of the visual web. Learn HTML5, CSS3, Modern JavaScript (ES6+), Bootstrap 5, and Responsive Web Design to build high-performance client-side applications.',
    image_url: 'https://res.cloudinary.com/dx1ywq1pi/image/upload/v1784493348/course_thumbnails/Front_End_Development_Package.png',
    category: 'WEB DEVELOPMENT',
    category_color: 'Colors.sky',
    duration: '2 Months',
    level: 'Beginner to Intermediate',
    rating: 4.7,
    price: '₹7,999',
    highlights: [
      'Write clean, semantic HTML5 tags for modern SEO practices',
      'Style pages using CSS3 variables, transitions, and Grid layout',
      'Create high-interactivity interfaces using native JavaScript',
      'Accelerate UI development with Bootstrap 5 framework',
      'Apply Mobile-First responsive design principles to all pages',
      'Learn modern hosting, Git, and Chrome Developer Tools'
    ],
    instructor_name: 'NLIT Company',
    instructor_image: '/company/logo.png',
    total_reviews: 8430,
    is_bestseller: true,
    is_featured: true,
    syllabus: [
      'HTML5 (Syntax, Semantic elements, Forms, Audio/Video)',
      'CSS3 (Selects, Flexbox, CSS Grid, Media queries, Animations)',
      'JavaScript (ES6+, DOM Manipulation, Async/Await, Fetch API)',
      'Bootstrap 5 (Grid system, Components, Utility classes, Theming)',
      'Responsive Web Design (Viewport, Typography, Images, Media)'
    ],
    govt_price: 2999,
    pvt_price: 4999,
    job_price: 5999,
    is_legacy_pricing: false,
    program_type: 'Trending'
  },
  {
    slug: 'autocad-revit-package',
    title: 'AutoCAD + Revit Drafting & BIM Package',
    description: 'Master the industry-standard drafting and building modeling software. Transition from 2D CAD drafting to 3D Building Information Modeling (BIM) workflows.',
    image_url: 'https://res.cloudinary.com/dx1ywq1pi/image/upload/v1784493349/course_thumbnails/AutoCAD___Revit_Drafting___BIM_Package.png',
    category: 'ENGINEERING',
    category_color: 'Colors.orange',
    duration: '6 Months',
    level: 'Beginner to Advanced',
    rating: 4.8,
    price: '₹14,999',
    highlights: [
      'Design precise 2D layouts and annotations in AutoCAD',
      'Create realistic 3D CAD modeling and structural render views',
      'Build fully functional 3D BIM models using Revit Architecture',
      'Coordinate structural, mechanical, electrical, and plumbing elements',
      'Set up sheets, detailing, scheduling, and standard documentation',
      'Develop real-world projects for a professional engineering portfolio'
    ],
    instructor_name: 'NLIT Company',
    instructor_image: '/company/logo.png',
    total_reviews: 1980,
    is_bestseller: false,
    is_featured: true,
    syllabus: [
      'AutoCAD 2D Drafting & Annotation (Interface, Commands, Layers)',
      'AutoCAD 3D Modeling (Extrusion, Loft, Rendering, Materials)',
      'Revit Architecture Fundamentals (Walls, Floors, Roofs, Doors, Windows)',
      'Revit Families & Components creation',
      'BIM (Building Information Modeling) Collaboration & Coordination',
      'Schedules, Quantities, Sheet Layouts, and PDF Exports',
      'Portfolio Projects (Residential & Commercial building designs)'
    ],
    govt_price: 3999,
    pvt_price: 5999,
    job_price: 6999,
    is_legacy_pricing: false,
    program_type: 'Trending'
  },
  {
    slug: 'video-editing-package',
    title: 'Video Editing (Basic to Advance)',
    description: 'Learn professional video post-production from scratch. Master timeline editing, cinematic cuts, audio design, color grading, motion graphics, and visual effects.',
    image_url: 'https://res.cloudinary.com/dx1ywq1pi/image/upload/v1784493351/course_thumbnails/Video_Editing__Basic_to_Advance_.png',
    category: 'CREATIVE ARTS',
    category_color: 'Colors.pink',
    duration: '3 Months',
    level: 'Beginner to Professional',
    rating: 4.9,
    price: '₹19,999',
    highlights: [
      'Edit raw footage efficiently inside Adobe Premiere Pro timeline',
      'Understand storytelling through pacing, cuts, and transitions',
      'Master audio editing, cleanup, sound effects, and music syncing',
      'Design titles, lower thirds, and intro animations in After Effects',
      'Color correct and color grade video tracks to look professional',
      'Optimize and export videos for YouTube, Instagram, and web delivery'
    ],
    instructor_name: 'NLIT Company',
    instructor_image: '/company/logo.png',
    total_reviews: 2450,
    is_bestseller: true,
    is_featured: true,
    syllabus: [
      'Introduction to Video Editing Tools (Interface, Importing, Media Bin)',
      'Timeline Management & Basic Cuts (J-cuts, L-cuts, Ripple trims)',
      'Audio Syncing & Sound Design (Gain control, Reverb removal, SFX)',
      'Text, Titles & Motion Graphics (Adobe After Effects integration)',
      'Color Correction & Color Grading (Lumetri Color, LUTs, Scope monitoring)',
      'Visual Effects (VFX) & Compositing (Chroma keying, Masking, Tracking)',
      'Video Export Optimization (H.264, Bitrates, Aspect ratios)',
      'Portfolio Project (Vlog, Commercial promo, and Short Documentary)'
    ],
    govt_price: 4999,
    pvt_price: 7999,
    job_price: 8999,
    is_legacy_pricing: false,
    program_type: 'Trending'
  }
];

async function run() {
  console.log("Starting upsert of trending courses...");
  
  for (const course of trendingCourses) {
    const { data, error } = await supabase
      .from('courses')
      .upsert(course, { onConflict: 'slug' })
      .select();
      
    if (error) {
      console.error(`Error inserting ${course.title}:`, error);
    } else {
      console.log(`Successfully upserted: ${course.title} (ID: ${data[0].id})`);
    }
  }
  
  console.log("Upsert complete!");
}

run();
