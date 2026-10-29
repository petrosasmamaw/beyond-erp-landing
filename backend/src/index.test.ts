import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app, prisma } from "./index.js";
import { seedDatabase } from "./seed.js";

async function login(email = "owner@beyonderp.local", password = "Beyond@12345") {
  const response = await request(app).post("/api/auth/login").send({ email, password }).expect(200);
  return response.body.token as string;
}

describe("Beyond ERP API", () => {
  beforeAll(async () => {
    await seedDatabase(prisma);
  }, 30_000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("authenticates seeded owner users", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner@beyonderp.local", password: "Beyond@12345" })
      .expect(200);

    expect(response.body.user.role).toBe("OWNER");
    expect(response.body.token).toBeTruthy();
  });

  it("enforces RBAC for manager accounts", async () => {
    const token = await login("manager@beyonderp.local", "Manager@12345");
    await request(app).get("/api/users").set("Authorization", `Bearer ${token}`).expect(403);
  });

  it("syncs offline transactions", async () => {
    const token = await login();
    const response = await request(app)
      .post("/api/sync/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [
          {
            type: "INCOME",
            amount: 1234,
            description: `Offline sync test ${Date.now()}`,
            category: "Retail & Trading",
            sectorId: "retail-trading",
            paymentMethod: "Cash",
            vatAmount: 185.1,
            status: "COMPLETED",
            synced: false,
            occurredAt: new Date().toISOString()
          }
        ]
      })
      .expect(200);

    expect(response.body.count).toBe(1);
    expect(response.body.transactions[0].synced).toBe(true);
  });

  it("creates finance workflow records and returns finance summary", async () => {
    const token = await login();
    await request(app)
      .post("/api/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerName: "Vitest Customer",
        sectorId: "retail-trading",
        items: [{ description: "Test item", quantity: 2, unitPrice: 100 }],
        status: "SENT"
      })
      .expect(201);

    const summary = await request(app).get("/api/finance/summary").set("Authorization", `Bearer ${token}`).expect(200);
    expect(summary.body.profitLoss.invoiced).toBeGreaterThan(0);
  });

  it("runs sector domain workflows with field validation", async () => {
    const token = await login();
    await request(app)
      .post("/api/domain-workflows/retail-trading/sku-inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        values: {
          sku: `SKU-${Date.now()}`,
          itemName: "Test SKU",
          quantity: 5,
          unitPrice: 99
        }
      })
      .expect(201);

    await request(app)
      .post("/api/domain-workflows/retail-trading/sku-inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({ values: { sku: "" } })
      .expect(400);
  });

  it("queues client registrations and approves paid sector access", async () => {
    const token = await login();
    const stamp = Date.now();
    const email = `client-${stamp}@beyonderp.local`;
    const temporaryPassword = "Client@12345";

    const requestResponse = await request(app)
      .post("/api/registration-requests")
      .send({
        companyName: `Client ${stamp} PLC`,
        tinNumber: "0099887766",
        sectorId: "healthcare",
        fullName: "Client Owner",
        email,
        phone: "+251911987654",
        notes: "Paid via bank transfer"
      })
      .expect(201);

    expect(requestResponse.body.status).toBe("PENDING_PAYMENT");

    await request(app)
      .post(`/api/registration-requests/${requestResponse.body.id}/actions/mark-paid`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paymentReference: `PAY-${stamp}` })
      .expect(200);

    const approved = await request(app)
      .post(`/api/registration-requests/${requestResponse.body.id}/actions/approve`)
      .set("Authorization", `Bearer ${token}`)
      .send({ temporaryPassword })
      .expect(200);

    expect(approved.body.request.status).toBe("APPROVED");
    expect(approved.body.user.companySectorId).toBe("healthcare");

    const loginResponse = await request(app).post("/api/auth/login").send({ email, password: temporaryPassword }).expect(200);
    expect(loginResponse.body.user.companySectorId).toBe("healthcare");
  });
});
