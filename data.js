// ===== AI TV MARKETPLACE DATA =====

const CATEGORIES = [
  { id: 'ai-fundamentals', name: 'Workshops',                  emoji: '🧠', color: '#7B88FB', bg: '#eef0ff', count: 5 },
  { id: 'programming',     name: 'Bonuses',                    emoji: '💰', color: '#272659', bg: '#e8e8f5', count: 0 },
  { id: 'creative',        name: 'Masterclass',                emoji: '🎓', color: '#CDB5FB', bg: '#f5f0ff', count: 2 },
];

const SUBCATEGORIES = {
  'ai-fundamentals': ['All', 'Python', 'Tech Skills', 'AI Tools', 'Excel', 'Stock Market'],
  'programming':     [],
  'creative':        [],
};

const COURSES = [
  // Workshops (ai-fundamentals)
  { id: 1,  title: 'Python using AI Workshop',        category: 'ai-fundamentals', subcategory: 'Python',        emoji: '🐍', bg: '#eef0ff', price: 199,  originalPrice: 1999,  rating: 4.9, reviews: 3241, level: 'beginner',     duration: '3h',     lessons: 18, instructor: 'Aditya Kachave & Aman Saurav',   badge: 'Bestseller', includes: ['3 hours of live workshop recording','Python cheat sheet','Certificate of completion','Lifetime access','Community support'], desc: 'Learn Python the smart way — using AI as your coding assistant! In this hands-on workshop, Aditya Kachave and Aman Saurav walk you through Python fundamentals with AI tools that accelerate your learning 10x.', curriculum: ['Setting Up Python with AI Help','Variables & Logic with Copilot','Functions & Loops','Working with Files','AI-Assisted Debugging','Building Mini Projects','Automating Tasks','Your AI-Powered Python Journey'] },
  { id: 2,  title: '10X Techie using AI Workshop',   category: 'ai-fundamentals', subcategory: 'Tech Skills',   emoji: '⚡', bg: '#f0f4ff', price: 9,    originalPrice: 999,   rating: 4.8, reviews: 5102, level: 'beginner',     duration: '2h',     lessons: 12, instructor: 'Prakhar Bafna & Aman Saurav',    badge: 'Hot Deal',   includes: ['2 hours of workshop video','AI tools guide','Resource kit','Certificate','Telegram community'], desc: 'Become a 10X more productive techie using the latest AI tools! Prakhar Bafna and Aman Saurav share their proven system to supercharge your skills, automate routine work, and stand out in the tech world.', curriculum: ['The 10X Techie Mindset','Top AI Tools for Developers','AI-Powered Code Review','Speed Up with ChatGPT & Claude','Building Smarter, Not Harder','AI for Documentation','Productivity Workflows','Your 10X Action Plan'] },
  { id: 3,  title: 'AI Tools Workshop',              category: 'ai-fundamentals', subcategory: 'AI Tools',      emoji: '🛠️', bg: '#f5f0ff', price: 9,    originalPrice: 999,   rating: 4.9, reviews: 4876, level: 'beginner',     duration: '2h 30m', lessons: 14, instructor: 'Aditya Kachave & Aditya Goenka', badge: 'Hot Deal',   includes: ['2.5 hours of workshop video','AI tools cheat sheet','Certificate','Lifetime access'], desc: 'Master the most essential AI tools in one power-packed workshop! Aditya Kachave and Aditya Goenka take you through the best AI tools for productivity, creativity, and career growth — all in one session.', curriculum: ['AI Tools Landscape 2026','ChatGPT Mastery','Claude & Gemini','AI for Design (Midjourney)','AI for Content Creation','AI for Research','Workflow Automation','Building Your Personal AI Stack'] },
  { id: 4,  title: 'Excel using AI',                category: 'ai-fundamentals', subcategory: 'Excel',         emoji: '📊', bg: '#fff8ee', price: 99,   originalPrice: 999,   rating: 4.8, reviews: 2987, level: 'beginner',     duration: '2h',     lessons: 10, instructor: 'Aditya Goenka',                 badge: 'Popular',    includes: ['2 hours of workshop video','Excel AI templates','Formula cheat sheet','Certificate'], desc: 'Transform the way you use Excel with the power of AI! Aditya Goenka shows you how to use AI to write formulas, analyse data, build dashboards, and automate reporting — no prior Excel expertise needed.', curriculum: ['Excel + AI Basics','Generating Formulas with AI','Data Cleaning Automation','AI-Powered Pivot Tables','Smart Charts & Dashboards','Conditional Formatting with AI','Automating Reports','Excel AI Templates You Can Use Now'] },
  { id: 5,  title: 'Stock Market using AI',         category: 'ai-fundamentals', subcategory: 'Stock Market',  emoji: '📈', bg: '#f0fff4', price: 9,    originalPrice: 999,   rating: 4.7, reviews: 3654, level: 'beginner',     duration: '2h 30m', lessons: 14, instructor: 'PRATIK CHAKRABORTY & Rahul Chandra', badge: 'Hot Deal', includes: ['2.5 hours of workshop video','Market analysis templates','AI tools guide','Certificate'], desc: 'Decode the stock market using AI! PRATIK CHAKRABORTY and Rahul Chandra teach you how to use AI tools for stock research, trend analysis, and smarter investment decisions — even as a complete beginner.', curriculum: ['Stock Market Fundamentals','How AI Reads Markets','AI Tools for Stock Research','Sentiment Analysis with AI','Technical Analysis + AI','Building a Watchlist with AI','Risk Management Strategies','Your First AI-Assisted Trade Plan'] },

  // Masterclass
  { id: 11, title: 'AI-Career Accelerator',           category: 'creative', subcategory: 'All', emoji: '🚀', bg: '#f3e5f5', price: 28600, originalPrice: 378000, rating: 4.9, reviews: 1250, level: 'advanced', duration: '20h', lessons: 120, instructor: 'Be10x Faculty', badge: 'Bestseller', includes: ['20 hours of video','Career roadmap','Resume & portfolio kit','Certificate','Placement support'], desc: 'Fast-track your career with AI! This comprehensive accelerator equips you with the AI skills, tools, and mindset to land high-paying roles and transform your professional trajectory.', curriculum: ['Career Landscape in the AI Era','Building Your AI Skill Stack','Personal Branding with AI','Resume & Portfolio with AI','Interview Preparation','Networking with AI Tools','Freelancing & Consulting','Landing Your First AI Role'] },
  { id: 12, title: 'AI Engineering Career Accelerator', category: 'creative', subcategory: 'All', emoji: '⚙️', bg: '#e0f7fa', price: 71500, originalPrice: 510950, rating: 4.9, reviews: 876, level: 'advanced', duration: '40h', lessons: 240, instructor: 'Be10x Faculty', badge: 'Premium', includes: ['40 hours of video','Live mentorship sessions','Project reviews','Industry certifications','Placement assistance','Alumni network access'], desc: 'The ultimate career accelerator for aspiring AI engineers. Master cutting-edge AI engineering skills, build production-grade projects, and secure top-tier engineering roles with expert mentorship.', curriculum: ['AI Engineering Foundations','Python & ML Fundamentals','Deep Learning Architectures','LLMs & Prompt Engineering','Building AI Products','MLOps & Deployment','System Design for AI','Career Launch & Placement'] },

];

