"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function BackButton() {
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <Button variant="outline" size="sm" onClick={() => router.back()}>
      {t("back")}
    </Button>
  );
}
