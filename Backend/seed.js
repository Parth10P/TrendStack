const bcrypt = require("bcrypt");
const { prisma } = require("./db/config");

const SALT_ROUNDS = 10;
const SEEDED_EMAIL_DOMAIN = "seed.trendstack.app";
const DEFAULT_PASSWORD = "TrendStack@123";

// ─── 30 realistic user profiles ────────────────────────────────────────────────

const seedUserProfiles = [
  {
    firstName: "Aarav",
    lastName: "Sharma",
    bio: "Full-stack dev by day, open-source contributor by night 🌙 | Building things people actually use",
    location: "Bengaluru, India",
  },
  {
    firstName: "Priya",
    lastName: "Patel",
    bio: "Product designer at a Series B startup ✨ | Obsessed with micro-interactions and clean UI",
    location: "Mumbai, India",
  },
  {
    firstName: "Rohan",
    lastName: "Mehta",
    bio: "Indie hacker building SaaS tools 🚀 | Sharing my journey from 0 to $10K MRR",
    location: "Ahmedabad, India",
  },
  {
    firstName: "Ananya",
    lastName: "Reddy",
    bio: "ML engineer @ Google | Writing about AI/ML trends and career tips for devs 🤖",
    location: "Hyderabad, India",
  },
  {
    firstName: "Kabir",
    lastName: "Singh",
    bio: "Freelance photographer 📸 | Capturing stories through street photography and portraits",
    location: "Delhi, India",
  },
  {
    firstName: "Meera",
    lastName: "Nair",
    bio: "Content creator & travel blogger ✈️ | 30 countries and counting | Storyteller at heart",
    location: "Kochi, India",
  },
  {
    firstName: "Arjun",
    lastName: "Kapoor",
    bio: "React Native • TypeScript • Node.js | Currently building @TrendStack 💻",
    location: "Pune, India",
  },
  {
    firstName: "Ishita",
    lastName: "Verma",
    bio: "UX researcher | Making tech more human 🧠 | Speaker at design conferences",
    location: "Bengaluru, India",
  },
  {
    firstName: "Dev",
    lastName: "Joshi",
    bio: "DevOps engineer automating everything ⚙️ | Kubernetes, Docker, and too many YAML files",
    location: "Pune, India",
  },
  {
    firstName: "Saanvi",
    lastName: "Khanna",
    bio: "Data scientist turned startup founder 📊 | Previously @ Amazon | Building in public",
    location: "Gurugram, India",
  },
  {
    firstName: "Vihaan",
    lastName: "Desai",
    bio: "CS student at IIT Bombay 🎓 | Competitive programmer | Open to internships",
    location: "Mumbai, India",
  },
  {
    firstName: "Kiara",
    lastName: "Malhotra",
    bio: "Digital marketing & growth hacking 📈 | Helped 50+ startups scale their user base",
    location: "Delhi, India",
  },
  {
    firstName: "Aditya",
    lastName: "Rao",
    bio: "Mobile app developer | Flutter enthusiast 📱 | Building apps that solve real problems",
    location: "Chennai, India",
  },
  {
    firstName: "Diya",
    lastName: "Gupta",
    bio: "Frontend engineer @ Razorpay | CSS art lover 🎨 | She/Her",
    location: "Bengaluru, India",
  },
  {
    firstName: "Reyansh",
    lastName: "Kumar",
    bio: "Fitness enthusiast & nutrition coach 💪 | Documenting my transformation journey",
    location: "Jaipur, India",
  },
  {
    firstName: "Myra",
    lastName: "Iyer",
    bio: "Book lover 📚 | Writing reviews & reading 100 books this year | Coffee addict ☕",
    location: "Coimbatore, India",
  },
  {
    firstName: "Krish",
    lastName: "Agarwal",
    bio: "Blockchain developer & Web3 enthusiast ⛓️ | Building the decentralized future",
    location: "Surat, India",
  },
  {
    firstName: "Riya",
    lastName: "Chatterjee",
    bio: "Food blogger & home chef 🍳 | Sharing recipes that even college students can make",
    location: "Kolkata, India",
  },
  {
    firstName: "Neel",
    lastName: "Tiwari",
    bio: "Backend engineer | Go & Rust lover 🦀 | Performance optimization nerd",
    location: "Indore, India",
  },
  {
    firstName: "Anika",
    lastName: "Saxena",
    bio: "Climate tech advocate 🌍 | Working on sustainable solutions | TEDx speaker",
    location: "Delhi, India",
  },
  {
    firstName: "Dhruv",
    lastName: "Pandey",
    bio: "Video creator & YouTuber 🎬 | 200K subscribers | Teaching tech to beginners",
    location: "Lucknow, India",
  },
  {
    firstName: "Sara",
    lastName: "Fernandes",
    bio: "Architect turned UI designer 🏗️ | Bringing spatial thinking to digital products",
    location: "Goa, India",
  },
  {
    firstName: "Manav",
    lastName: "Bhatia",
    bio: "Startup CTO | Ex-Microsoft | Mentoring early-stage founders 🎯",
    location: "Noida, India",
  },
  {
    firstName: "Tara",
    lastName: "Menon",
    bio: "Yoga instructor & mindfulness coach 🧘‍♀️ | Helping busy professionals find balance",
    location: "Mysuru, India",
  },
  {
    firstName: "Yash",
    lastName: "Chawla",
    bio: "Cybersecurity analyst 🔒 | Bug bounty hunter | Making the internet a safer place",
    location: "Chandigarh, India",
  },
  {
    firstName: "Navya",
    lastName: "Pillai",
    bio: "Illustrator & graphic designer 🖌️ | Creating visual stories | Available for commissions",
    location: "Thiruvananthapuram, India",
  },
  {
    firstName: "Rudra",
    lastName: "Mishra",
    bio: "Music producer & audio engineer 🎵 | Crafting beats that move people",
    location: "Mumbai, India",
  },
  {
    firstName: "Pihu",
    lastName: "Bansal",
    bio: "EdTech product manager 📝 | Making learning accessible for everyone | Mom of 2",
    location: "Chandigarh, India",
  },
  {
    firstName: "Laksh",
    lastName: "Srinivasan",
    bio: "Game developer & Unity wizard 🎮 | Working on my first indie game",
    location: "Chennai, India",
  },
  {
    firstName: "Siya",
    lastName: "Deshpande",
    bio: "Fashion & lifestyle blogger 👗 | Sustainable fashion advocate | Based in Pune",
    location: "Pune, India",
  },
];

