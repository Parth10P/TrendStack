const bcrypt = require("bcrypt");
const { prisma } = require("./db/config");

const SALT_ROUNDS = 10;
const SEEDED_EMAIL_DOMAIN = "seed.trendstack.app";
const DEFAULT_PASSWORD = "TrendStack@123";

const firstNames = [
  "Aarav",
  "Anaya",
  "Vihaan",
  "Ishita",
  "Kabir",
  "Meera",
  "Aditya",
  "Diya",
  "Arjun",
  "Saanvi",
  "Reyansh",
  "Kiara",
  "Rohan",
  "Myra",
  "Dev",
  "Aisha",
  "Rudra",
  "Tara",
  "Yash",
  "Naina",
  "Krish",
  "Riya",
  "Parth",
  "Anika",
  "Neel",
  "Sara",
  "Dhruv",
  "Mahi",
  "Manav",
  "Pihu",
  "Arnav",
  "Ira",
  "Veer",
  "Navya",
  "Laksh",
  "Siya",
];

const lastNames = [
  "Sharma",
  "Patel",
  "Verma",
  "Mehta",
  "Kapoor",
  "Reddy",
  "Joshi",
  "Khanna",
  "Nair",
  "Malhotra",
  "Singh",
  "Desai",
];

const bios = [
  "Sharing product thoughts, startup lessons, and digital experiments.",
  "Writing about design systems, mobile UX, and internet culture.",
  "Tech explorer with a soft spot for clean code and smarter communities.",
  "Posting quick ideas on creators, growth, and things worth trying online.",
  "Turning daily observations into threads, mini blogs, and useful notes.",
  "Building in public and documenting wins, mistakes, and learnings.",
];

const locations = [
  "Ahmedabad, India",
  "Bengaluru, India",
  "Pune, India",
  "Delhi, India",
  "Mumbai, India",
  "Jaipur, India",
  "Hyderabad, India",
  "Surat, India",
];

const topics = [
  "react native",
  "creator economy",
  "college projects",
  "personal branding",
  "frontend performance",
  "indie hacking",
  "ai tools",
  "design systems",
  "community building",
  "content writing",
];

const postOpeners = [
  "Hot take",
  "Small win",
  "Today I learned",
  "Unpopular opinion",
  "Behind the scenes",
  "Quick note",
  "Lesson from this week",
  "Random thought",
];

const postBodies = [
  "Consistency beats intensity when you are building a product with a small team.",
  "A simple onboarding improvement can do more for retention than adding one more feature.",
  "Good comments make a social app feel alive faster than polished empty screens.",
  "Users notice clarity before they notice complexity.",
  "Most product momentum comes from shipping the second version, not imagining the tenth.",
  "The best mobile experiences reduce hesitation at every step.",
  "People share more often when the interface feels forgiving and easy to read.",
  "A clean feed is not enough if the conversations under each post feel empty.",
];

const questionEndings = [
  "What would you improve first?",
  "Have you seen the same thing in your app?",
  "Would you ship this as is?",
  "What is your approach here?",
  "Curious how others handle this.",
];

const commentStarters = [
  "Strong point.",
  "I agree with this.",
  "This is actually underrated.",
  "I tested something similar.",
  "That stood out to me too.",
  "Really clean observation.",
  "This feels accurate.",
  "I would add one thing though.",
];

const commentFinishes = [
  "The onboarding flow usually decides whether users come back.",
  "People respond better when the first action feels obvious.",
  "A little social proof can make the whole feed feel more active.",
  "I would probably simplify the first screen even more.",
  "The writing experience matters more than most teams expect.",
  "This is where visual hierarchy changes everything.",
  "I think this is especially true for younger users.",
  "It is much easier to retain users after the first comment or like.",
];

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

function buildAvatarUrl(name, index) {
  const backgrounds = ["19be64", "246bff", "8b5cf6", "ef4444", "f59e0b", "0ea5e9"];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${backgrounds[index % backgrounds.length]}&color=fff&size=256`;
}

function buildSeedUsers() {
  return firstNames.map((firstName, index) => {
    const lastName = lastNames[index % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${index + 1}`;

    return {
      name,
      username,
      email: `${username}@${SEEDED_EMAIL_DOMAIN}`,
      bio: bios[index % bios.length],
      location: locations[index % locations.length],
      avatarUrl: buildAvatarUrl(name, index),
    };
  });
}