const LEARNING_PATHS = [
  { title: 'Complete AI Beginner Path', icon: '🌱', desc: 'Start from zero and build a solid AI foundation in 30 days. Perfect for total beginners.', steps: '5 courses • 30–40 hours', courses: [1, 2, 6, 10, 5] },
  { title: 'AI Creator Path',           icon: '🎨', desc: 'Master AI tools for art, music, video, and writing. Create amazing content with AI.', steps: '4 courses • 20–25 hours', courses: [11, 12, 13, 14] },
  { title: 'AI Developer Path',         icon: '💻', desc: 'Build real AI apps and chatbots. Go from Python basics to production deployments.', steps: '5 courses • 45–55 hours', courses: [6, 9, 7, 8, 26] },
  { title: 'Young Genius Path',         icon: '🧒', desc: 'For kids and teens! Learn AI through games, stories, and fun projects.', steps: '4 courses • 18–22 hours', courses: [15, 16, 17, 18] },
  { title: 'Business Leader Path',      icon: '💼', desc: 'Transform your business with AI. From productivity to full AI strategy.', steps: '4 courses • 25–30 hours', courses: [20, 19, 22, 21] },
  { title: 'AI Expert Path',            icon: '🚀', desc: 'Go deep into advanced AI. Deep learning, computer vision, NLP, and MLOps.', steps: '4 courses • 50–60 hours', courses: [23, 24, 25, 26] },
];

const PROMO_CODES = {
  'AITV20': 0.20,
  'KIDS50': 0.50,
  'LEARN10': 0.10,
  'WELCOME30': 0.30,
};
