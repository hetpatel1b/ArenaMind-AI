import { prisma } from '../src/lib/db/client';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'hetpatel1b@gmail.com';
  const password = 'Het@892007'; // Match the user's muscle memory

  // We need an organization for the user
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'Global Arena Partners',
        createdById: 'system',
        country: 'US',
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isActive: true,
      role: 'organization_admin',
    },
    create: {
      email,
      name: 'Het Patel',
      password: hashedPassword,
      organizationId: org.id,
      role: 'organization_admin',
      isActive: true,
    },
  });

  console.log('Created admin user:', user.email, 'with password:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
