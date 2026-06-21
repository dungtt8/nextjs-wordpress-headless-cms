import { NextResponse } from "next/server";
import { Resend } from "resend";

import type { LeadFormPayload } from "@/lib/home/types";

// Initialize services
const resend = new Resend(process.env.RESEND_API_KEY);
const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_BASIC_AUTH = btoa(
    `${process.env.WORDPRESS_BASIC_AUTH_USER}:${process.env.WORDPRESS_BASIC_AUTH_PASSWORD}`
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_EMAIL = "info@chinahack.xxx";

/**
 * Validate lead form payload
 */
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

/**
 * Create a lead post in WordPress via REST API
 */
async function createWordPressLead(
    payload: LeadFormPayload,
    clientIp: string | null
): Promise<{ id: number }> {
    const now = new Date().toISOString();

    const wpPayload = {
        title: payload.fullName,
        content: payload.note || "",
        status: "publish",
        acf: {
            email: payload.email,
            phone: payload.phone,
            gpa: payload.gpa,
            status: "new",
            submitted_at: now,
            vercel_ip: clientIp || "unknown",
        },
    };

    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/leads`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${WORDPRESS_BASIC_AUTH}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(wpPayload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WordPress API failed: ${response.status} - ${errorText}`);
    }

    return response.json() as Promise<{ id: number }>;
}

/**
 * Send admin notification email via Resend
 */
async function sendAdminEmail(payload: LeadFormPayload): Promise<void> {
    await resend.emails.send({
        from: "noreply@chinahack.xxx",
        to: ADMIN_EMAIL,
        subject: `🔔 New Lead: ${payload.fullName}`,
        html: `
            <h2 style="font-family: sans-serif; color: #333;">New Profile Assessment Request</h2>
            <div style="font-family: sans-serif; color: #555; line-height: 1.6;">
                <p><strong>Name:</strong> ${payload.fullName}</p>
                <p><strong>Email:</strong> ${payload.email}</p>
                <p><strong>Phone:</strong> ${payload.phone}</p>
                <p><strong>GPA:</strong> ${payload.gpa}</p>
                <p><strong>Note:</strong> ${payload.note || "(empty)"}</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p><a href="${WORDPRESS_URL}/wp-admin/edit.php?post_type=leads" style="color: #0066cc;">View all leads →</a></p>
            </div>
        `,
    });
}

export async function POST(request: Request) {
    const payload = (await request.json()) as Partial<LeadFormPayload>;
    const errors = validate(payload);

    // Validation failed
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

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
    let leadId: number | null = null;

    // Attempt to create WordPress lead
    try {
        const wpLead = await createWordPressLead(payload as LeadFormPayload, clientIp);
        leadId = wpLead.id;
        console.log(`[Lead API] ✓ Created WordPress lead post #${leadId} for ${(payload as LeadFormPayload).fullName}`);
    } catch (wpError) {
        // Log but continue - graceful degradation
        console.error("[Lead API] ✗ WordPress error:", wpError instanceof Error ? wpError.message : String(wpError));
    }

    // Attempt to send admin email
    try {
        await sendAdminEmail(payload as LeadFormPayload);
        console.log(`[Lead API] ✓ Email sent to ${ADMIN_EMAIL}`);
    } catch (emailError) {
        // Log but continue - graceful degradation
        console.error("[Lead API] ✗ Email error:", emailError instanceof Error ? emailError.message : String(emailError));
    }

    // Always return success to user (graceful degradation)
    const learnerName = payload.fullName || "Learner";
    return NextResponse.json(
        {
            success: true,
            learnerName,
            leadId,
            message: `Thank you, ${learnerName}. We received your profile and will contact you within 24 hours.`,
        },
        { status: 200 }
    );
}
