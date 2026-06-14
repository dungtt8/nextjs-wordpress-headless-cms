import { NextResponse } from "next/server";

import type { LeadFormPayload } from "@/lib/home/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FAILURE_RATE = 0.3;
const RESPONSE_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function validate(payload: Partial<LeadFormPayload>): Partial<Record<keyof LeadFormPayload, string>> {
  const errors: Partial<Record<keyof LeadFormPayload, string>> = {};

  if (!payload.fullName?.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!payload.email?.trim() || !EMAIL_REGEX.test(payload.email)) {
    errors.email = "Please enter a valid email format.";
  }

  if (!payload.phone?.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!payload.gpa?.trim()) {
    errors.gpa = "GPA is required.";
  }

  return errors;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LeadFormPayload>;
  const errors = validate(payload);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid payload.",
      errors,
      },
      { status: 400 }
    );
  }

  await sleep(RESPONSE_DELAY_MS);

  if (Math.random() < FAILURE_RATE) {
    return NextResponse.json(
      {
        success: false,
        message: "Temporary server issue. Please retry.",
      },
      { status: 500 }
    );
  }

  const learnerName = payload.fullName ?? "Learner";
  return NextResponse.json(
    {
      success: true,
      learnerName,
      message: `Thank you, ${learnerName}. We received your profile and will contact you within 24 hours.`,
    },
    { status: 200 }
  );
}