// ─── Rich post content pool (with optional images) ─────────────────────────────
// Images use Unsplash source URLs with curated photo IDs for consistent results.
// Format expected by frontend: [{ type: "image", uri: "https://..." }]

const postContentPool = [
  // Tech & Dev
  {
    content:
      "Just deployed my first production app on Kubernetes and it actually worked first try 🎉 Took me 3 months to learn but totally worth it. The auto-scaling during our Product Hunt launch saved us from going down.\n\nKey takeaways:\n• Start with Minikube locally\n• Use Helm charts early\n• Don't skip monitoring setup\n\n#DevOps #Kubernetes #BuildInPublic",
    imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop",
  },
  {
    content:
      "Hot take: Most startups don't need microservices. A well-structured monolith with clear module boundaries will get you to Series A just fine. I've seen teams spend 6 months on infra that a single Next.js app could handle.\n\nFight me in the comments 👇\n\n#StartupLife #Engineering #WebDev",
    imageUrl: null,
  },
  {
    content:
      "Finally hit 1000 GitHub stars on my open-source project! 🌟 Started it as a weekend hack 8 months ago. Here's what I learned about growing an OSS project:\n\n1. Write great docs (seriously)\n2. Respond to every issue within 24h\n3. Make contributing easy\n4. Share progress publicly\n\nThank you to everyone who contributed! #OpenSource #GitHub",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop",
  },
  {
    content:
      "The gap between a junior and senior developer isn't code — it's communication. Learning to write clear PRs, document decisions, and explain trade-offs has accelerated my career more than any framework ever did.\n\n#CareerAdvice #SoftwareEngineering #Tech",
    imageUrl: null,
  },
  {
    content:
      "Just finished a 30-day TypeScript challenge and my code quality has improved dramatically 📈 Strict mode forced me to think about edge cases I'd normally ignore. Strongly recommend for anyone still writing vanilla JS in 2026.\n\n#TypeScript #JavaScript #CodingChallenge",
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop",
  },
  {
    content:
      "Built a CLI tool this weekend that auto-generates API documentation from your codebase comments. Already using it at work and saved our team ~4 hours/week. Thinking about open-sourcing it.\n\nWould anyone find this useful? 🤔\n\n#DeveloperTools #Productivity #API",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
  },
  {
    content:
      "Unpopular opinion: AI won't replace developers. But developers who use AI will replace those who don't. I've been using Copilot + Claude for 6 months now and my productivity is easily 2x. The trick is knowing WHEN to use it and WHEN to think deeply yourself.\n\n#AI #Programming #FutureOfWork",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
  },
  {
    content:
      "Day 45 of building my SaaS in public 📊\n\n• MRR: $847 → $1,203\n• Active users: 156 → 289\n• Churn: 8.2% → 5.1%\n• New feature: Team collaboration\n\nBiggest lesson this month: Listen to your churned users more than your happy ones. Their feedback is pure gold.\n\n#BuildInPublic #SaaS #IndieHacker",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },

  // Design & Creative
  {
    content:
      "Redesigned our app's onboarding flow and saw a 40% increase in activation rate 🚀 The secret? We removed 3 screens and added one simple animation that shows the core value in 5 seconds. Less is truly more in UX.\n\n#UXDesign #ProductDesign #StartupGrowth",
    imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop",
  },
  {
    content:
      "My design system just hit v2.0! 🎨 Added dark mode tokens, new component variants, and comprehensive documentation. It took 3 months but now our team ships UI 4x faster. Design systems aren't overhead — they're investment.\n\n#DesignSystem #UIDesign #FigmaToCode",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  },
  {
    content:
      "Stop using Lorem Ipsum in your designs. Real content changes everything — spacing, hierarchy, even color choices look different with real words. I started using AI to generate contextual placeholder content and my client presentations improved overnight.\n\n#DesignTips #UIDesign #ProductDesign",
    imageUrl: null,
  },

  // Travel & Lifestyle
  {
    content:
      "Just got back from 2 weeks in Meghalaya and I'm still processing how beautiful it was 🌿 Living bridges, crystal clear rivers, and the most welcoming communities. India has SO much to offer that most of us haven't explored.\n\nFull photo essay coming this weekend!\n\n#TravelIndia #Meghalaya #NorthEastIndia #Photography",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  },
  {
    content:
      "Working remotely from Goa this month 🏖️ Found a co-working space 5 minutes from the beach for ₹4000/month. Morning standup with ocean sounds in the background hits different. Remote work + travel is honestly the best life hack.\n\n#RemoteWork #DigitalNomad #GoaLife",
    imageUrl: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop",
  },
  {
    content:
      "Completed my first solo trip — 10 days across Rajasthan 🏰 Was terrified at first but came back a completely different person. The conversations with strangers, getting lost in Jodhpur's blue streets, watching sunset at Jaisalmer... some things you just have to experience alone.\n\n#SoloTravel #Rajasthan #TravelStories",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop",
  },

  // Food
  {
    content:
      "Made restaurant-style butter chicken at home and my roommates thought I ordered in 😂 The secret is toasting your spices fresh and using kasuri methi at the end. Recipe thread coming soon!\n\n🍗🔥 #HomeChef #IndianFood #CookingAtHome",
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
  },
  {
    content:
      "Explored 7 hidden street food spots in Old Delhi this weekend. The kachori at Chandni Chowk at 6 AM is a spiritual experience. I documented everything with costs — most dishes under ₹50. Delhi's food scene is unmatched.\n\n#StreetFood #DelhiFood #FoodBlogger #IndianStreetFood",
    imageUrl: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&h=600&fit=crop",
  },
  {
    content:
      "Tried meal prepping for the first time — made 5 days of healthy lunches in 2 hours on Sunday 🥗 Total cost: ₹1,200. That's ₹240/day vs ₹300-400 ordering in. My wallet AND my body are thanking me.\n\nStarter tip: Keep it simple. Rice + protein + roasted veggies.\n\n#MealPrep #HealthyEating #BudgetFood",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop",
  },

  // Fitness & Wellness
  {
    content:
      "6 months of consistent gym + no alcohol results 💪\n\nBefore: 78kg, 28% body fat\nNow: 72kg, 18% body fat\n\nNo crash diets. No supplements. Just:\n• 10K steps daily\n• Protein with every meal\n• 7-8 hours sleep\n• Progressive overload 3x/week\n\nConsistency > intensity, always.\n\n#FitnessJourney #Transformation #GymLife",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  },
  {
    content:
      "Started a 5 AM morning routine 3 months ago and it changed everything ☀️\n\n5:00 - Wake up\n5:15 - 20 min meditation\n5:35 - Journaling\n6:00 - Workout\n7:00 - Deep work block\n\nThe quiet hours before the world wakes up are insanely productive. Not for everyone, but worth trying for 21 days.\n\n#MorningRoutine #Productivity #Wellness",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
  },

  // Books & Learning
  {
    content:
      "Just finished 'The Almanack of Naval Ravikant' and it genuinely shifted how I think about wealth, happiness, and leverage 📖 My top 3 highlights:\n\n1. Seek wealth, not money or status\n2. Learn to sell. Learn to build.\n3. Happiness is a skill you develop\n\nIf you haven't read it, the entire book is free online.\n\n#BookReview #Reading #SelfImprovement",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
  },
  {
    content:
      "Reading challenge update: 47/100 books done! 📚 This month's favorites:\n\n⭐ Atomic Habits — life-changing (finally read it)\n⭐ Project Hail Mary — best sci-fi I've read in years\n⭐ Show Your Work — short but powerful for creators\n\nDrop your current read below! 👇\n\n#BookTwitter #ReadingChallenge #Books2026",
    imageUrl: null,
  },

  // Career & Growth
  {
    content:
      "Left my ₹25 LPA job to freelance and here's my honest 6-month update:\n\n✅ Earning 1.5x my old salary\n✅ Complete schedule freedom\n✅ Working on projects I love\n\n❌ Inconsistent income months\n❌ Health insurance is expensive alone\n❌ Loneliness is real\n\nWould I do it again? Absolutely. But it's not as glamorous as Twitter makes it seem.\n\n#Freelancing #CareerChange #IndieWorker",
    imageUrl: null,
  },
  {
    content:
      "Interview tip that got me offers from 3 FAANG companies: Instead of memorizing answers, learn to structure your thinking. Use the STAR method for behavioral rounds and always clarify requirements before coding.\n\nAlso: Side projects matter MORE than DSA for many companies now. The industry is shifting.\n\n#InterviewTips #TechCareers #FAANG",
    imageUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&h=600&fit=crop",
  },

  // Photography & Art
  {
    content:
      "Spent the golden hour shooting portraits at Marine Drive yesterday 📸 Natural light at 5:30 PM in Mumbai is absolutely magical. Shot everything on my phone — you don't need expensive gear to take beautiful photos.\n\nSwipe for my favorites →\n\n#StreetPhotography #Mumbai #MobilePhotography #GoldenHour",
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=800&h=600&fit=crop",
  },
  {
    content:
      "Finished my latest digital illustration — a cyberpunk reimagining of Varanasi's ghats 🖌️ Took about 40 hours in Procreate. The challenge was blending traditional architecture with neon sci-fi elements while keeping it respectful.\n\nPrints available on my website!\n\n#DigitalArt #Illustration #Cyberpunk #IndianArt",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=600&fit=crop",
  },

  // Community & Social
  {
    content:
      "Our dev community meetup in Bengaluru just crossed 500 members! 🎉 What started as 8 friends meeting at a coffee shop is now a proper community with monthly talks, hack nights, and a job board.\n\nIf you're in Bengaluru and interested in tech, DM me!\n\n#Community #BengaluruTech #Developers #Networking",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    content:
      "Mentored 15 college students this semester and 12 of them got internships at good companies. Nothing makes me happier than seeing young devs level up. If you're a senior dev, please consider mentoring — it takes 1-2 hours/week and changes lives.\n\n#Mentoring #TechCommunity #GivingBack",
    imageUrl: null,
  },

  // Trending / General
  {
    content:
      "The attention economy is broken. We scroll 300 feet of content daily but remember almost nothing. I started a 'digital detox hour' — no screens from 8-9 PM. Just a book, music, or conversation. My sleep improved in 3 days.\n\n#DigitalWellbeing #MentalHealth #ScreenTime",
    imageUrl: null,
  },
  {
    content:
      "Today's small win: Fixed a bug that had been haunting our production for 2 weeks. Turned out to be a single missing await keyword 😤 Two weeks. One word. That's software development in a nutshell.\n\n#DevLife #Debugging #Programming #CodeHumor",
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
  },
  {
    content:
      "Launched my newsletter last month. Expected 50 subscribers. Got 2,300. 🤯 What worked:\n\n1. Posted the link on exactly ONE platform\n2. Gave immediate value in issue #1\n3. Kept it under 5-minute read\n4. Sent at 8 AM IST on Tuesdays\n\nConsistency and quality > growth hacks.\n\n#Newsletter #ContentCreation #WritingCommunity",
    imageUrl: null,
  },
  {
    content:
      "Tried the Pomodoro technique for a full week and here are my numbers:\n\n📊 Before: ~4 hours of focused work/day\n📊 After: ~6.5 hours of focused work/day\n\nThe 5-minute breaks are non-negotiable. Your brain needs rest to perform. Also discovered I do my best work between 10 AM - 1 PM.\n\n#Productivity #TimeManagement #WorkSmarter",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
  },
  {
    content:
      "Best ₹500 I ever spent: A proper desk lamp with warm light. My eye strain is completely gone and my video calls look 10x more professional. Small workspace upgrades make a huge difference.\n\nWhat's your best budget WFH purchase?\n\n#WorkFromHome #RemoteWork #Productivity",
    imageUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=600&fit=crop",
  },
  {
    content:
      "Organized a beach cleanup in Goa with 40 volunteers 🌊 We collected 200+ kg of plastic in 3 hours. The state of our beaches is heartbreaking but the community spirit was incredible. Monthly cleanups starting next week.\n\nJoin us if you're in Goa!\n\n#BeachCleanup #Environment #GoaForGood #ClimateAction",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
  },
  {
    content:
      "TIL: You can use the Performance tab in Chrome DevTools to record and analyze your app's rendering. Found a component re-rendering 47 times on a single scroll. Fixed it with React.memo and our FPS went from 24 to 60.\n\n#ReactJS #WebPerformance #FrontendDev #TIL",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
  },
  {
    content:
      "My internship at a YC startup taught me more in 3 months than 3 years of college 🎓\n\nThings they don't teach you:\n• How to prioritize ruthlessly\n• How to communicate async\n• How to say 'I don't know' confidently\n• How to ship 80% perfect instead of waiting for 100%\n\n#Internship #StartupLife #CareerAdvice #Students",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  },
  {
    content:
      "Created a personal finance dashboard using Google Sheets + Scripts and it automatically tracks all my expenses 💰 Setup took 2 hours, saves me 30 min/week. Will share the template if people are interested.\n\nBeing good with money starts with visibility.\n\n#PersonalFinance #Budgeting #GoogleSheets #LifeHack",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
  },
  {
    content:
      "Three years ago I couldn't write a for-loop. Today I lead a team of 8 engineers at a funded startup. The timeline doesn't matter — what matters is showing up every single day and being genuinely curious.\n\nTo everyone starting out: You're closer than you think. Keep building.\n\n#Motivation #CodingJourney #TechCareers #NeverGiveUp",
    imageUrl: null,
  },
  {
    content:
      "Switched from VS Code to Neovim and my productivity actually dropped for 2 weeks before skyrocketing 🚀 The learning curve is real but now I barely touch my mouse. My config is on GitHub if anyone wants to try.\n\n#Neovim #DeveloperTools #CodingSetup #VSCode",
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop",
  },
  {
    content:
      "Had my first viral tweet yesterday (50K impressions from a meme about JavaScript) 😂 But here's the thing — my technical thread that took 3 hours to write got 200 views. The algorithm rewards entertainment, not education.\n\nStill going to keep writing educational content though. That's what actually helps people.\n\n#ContentCreation #SocialMedia #TechTwitter",
    imageUrl: null,
  },
  {
    content:
      "Planted 50 saplings with my college friends this weekend 🌱 We've committed to maintaining them for a full year. It's not much in the grand scheme of things, but if even 40 of them survive, that's 40 more trees than yesterday.\n\nSmall actions, collective impact.\n\n#PlantTrees #Environment #CollegeLife #GoGreen",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
  },
  {
    content:
      "Just wrapped up teaching a free weekend bootcamp for underprivileged students in Dharavi. 25 students learned HTML, CSS, and basic JavaScript in 2 days. The hunger to learn in those kids' eyes is something I'll never forget.\n\nEducation should never be a privilege.\n\n#TechForGood #Education #SocialImpact #CodingBootcamp",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
  },
];

