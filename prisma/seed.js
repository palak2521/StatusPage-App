// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Create incidents with updates
  const incidents = [
    {
      title: 'Server Outage',
      status: 'ONGOING',
      service: 'API Service',
      updates: {
        create: [
          { content: 'Initial outage reported' },
          { content: 'Engineers investigating the issue' }
        ]
      }
    },
    {
      title: 'Database Maintenance',
      status: 'SCHEDULED',
      service: 'Database',
      updates: {
        create: [
          { content: 'Scheduled for tonight' },
          { content: 'Estimated downtime: 2 hours' }
        ]
      }
    },
    {
      title: 'Web Dashboard Slowdown',
      status: 'RESOLVED',
      service: 'Web Dashboard',
      updates: {
        create: [
          { content: 'Performance degradation noticed' },
          { content: 'Issue identified and fixed' }
        ]
      }
    }
  ];

    const users = await prisma.user.findMany();
  const services = [
    {
      name: 'API Service',
      status: 'OPERATIONAL',
      uptime: 99.99,
      userId: users[0].id 
    
    },
    {
      name: 'Web Dashboard',
      status: 'OPERATIONAL',
      uptime: 99.95,
      userId: users[1].id 

    },
    {
      name: 'Database',
      status: 'OPERATIONAL',
      uptime: 99.99,
      userId: users[1].id 
    }
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service
    });
  }
  console.log('Creating incidents...');
  for (const incident of incidents) {
    await prisma.incident.create({
      data: incident
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });