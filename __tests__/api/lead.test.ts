import { describe, expect, it, vi } from "vitest";

describe("POST /api/lead", () => {
  it("returns 400 for invalid payload", async () => {
    const { POST } = await import("@/app/api/lead/route");

    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email" }),
    });

    const res = await POST(req);
    const body = (await res.json()) as {
      success: boolean;
      errors?: Record<string, string>;
    };

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.errors?.fullName).toBeDefined();
    expect(body.errors?.email).toBeDefined();
  });

  it("returns success when random failure does not trigger", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);
    const { POST } = await import("@/app/api/lead/route");

    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Alex Nguyen",
        email: "alex@example.com",
        phone: "0123456789",
        gpa: "3.8/4.0",
      }),
    });

    const res = await POST(req);
    const body = (await res.json()) as {
      success: boolean;
      learnerName?: string;
    };

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.learnerName).toBe("Alex Nguyen");

    vi.restoreAllMocks();
  });

  it("returns error when random failure triggers", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const { POST } = await import("@/app/api/lead/route");

    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Minh Le",
        email: "minh@example.com",
        phone: "0987654321",
        gpa: "9.0/10",
      }),
    });

    const res = await POST(req);
    const body = (await res.json()) as { success: boolean; message: string };

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toContain("Temporary server issue");

    vi.restoreAllMocks();
  });
});