// ─── Comment content pool ──────────────────────────────────────────────────────

const commentContentPool = [
  "This is exactly what I needed to hear today. Bookmarked! 🔖",
  "Couldn't agree more! I went through the same thing last year.",
  "Great perspective! Most people overlook this point entirely.",
  "This is underrated advice. Sharing with my team right now 🙌",
  "I tried this approach and it genuinely worked. Can confirm!",
  "Saving this. The breakdown is incredibly helpful, thanks!",
  "Man, I wish someone told me this 2 years ago 😅",
  "Beautifully said. This should be pinned for every beginner.",
  "I disagree slightly — I think context matters a lot here. But great post overall!",
  "Interesting take! Have you considered the opposite perspective though?",
  "This resonates so much. Going through this exact phase right now.",
  "Adding to this: Another thing that helped me was documenting everything from day one.",
  "Real talk right here 💯 No sugarcoating, just facts.",
  "The fact that this isn't talked about more is wild. Thanks for sharing!",
  "Just implemented your suggestion and the results are already showing. Thank you!",
  "This thread is gold. Following for more insights like this 🧵",
  "As someone who just started, this gives me so much hope. Thank you! 🙏",
  "Spicy take but I'm here for it 🔥 The industry needs more honest voices.",
  "Love the transparency here. Most people only share the highlights.",
  "Your posts consistently deliver value. One of my favorite accounts on here!",
  "Okay but can we talk about how good the writing is too? Clear and concise 👏",
  "This is the content I open this app for. Pure signal, zero noise.",
  "Needed this reminder today. Sometimes we forget the basics matter most.",
  "Hot take but I actually agree 100%. The data supports this completely.",
  "Can you do a detailed breakdown of this? Would love to learn more!",
  "Laughed way too hard at this 😂 But also, so true!",
  "Shared this with my entire team on Slack. We're implementing this tomorrow.",
  "The best advice is always the simplest. Great post!",
  "This is why I love this community. Real conversations, real value.",
  "Plot twist: I was thinking the exact same thing this morning. Great minds! 🧠",
  "Screenshotted this for motivation. Printing and putting on my wall!",
  "The consistency in your content is impressive. Keep it up! 👑",
  "I was literally about to ask this same question. Thanks for the insights!",
  "Strong disagree on point 3, but everything else is spot on 🎯",
  "This changed my perspective completely. Going to rethink my approach.",
  "Wow, the numbers speak for themselves. Incredible progress!",
  "Finally someone said it! Been thinking this for months.",
  "Commenting to boost this because more people need to see it ⬆️",
  "Really appreciate you sharing the failures too, not just the wins. Refreshing!",
  "You should write a blog post expanding on this. Too valuable for just a post!",
];

