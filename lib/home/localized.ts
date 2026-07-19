import type { LocalizedString } from "@/lib/home/types";

export function extractLocalized(value: LocalizedString | string, locale: string): string {
    if (typeof value === "string") return value;
    return value[locale as keyof LocalizedString] || value.en || "";
}
