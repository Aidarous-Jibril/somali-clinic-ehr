import { prisma } from "../../config/prisma.js";

export const createStaff = async (data: any) => {
  let person = null;

  // Try find existing by license number
  if (data.licenseNumber) {
    person = await prisma.staffPerson.findUnique({
      where: {
        licenseNumber: data.licenseNumber,
      },
    });
  }

  // Optional fallback by nationalId
  if (!person && data.nationalId) {
    person = await prisma.staffPerson.findFirst({
      where: {
        nationalId: data.nationalId,
      },
    });
  }

  // Create if not exists
  if (!person) {
    person = await prisma.staffPerson.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        licenseNumber: data.licenseNumber,
        nationalId: data.nationalId,
        phone: data.phone,
      },
    });
  }

  // Create clinic login account
  const account = await prisma.staffAccount.create({
    data: {
      personId: person.id,
      clinicId: data.clinicId,
      email: data.email,
      password: data.password,
    },
  });

  // Create role / unit assignment
  const assignment = await prisma.staffAssignment.create({
    data: {
      accountId: account.id,
      unitId: data.unitId,
      teamId: data.teamId,
      role: data.role,
    },
    include: {
      unit: true,
      team: true,
    },
  });

  return {
    person,
    account,
    assignment,
  };
};

export const findStaffByEmail = (email: string) => {
  return prisma.staffAccount.findFirst({
    where: {
      email,
      isActive: true,
    },
    include: {
      clinic: true,
      person: true,
      assignments: {
        include: {
          unit: true,
          team: true,
        },
      },
    },
  });
};

export const findAll = (clinicId: string) => {
  return prisma.staffAccount.findMany({
    where: { clinicId },
    include: {
      person: true,
      assignments: {
        include: {
          unit: true,
          team: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findByUnit = (unitId: string) => {
  return prisma.staffAssignment.findMany({
    where: { unitId },
    include: {
      unit: true,
      account: {
        include: {
          person: true,
        },
      },
    },
  });
};