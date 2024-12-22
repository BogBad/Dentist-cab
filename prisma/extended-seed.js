const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');

  // Clear existing data
  await prisma.event.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Generate 20 doctors with ADMIN or MANAGER roles
  const doctors = [];
  for (let i = 0; i < 10; i++) {
    doctors.push({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean() ? faker.date.recent() : null,
      image: faker.image.avatar(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(['ADMIN', 'MANAGER']),
      birthDate: faker.date.birthdate({ min: 30, max: 65, mode: 'age' }),
      position: faker.person.jobTitle(),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    });
  }

  await prisma.user.createMany({
    data: doctors,
  });
  console.log('20 Doctors (ADMIN/MANAGER) created.');

  // Generate 80 patients with USER role
  const patients = [];
  for (let i = 0; i < 90; i++) {
    patients.push({
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
    data: patients,
  });
  console.log('80 Patients (USER) created.');

  // Generate 20 services
  const services = [];
  for (let i = 0; i < 20; i++) {
    services.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      duration: faker.helpers.arrayElement([30, 60, 90, 120]),
      price: faker.helpers.arrayElement([
        250, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 10000, 25000,
      ]),
    });
  }

  await prisma.service.createMany({
    data: services,
  });
  console.log('20 Services created.');

  const allDoctors = await prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'MANAGER'],
      },
    },
  });

  const allPatients = await prisma.user.findMany({
    where: { role: 'USER' },
  });

  const allServices = await prisma.service.findMany();

  // Generate 500 events for a 3-month range (past and future)
  const events = [];
  const today = new Date();

  for (let i = 0; i < 500; i++) {
    const doctor = faker.helpers.arrayElement(allDoctors);
    const patient = faker.helpers.arrayElement(allPatients);
    const service = faker.helpers.arrayElement(allServices);

    // Generate random date within 3 months back and forward
    const randomDayOffset = faker.number.int({ min: -90, max: 90 });
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + randomDayOffset);
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
  console.log('500 Events created for 3 months back and forward.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