// ─── Avatar generation ─────────────────────────────────────────────────────────
// Using ui-avatars.com (returns PNG) — works natively in React Native's <Image>

const avatarBackgrounds = [
  "6366f1", // indigo
  "8b5cf6", // violet
  "ec4899", // pink
  "ef4444", // red
  "f97316", // orange
  "eab308", // yellow
  "22c55e", // green
  "14b8a6", // teal
  "06b6d4", // cyan
  "3b82f6", // blue
  "a855f7", // purple
  "f43f5e", // rose
  "0ea5e9", // sky
  "10b981", // emerald
  "f59e0b", // amber
];

function buildAvatarUrl(firstName, lastName, index) {
  const name = `${firstName}+${lastName}`;
  const bg = avatarBackgrounds[index % avatarBackgrounds.length];
  return `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=ffffff&size=256&bold=true&font-size=0.4`;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset(array, minCount, maxCount, excluded = new Set()) {
  const available = array.filter((item) => !excluded.has(item));
  const count = Math.min(
    available.length,
    randomInt(minCount, Math.min(maxCount, available.length))
  );
  const copy = [...available];
  const selected = [];

  for (let index = 0; index < count; index += 1) {
    const pickIndex = randomInt(0, copy.length - 1);
    selected.push(copy[pickIndex]);
    copy.splice(pickIndex, 1);
  }

  return selected;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Build seed data ───────────────────────────────────────────────────────────

function buildSeedUsers() {
  return seedUserProfiles.map((profile, index) => {
    const name = `${profile.firstName} ${profile.lastName}`;
    const username = `${profile.firstName.toLowerCase()}${profile.lastName.toLowerCase()}${index + 1}`;

    return {
      name,
      username,
      email: `${username}@${SEEDED_EMAIL_DOMAIN}`,
      bio: profile.bio,
      location: profile.location,
      avatarUrl: buildAvatarUrl(profile.firstName, profile.lastName, index),
    };
  });
}

// ─── Database operations ───────────────────────────────────────────────────────

async function clearExistingSeedData() {
  console.log("  Clearing previous seed data...");

  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        endsWith: `@${SEEDED_EMAIL_DOMAIN}`,
      },
    },
    select: { id: true },
  });

  if (existingUsers.length === 0) {
    console.log("  No existing seed data found.");
    return;
  }

  const userIds = existingUsers.map((user) => user.id);

  // Get all seeded posts
  const seededPosts = await prisma.post.findMany({
    where: { authorId: { in: userIds } },
    select: { id: true },
  });
  const postIds = seededPosts.map((post) => post.id);

  // Get all seeded comments
  const seededComments = await prisma.comment.findMany({
    where: {
      OR: [{ authorId: { in: userIds } }, { postId: { in: postIds } }],
    },
    select: { id: true },
  });
  const commentIds = seededComments.map((comment) => comment.id);

  // Delete comment likes
  if (commentIds.length > 0) {
    await prisma.commentLike.deleteMany({
      where: {
        OR: [{ userId: { in: userIds } }, { commentId: { in: commentIds } }],
      },
    });
  }

  // Delete post likes
  if (postIds.length > 0) {
    await prisma.like.deleteMany({
      where: {
        OR: [{ userId: { in: userIds } }, { postId: { in: postIds } }],
      },
    });
  } else {
    await prisma.like.deleteMany({
      where: { userId: { in: userIds } },
    });
  }

  // Delete follows
  await prisma.follow.deleteMany({
    where: {
      OR: [{ followerId: { in: userIds } }, { followingId: { in: userIds } }],
    },
  });

  // Delete comments
  if (commentIds.length > 0) {
    await prisma.comment.deleteMany({
      where: { id: { in: commentIds } },
    });
  }

  // Delete posts
  if (postIds.length > 0) {
    await prisma.post.deleteMany({
      where: { id: { in: postIds } },
    });
  }

  // Delete profiles
  await prisma.profile.deleteMany({
    where: { userId: { in: userIds } },
  });

  // Delete users
  await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  console.log(`  Cleared ${existingUsers.length} existing seed users and related data.`);
}

