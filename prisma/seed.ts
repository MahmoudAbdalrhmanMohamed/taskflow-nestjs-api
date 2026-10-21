import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TaskFlow database seeding (clean workspace)...');

  const demoEmail = (process.env.DEMO_USER_EMAIL || 'demo@taskflow.dev').toLowerCase();
  const demoPassword = process.env.DEMO_USER_PASSWORD || 'DemoPassword123!';
  const demoName = process.env.DEMO_USER_NAME || 'Alex Morgan';

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(demoPassword, salt);

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashedPassword,
        name: demoName,
        jobTitle: 'Lead Mobile & Backend Architect',
        department: 'Core Engineering',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      },
    });
    console.log(`👤 Created demo user: ${user.email} (${user.id})`);
  } else {
    // Update password in case env changed
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        name: demoName,
      },
    });
    console.log(`👤 Verified existing demo user: ${user.email}`);
  }

  // Remove any static/demo tasks and projects for a completely clean workspace
  const deletedTasks = await prisma.task.deleteMany({});
  const deletedProjects = await prisma.project.deleteMany({});

  console.log(`🧹 Removed ${deletedTasks.count} static tasks and ${deletedProjects.count} static projects.`);
  console.log('✨ Clean slate workspace ready: 0 projects, 0 tasks.');
  console.log(`🔑 Credentials: ${demoEmail} / ${demoPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
