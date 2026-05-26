// ============================================================
//  AYUSH SRIVASTAVA — PORTFOLIO DATA FILE
//  Edit anything here and it will auto-reflect across the site
// ============================================================

export const personal = {
  name: "Ayush Srivastava",
  firstName: "Ayush",
  lastName: "Srivastava",
  tagline: "Full Stack Developer",
  subTagline: "B.Tech CSE Graduate",
  bio: "Full Stack Developer (MERN) with hands-on experience building scalable web applications, RESTful APIs, and real-time systems. Proficient in React.js, Node.js, Express.js, and MongoDB, with a strong foundation in Data Structures & Algorithms.",
  bio2: "Passionate about developing user-centric solutions, integrating secure authentication (JWT), and deploying production-grade applications on Vercel and Render.",
  location: "Prayagraj, UP",
  email: "ayushrivastava0018@gmail.com",
  phone: "+91-8931878476",
  linkedin: "https://linkedin.com/in/ayush-srivastava-b26a84280",
  github: "https://github.com/ayush0068",           // ← update with your GitHub URL
  resumeLink: "",                           // ← add Google Drive link to your resume
  profileImage: "/images/ayush.png",
  suitImage: "/images/AYUSHIMG.png",
};

export const education = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institute: "United University",
    location: "Prayagraj, UP",
    year: "2021 – 2025",
    score: "CGPA: 8.2",
  },
  {
    degree: "Senior Secondary — Class XII",
    institute: "MV Convent Inter College",
    location: "Prayagraj, UP",
    year: "2020 – 2021",
    score: "76%",
  },
  {
    degree: "Secondary — Class X",
    institute: "MV Convent Inter College",
    location: "Prayagraj, UP",
    year: "2018 – 2019",
    score: "85%",
  },
];

export const experience = [
  {
    role: "DSA Trainee",
    company: "GeeksforGeeks",
    duration: "June 2025 – July 2025",
    points: [
      "Completed an intensive 4-week hands-on program in Data Structures & Algorithms.",
      "Solved 100+ problems, significantly improving algorithmic thinking and coding efficiency.",
    ],
  },
  {
    role: "Full-Stack Development Intern (MERN)",
    company: "United University",
    duration: "June 2024 – July 2024",
    points: [
      "Engineered a full-featured e-commerce web application using the MERN Stack with secure JWT-based authentication and role-based access control.",
      "Integrated a secure payment gateway and optimized MongoDB schema, reducing query response time by 30%.",
    ],
  },
  {
    role: "App Development Intern (Java)",
    company: "IIT Kharagpur (Remote)",
    duration: "November 2023 – December 2023",
    points: [
      "Designed and developed Android mobile applications using Java, incorporating user-centric UI/UX principles.",
    ],
  },
];

export const skills = [
  // Frontend
  { name: "React.js",      category: "Frontend",  percent: 90 },
  { name: "Next.js",       category: "Frontend",  percent: 75 },
  { name: "Tailwind CSS",  category: "Frontend",  percent: 88 },
  { name: "JavaScript",    category: "Frontend",  percent: 85 },
  { name: "HTML5 / CSS3",  category: "Frontend",  percent: 92 },
  // Backend
  { name: "Node.js",       category: "Backend",   percent: 85 },
  { name: "Express.js",    category: "Backend",   percent: 83 },
  { name: "REST APIs",     category: "Backend",   percent: 88 },
  { name: "JWT Auth",      category: "Backend",   percent: 82 },
  // Database
  { name: "MongoDB",       category: "Database",  percent: 80 },
  { name: "SQL",           category: "Database",  percent: 70 },
  // Other
  { name: "Git / GitHub",  category: "Tools",     percent: 85 },
  { name: "DSA",           category: "Core",      percent: 75 },
];

export const projects = [
  {
    title: "UniShop",
    stack: "MongoDB · Express.js · React.js · Node.js",
    duration: "June 2024 – August 2024",
    description:
      "A multi-vendor e-commerce platform unifying 10+ shop categories, enabling seamless product browsing and secure online purchases for 200+ users.",
    points: [
      "JWT-based authentication & secure checkout flow",
      "RESTful APIs; deployed on Vercel with CI/CD workflow",
    ],
    image: "/images/work_1_md.jpg",   // ← replace with your project screenshot
    liveUrl: "",
    githubUrl: "",
    tags: ["MERN", "E-commerce", "JWT"],
  },
  {
    title: "Uni-Hotel",
    stack: "MERN Stack",
    duration: "October 2024 – March 2025",
    description:
      "Full-stack hotel discovery and booking platform with real-time availability search, secure reservation management, and JWT-authenticated user sessions.",
    points: [
      "Normalized MongoDB schema improving data retrieval speed",
      "Backend on Render, frontend on Vercel",
    ],
    image: "/images/work_2_md.jpg",   // ← replace with your project screenshot
    liveUrl: "",
    githubUrl: "",
    tags: ["MERN", "Booking", "Real-time"],
  },
  {
    title: "UniCare+",
    stack: "MERN Stack · ZegoCloud",
    duration: "January 2026 – Present",
    description:
      "MERN-based doctor consultancy platform supporting real-time video & voice consultations via ZegoCloud, with secure appointment scheduling.",
    points: [
      "Digital prescription generation system for post-visit workflow",
      "JWT auth & role-based access for patients and doctors",
    ],
    image: "/images/UNICARE+.jpeg", // ← replace with your project screenshot
    liveUrl: "https://uni-care-sigma.vercel.app/",
    githubUrl: "https://github.com/ayush0068/UniCare.git",
    tags: ["MERN", "WebRTC", "Healthcare"],
  },
];

export const certifications = [
  "10-Day Skill Development Program — Centum Foundation × Infosys (Feb 2026)",
  "IBM Expert Lab National Level 2-Day Live Hackathon — SVYASA University, Bangalore (2025)",
  "Machine Learning & Artificial Intelligence Bootcamp (2024)",
  "SQL (Structured Query Language) Bootcamp — November 2024",
  "3-Day Workshop on Generative AI & Human Robotics — IIIT Allahabad (Feb 2024)",
];

export const hobbies = [
  { label: "Music",   icon: "🎵" },
  { label: "Movies & Series", icon: "🎬" },
  { label: "Coding",  icon: "💻" },
  { label: "Cricket", icon: "🏏" },
];