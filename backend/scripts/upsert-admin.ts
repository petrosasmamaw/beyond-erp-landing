import { PrismaClient, UserRole, AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "12345678";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      fullName: "System Admin",
      phone: "+251 939 048 523",
      companyName: "Beyond ERP Enterprise",
      companySectorId: "retail-trading",
      companyTinNumber: "0012345678",
      passwordHash,
      role: UserRole.ADMIN,
      permissions: ["*"],
      status: AccountStatus.ACTIVE,
    },
    create: {
      fullName: "System Admin",
      email,
      phone: "+251 939 048 523",
      companyName: "Beyond ERP Enterprise",
      companySectorId: "retail-trading",
      companyTinNumber: "0012345678",
      passwordHash,
      role: UserRole.ADMIN,
      permissions: ["*"],
      status: AccountStatus.ACTIVE,
    },
  });

  console.log("SUCCESS: Upserted admin user:", {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
  });
}

main()
  .catch((e) => {
    console.error("ERROR upserting admin user:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

