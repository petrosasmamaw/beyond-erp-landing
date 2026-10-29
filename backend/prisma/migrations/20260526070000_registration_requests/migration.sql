CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'APPROVED', 'REJECTED');

ALTER TABLE "User"
  ADD COLUMN "companyName" TEXT,
  ADD COLUMN "companyTinNumber" TEXT,
  ADD COLUMN "companySectorId" TEXT;

CREATE TABLE "RegistrationRequest" (
  "id" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "tinNumber" TEXT,
  "sectorId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "notes" TEXT,
  "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "paymentReference" TEXT,
  "approvedById" TEXT,
  "createdUserId" TEXT,
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "RegistrationRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "User_companySectorId_idx" ON "User"("companySectorId");
CREATE INDEX "RegistrationRequest_status_idx" ON "RegistrationRequest"("status");
CREATE INDEX "RegistrationRequest_sectorId_idx" ON "RegistrationRequest"("sectorId");
CREATE INDEX "RegistrationRequest_email_idx" ON "RegistrationRequest"("email");
