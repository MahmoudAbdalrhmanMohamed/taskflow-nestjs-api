import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TaskFlow database seeding...');

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

  // Clear existing tasks and projects for clean demo state
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.project.deleteMany({ where: { ownerId: user.id } });

  console.log('🧹 Cleaned previous projects and tasks for demo user');

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'TaskFlow Mobile App',
      description: 'Production Flutter application with Riverpod, GoRouter, and Material 3 design system.',
      color: '#6366F1', // Indigo
      icon: 'smartphone',
      status: 'active',
      ownerId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'NestJS Cloud Backend',
      description: 'Scalable REST API with NestJS, Prisma ORM, PostgreSQL, and Swagger OpenAPI docs.',
      color: '#8B5CF6', // Violet
      icon: 'server',
      status: 'active',
      ownerId: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Security & DevOps Pipeline',
      description: 'Containerized deployment, GitHub Actions CI/CD, SSL/TLS, and OWASP audit.',
      color: '#EC4899', // Pink
      icon: 'shield',
      status: 'active',
      ownerId: user.id,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: 'Product Launch & Analytics',
      description: 'Marketing landing pages, user telemetry, feature flags, and App Store readiness.',
      color: '#10B981', // Emerald
      icon: 'rocket',
      status: 'active',
      ownerId: user.id,
    },
  });

  console.log('📁 Created 4 demo projects');

  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  // Tasks dataset
  const tasksData = [
    // Project 1: Flutter App
    {
      title: 'Design Material 3 Theme & Palette',
      description: 'Configure light and dark color schemes using deep indigo and purple seed tokens.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 2 * day),
      order: 0,
      projectId: project1.id,
    },
    {
      title: 'Configure Riverpod 2.x State Management',
      description: 'Setup NotifierProvider hierarchy for Auth, Project, Task, and Theme controllers.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 1 * day),
      order: 1,
      projectId: project1.id,
    },
    {
      title: 'Build Interactive Kanban Board UI',
      description: 'Implement drag-and-drop or status toggle columns for Todo, In Progress, and Done cards.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 1 * day),
      order: 0,
      projectId: project1.id,
    },
    {
      title: 'Implement Offline Secure Storage Interceptor',
      description: 'Persist JWT tokens securely with flutter_secure_storage and handle 401 re-authentication.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() + 3 * day),
      order: 1,
      projectId: project1.id,
    },
    {
      title: 'Add Tablet & Desktop Responsive Layout',
      description: 'Use NavigationRail and dual-pane layout when screen width exceeds 720dp breakpoint.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() + 6 * day),
      order: 0,
      projectId: project1.id,
    },
    {
      title: 'Polish Micro-animations & Loading Skeletons',
      description: 'Create smooth shimmer effects and hero transitions between task cards and details.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date(now.getTime() + 8 * day),
      order: 1,
      projectId: project1.id,
    },

    // Project 2: NestJS Cloud Backend
    {
      title: 'Architect Prisma Schema & Relational Models',
      description: 'Design User -> Project -> Task cascade relationships with foreign keys and indexes.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 3 * day),
      order: 0,
      projectId: project2.id,
    },
    {
      title: 'Implement JWT Authentication & Passport Strategy',
      description: 'Create register, login, profile endpoints with bcrypt hashing and bearer auth guard.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 1 * day),
      order: 1,
      projectId: project2.id,
    },
    {
      title: 'Create Dashboard Aggregation Endpoint',
      description: 'Compute total stats, overdue tasks, completion percentage, and upcoming deadlines.',
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() - 1 * day),
      order: 2,
      projectId: project2.id,
    },
    {
      title: 'Setup Swagger OpenAPI Specification',
      description: 'Annotate all DTOs and endpoints with clear descriptions, response schemas, and tags.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() + 2 * day),
      order: 0,
      projectId: project2.id,
    },
    {
      title: 'Add Rate Limiting & Helmet Security Headers',
      description: 'Protect public auth routes against brute-force attacks using nestjs/throttler.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date(now.getTime() + 5 * day),
      order: 0,
      projectId: project2.id,
    },

    // Project 3: Security & DevOps Pipeline
    {
      title: 'Dockerize Backend for Render & Cloud Deployments',
      description: 'Write multi-stage Dockerfile optimizing Node.js image size and Prisma binaries.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 2 * day),
      order: 0,
      projectId: project3.id,
    },
    {
      title: 'Configure GitHub Actions CI Workflow',
      description: 'Automate build, linting, and automated test execution on push to main branch.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 1 * day),
      order: 0,
      projectId: project3.id,
    },
    {
      title: 'Resolve Overdue SSL Certificate Renewal',
      description: 'Verify automated Let’s Encrypt certificate renewal for api.taskflow.dev endpoint.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() - 1 * day), // Overdue intentionally for dashboard display!
      order: 0,
      projectId: project3.id,
    },
    {
      title: 'Perform Ownership Authorization Testing',
      description: 'Ensure cross-tenant isolation so user A cannot read or modify user B projects.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 4 * day),
      order: 1,
      projectId: project3.id,
    },

    // Project 4: Product Launch & Analytics
    {
      title: 'Finalize Technical Interview Presentation Deck',
      description: 'Highlight architectural trade-offs, state management rationale, and scalability plan.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 1 * day),
      order: 0,
      projectId: project4.id,
    },
    {
      title: 'Record 2-Minute End-to-End Application Demo',
      description: 'Capture screen flow showing login, project creation, task editing, and Kanban drag.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(now.getTime() + 2 * day),
      order: 0,
      projectId: project4.id,
    },
    {
      title: 'Compile Production Deployment Documentation',
      description: 'Document environment variables, database migration commands, and API guides.',
      status: 'DONE',
      priority: 'LOW',
      dueDate: new Date(now.getTime() - 1 * day),
      order: 0,
      projectId: project4.id,
    },
  ];

  for (const t of tasksData) {
    await prisma.task.create({
      data: {
        ...t,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Successfully seeded ${tasksData.length} tasks!`);
  console.log('🎉 Database seeding complete!');
  console.log(`Credentials: ${demoEmail} / ${demoPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
