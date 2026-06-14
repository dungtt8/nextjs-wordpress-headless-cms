"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { LeadFormContent, LeadFormPayload } from "@/lib/home/types";

type FormState = "idle" | "validating" | "loading" | "success" | "error";

type FieldErrors = Partial<Record<keyof LeadFormPayload, string>>;

interface HomeLeadFormProps {
  data: LeadFormContent;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: LeadFormPayload = {
  fullName: "",
  email: "",
  phone: "",
  gpa: "",
  note: "",
};

export function HomeLeadForm({ data }: HomeLeadFormProps) {
  const [values, setValues] = useState<LeadFormPayload>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [feedback, setFeedback] = useState("");

  const isLoading = state === "loading";
  const isSuccess = state === "success";

  const validate = (payload: LeadFormPayload) => {
    const next: FieldErrors = {};

    if (!payload.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!payload.email.trim() || !EMAIL_REGEX.test(payload.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!payload.phone.trim()) next.phone = "Please enter your phone number.";
    if (!payload.gpa.trim()) next.gpa = "Please enter your GPA.";

    return next;
  };

  const updateField = (field: keyof LeadFormPayload, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("validating");

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFeedback("Please review the highlighted fields.");
      setState("error");
      return;
    }

    setErrors({});
    setFeedback("");
    setState("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { success: boolean; message: string };
      if (!response.ok || !result.success) {
        setState("error");
        setFeedback(result.message || "Submission failed. Please try again.");
        return;
      }

      setState("success");
      setFeedback(result.message);
    } catch {
      setState("error");
      setFeedback("Submission failed. Please try again.");
    }
  };

  return (
    <section id="lead-form" className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-center text-3xl font-bold text-[#1F2937]">{data.title}</h2>
      <p className="text-center text-sm text-slate-600">{data.subtitle}</p>

      {isSuccess ? (
        <div className="success-fade-in rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          {feedback}
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Field
            id="fullName"
            label="Full name"
            placeholder="Enter your full name"
            value={values.fullName}
            onChange={(value) => updateField("fullName", value)}
            error={errors.fullName}
          />
          <Field
            id="email"
            label="Email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(value) => updateField("email", value)}
            error={errors.email}
          />
          <Field
            id="phone"
            label="Phone"
            placeholder="Enter your phone number"
            value={values.phone}
            onChange={(value) => updateField("phone", value)}
            error={errors.phone}
          />
          <Field
            id="gpa"
            label="GPA"
            placeholder="Enter GPA in 4.0 or 10.0 scale"
            value={values.gpa}
            onChange={(value) => updateField("gpa", value)}
            error={errors.gpa}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#1F2937]">Note (optional)</span>
            <textarea
              id="note"
              rows={4}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#9B1C1C] focus:ring-2 focus:ring-[#9B1C1C]/20"
              value={values.note}
              placeholder="Tell us your timeline and goals"
              onChange={(event) => updateField("note", event.target.value)}
            />
          </label>

          {state === "error" && feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97706] px-6 py-3 text-sm font-semibold text-white transition ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <>
                <span className="spinner h-4 w-4 rounded-full border-2 border-white border-r-transparent" />
                {data.loadingText}
              </>
            ) : (
              data.submitText
            )}
          </button>
        </form>
      )}
    </section>
  );
}

interface FieldProps {
  id: keyof LeadFormPayload;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function Field({ id, label, placeholder, value, onChange, error }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#1F2937]">{label}</span>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#9B1C1C]/20 ${
          error ? "border-red-500" : "border-gray-300 focus:border-[#9B1C1C]"
        }`}
      />
      {error ? (
        <span id={errorId} className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