async function seedUsers() {
  console.log("  Creating 30 users with profiles...");

  const seedData = buildSeedUsers();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
  const createdUsers = [];

  for (const [index, seedUser] of seedData.entries()) {
    const created = await prisma.user.create({
      data: {
        name: seedUser.name,
        username: seedUser.username,
        email: seedUser.email,
        password: passwordHash,
        provider: "local",
        profile: {
          create: {
            name: seedUser.name,
            bio: seedUser.bio,
            avatarUrl: seedUser.avatarUrl,
            location: seedUser.location,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    createdUsers.push({ ...created, seedIndex: index });
  }

  console.log(`  ✓ Created ${createdUsers.length} users.`);
  return createdUsers;
}

async function seedPosts(users) {
  console.log("  Creating posts...");

  const posts = [];
  const shuffledContent = shuffleArray(postContentPool);
  let contentIndex = 0;

  for (const [userIndex, user] of users.entries()) {
    // First 10 users get 2-3 posts, next 10 get 1-2, last 10 get 1
    let postCount;
    if (userIndex < 10) {
      postCount = randomInt(2, 3);
    } else if (userIndex < 20) {
      postCount = randomInt(1, 2);
    } else {
      postCount = 1;
    }

    for (let i = 0; i < postCount; i += 1) {
      const createdAt = new Date(
        Date.now() - randomInt(1, 72) * 60 * 60 * 1000 - randomInt(0, 59) * 60000
      );

      // Cycle through content pool
      const postContent = shuffledContent[contentIndex % shuffledContent.length];
      contentIndex += 1;

      // Build attachments array if the post has an image
      const attachments = postContent.imageUrl
        ? [{ type: "image", uri: postContent.imageUrl }]
        : [];

      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          content: postContent.content,
          attachments: attachments.length > 0 ? attachments : undefined,
          published: true,
          createdAt,
        },
      });

      posts.push(post);
    }
  }

  console.log(`  ✓ Created ${posts.length} posts.`);
  return posts;
}

async function seedPostLikes(posts, users) {
  console.log("  Adding likes to posts...");

  let totalLikes = 0;

  for (const post of posts) {
    // Each post gets 3-18 likes (realistic engagement)
    const likerIds = randomSubset(
      users.map((user) => user.id),
      3,
      18,
      new Set([post.authorId])
    );

    if (likerIds.length === 0) continue;

    await prisma.like.createMany({
      data: likerIds.map((userId) => ({
        postId: post.id,
        userId,
      })),
    });

    await prisma.post.update({
      where: { id: post.id },
      data: { likeCount: likerIds.length },
    });

    totalLikes += likerIds.length;
  }

  console.log(`  ✓ Added ${totalLikes} post likes.`);
  return totalLikes;
}

async function seedComments(posts, users) {
  console.log("  Adding comments to posts...");

  const comments = [];

  for (const post of posts) {
    // Each post gets 2-10 comments
    const commenterIds = randomSubset(
      users.map((user) => user.id),
      2,
      10,
      new Set([post.authorId])
    );

    let pinnedAssigned = false;

    for (const [index, commenterId] of commenterIds.entries()) {
      const commentContent = sample(commentContentPool);

      const comment = await prisma.comment.create({
        data: {
          postId: post.id,
          authorId: commenterId,
          content: commentContent,
          pinned: !pinnedAssigned && index === 0 && Math.random() > 0.6,
          createdAt: new Date(
            post.createdAt.getTime() + randomInt(5, 480) * 60000
          ),
        },
      });

      if (comment.pinned) pinnedAssigned = true;
      comments.push(comment);
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { commentCount: commenterIds.length },
    });
  }

  console.log(`  ✓ Added ${comments.length} comments.`);
  return comments;
}

async function seedCommentLikes(comments, users) {
  console.log("  Adding likes to comments...");

  let totalCommentLikes = 0;

  for (const comment of comments) {
    const likerIds = randomSubset(
      users.map((user) => user.id),
      0,
      8,
      new Set([comment.authorId])
    );

    if (likerIds.length === 0) continue;

    await prisma.commentLike.createMany({
      data: likerIds.map((userId) => ({
        commentId: comment.id,
        userId,
      })),
    });

    await prisma.comment.update({
      where: { id: comment.id },
      data: { likeCount: likerIds.length },
    });

    totalCommentLikes += likerIds.length;
  }

  console.log(`  ✓ Added ${totalCommentLikes} comment likes.`);
  return totalCommentLikes;
}

async function seedFollows(users) {
  console.log("  Creating follow relationships...");

  let totalFollows = 0;

  for (const user of users) {
    // Each user follows 5-15 others
    const followingIds = randomSubset(
      users.map((u) => u.id),
      5,
      15,
      new Set([user.id])
    );

    for (const followingId of followingIds) {
      try {
        await prisma.follow.create({
          data: {
            followerId: user.id,
            followingId,
          },
        });
        totalFollows += 1;
      } catch (error) {
        // Skip duplicates silently
      }
    }
  }

  console.log(`  ✓ Created ${totalFollows} follow relationships.`);
  return totalFollows;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║     🚀 TrendStack Seed — 30 Users Data      ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  await clearExistingSeedData();

  const users = await seedUsers();
  const posts = await seedPosts(users);
  const postLikes = await seedPostLikes(posts, users);
  const comments = await seedComments(posts, users);
  const commentLikes = await seedCommentLikes(comments, users);
  const follows = await seedFollows(users);

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║         ✅ Seed Completed Successfully       ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  console.log(
    JSON.stringify(
      {
        summary: {
          users: users.length,
          posts: posts.length,
          postLikes,
          comments: comments.length,
          commentLikes,
          follows,
        },
        credentials: {
          emailDomain: SEEDED_EMAIL_DOMAIN,
          defaultPassword: DEFAULT_PASSWORD,
          exampleLogin: `aaravsharma1@${SEEDED_EMAIL_DOMAIN}`,
        },
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