function buildPostContent(user, index) {
  const topic = topics[index % topics.length];
  return `${sample(postOpeners)} on ${topic}: ${sample(postBodies)} ${sample(
    questionEndings
  )}`;
}

function buildCommentContent() {
  return `${sample(commentStarters)} ${sample(commentFinishes)}`;
}

async function clearExistingSeedData() {
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        endsWith: `@${SEEDED_EMAIL_DOMAIN}`,
      },
    },
    select: { id: true },
  });

  if (existingUsers.length === 0) {
    return;
  }

  const userIds = existingUsers.map((user) => user.id);
  const seededPosts = await prisma.post.findMany({
    where: { authorId: { in: userIds } },
    select: { id: true },
  });
  const postIds = seededPosts.map((post) => post.id);
  const seededComments = await prisma.comment.findMany({
    where: {
      OR: [{ authorId: { in: userIds } }, { postId: { in: postIds } }],
    },
    select: { id: true },
  });
  const commentIds = seededComments.map((comment) => comment.id);

  if (commentIds.length > 0) {
    await prisma.commentLike.deleteMany({
      where: {
        OR: [{ userId: { in: userIds } }, { commentId: { in: commentIds } }],
      },
    });
  }

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

  if (commentIds.length > 0) {
    await prisma.comment.deleteMany({
      where: { id: { in: commentIds } },
    });
  }

  if (postIds.length > 0) {
    await prisma.post.deleteMany({
      where: { id: { in: postIds } },
    });
  }

  await prisma.profile.deleteMany({
    where: { userId: { in: userIds } },
  });

  await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });
}

async function seedUsers() {
  const seedUsers = buildSeedUsers();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
  const createdUsers = [];

  for (const [index, seedUser] of seedUsers.entries()) {
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

  return createdUsers;
}

async function seedPosts(users) {
  const posts = [];

  for (const [userIndex, user] of users.entries()) {
    const postCount = userIndex < 12 ? randomInt(2, 3) : randomInt(1, 2);

    for (let index = 0; index < postCount; index += 1) {
      const createdAt = new Date(
        Date.now() - randomInt(1, 20) * 60 * 60 * 1000 - randomInt(0, 59) * 60000
      );

      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          content: buildPostContent(user, userIndex + index),
          published: true,
          createdAt,
        },
      });

      posts.push(post);
    }
  }

  return posts;
}

async function seedPostLikes(posts, users) {
  let totalLikes = 0;

  for (const post of posts) {
    const likerIds = randomSubset(
      users.map((user) => user.id),
      3,
      12,
      new Set([post.authorId])
    );

    if (likerIds.length === 0) {
      continue;
    }

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

  return totalLikes;
}

async function seedComments(posts, users) {
  const comments = [];

  for (const post of posts) {
    const commenterIds = randomSubset(
      users.map((user) => user.id),
      2,
      8,
      new Set([post.authorId])
    );

    let pinnedAssigned = false;

    for (const [index, commenterId] of commenterIds.entries()) {
      const comment = await prisma.comment.create({
        data: {
          postId: post.id,
          authorId: commenterId,
          content: buildCommentContent(),
          pinned: !pinnedAssigned && index === 0 && Math.random() > 0.55,
          createdAt: new Date(
            post.createdAt.getTime() + randomInt(5, 240) * 60000
          ),
        },
      });

      if (comment.pinned) {
        pinnedAssigned = true;
      }

      comments.push(comment);
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { commentCount: commenterIds.length },
    });
  }

  return comments;
}

async function seedCommentLikes(comments, users) {
  let totalCommentLikes = 0;

  for (const comment of comments) {
    const likerIds = randomSubset(
      users.map((user) => user.id),
      0,
      6,
      new Set([comment.authorId])
    );

    if (likerIds.length === 0) {
      continue;
    }

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

  return totalCommentLikes;
}

async function main() {
  console.log("Refreshing TrendStack demo seed...");

  await clearExistingSeedData();

  const users = await seedUsers();
  const posts = await seedPosts(users);
  const postLikes = await seedPostLikes(posts, users);
  const comments = await seedComments(posts, users);
  const commentLikes = await seedCommentLikes(comments, users);

  console.log("Seed completed successfully.");
  console.log(
    JSON.stringify(
      {
        users: users.length,
        posts: posts.length,
        postLikes,
        comments: comments.length,
        commentLikes,
        seededEmailDomain: SEEDED_EMAIL_DOMAIN,
        defaultPassword: DEFAULT_PASSWORD,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
