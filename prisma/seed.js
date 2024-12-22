const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Generate users: 1 ADMIN, 10 MANAGERS, and the rest USERS
  const users = [];

  // Add 1 ADMIN
  users.push({
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean() ? faker.date.recent() : null,
    image: faker.image.avatar(),
    password: faker.internet.password(),
    role: 'ADMIN',
    birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    position: faker.person.jobTitle(),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
  });

  // Add 10 MANAGERS
  for (let i = 0; i < 10; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean() ? faker.date.recent() : null,
      image: faker.image.avatar(),
      password: faker.internet.password(),
      role: 'MANAGER',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      position: faker.person.jobTitle(),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    });
  }

  // Add remaining USERS
  for (let i = 0; i < 39; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean() ? faker.date.recent() : null,
      image: faker.image.avatar(),
      password: faker.internet.password(),
      role: 'USER',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      position: faker.person.jobTitle(),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    });
  }

  await prisma.user.createMany({
    data: users,
  });
  console.log('1 ADMIN, 10 MANAGERS, and 39 USERS created.');

  // Fetch doctors (ADMIN and MANAGER)
  const doctors = await prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'MANAGER'],
      },
    },
  });

  if (doctors.length === 0) {
    console.error(
      'No doctors found with roles ADMIN or MANAGER. Seeding aborted.'
    );
    return;
  }

  // Fetch patients (USER)
  const patients = await prisma.user.findMany({
    where: { role: 'USER' },
  });

  // Generate 20 services
  const services = [];
  for (let i = 0; i < 20; i++) {
    services.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      duration: faker.number.int({ min: 30, max: 120 }),
      price: faker.number.int({ min: 50, max: 25000 }),
    });
  }
  await prisma.service.createMany({
    data: services,
  });
  console.log('20 Services created.');

  const allServices = await prisma.service.findMany();

  // Generate 200 events (some before today, some this week, some next week)
  const events = [];
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay() + 1; // Monday

  for (let i = 0; i < 200; i++) {
    const doctor = faker.helpers.arrayElement(doctors);
    const patient = faker.helpers.arrayElement(patients);
    const service = faker.helpers.arrayElement(allServices);

    // Generate random date (before today, this week, or next week)
    const randomDayOffset = faker.helpers.arrayElement(
      [...Array(21)].map((_, idx) => idx - 7) // Days from -7 to 14 (last week, this week, next week)
    );
    const startDate = new Date(today);
    startDate.setDate(startOfWeek + randomDayOffset);
    startDate.setHours(faker.number.int({ min: 9, max: 18 }));
    startDate.setMinutes(faker.helpers.arrayElement([0, 15, 30, 45]));

    const duration = service.duration * 60 * 1000; // Convert minutes to milliseconds
    const endDate = new Date(startDate.getTime() + duration);

    events.push({
      id: faker.string.uuid(),
      title: `${service.name} Appointment`,
      startDate,
      endDate,
      serviceId: service.id,
      doctorId: doctor.id,
      patientId: patient.id,
    });
  }

  await prisma.event.createMany({
    data: events,
  });
  console.log('200 Events created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
