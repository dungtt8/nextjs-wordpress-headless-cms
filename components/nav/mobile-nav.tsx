"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Utility Imports
import { ArrowSquareRight, List } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Component Imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";

// Prefixes an internal path with the current locale so nav clicks don't fall through
// to the "/" root, which 307-redirects based on Accept-Language instead of staying put.
function localizeHref(href: string, locale?: string): string {
  if (!locale) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

export function MobileNav({ locale }: { locale?: string }) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <List weight="thin" />
          <span className="sr-only">{t("common.toggleMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="text-left">
            <MobileLink
              href={localizeHref("/", locale)}
              className="flex items-center"
              onOpenChange={setOpen}
            >
              <ArrowSquareRight weight="thin" className="mr-2 h-4 w-4" />
              <span>{siteConfig.site_name}</span>
            </MobileLink>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-small mt-6">{t("common.menu")}</h3>
            <Separator />
            {Object.entries(mainMenu).map(([key, href]) => (
              <MobileLink key={key} href={localizeHref(href, locale)} onOpenChange={setOpen}>
                {t(`nav.${key}`)}
              </MobileLink>
            ))}
            <h3 className="text-small pt-6">{t("common.blogMenu")}</h3>
            <Separator />
            {Object.entries(contentMenu).map(([key, href]) => (
              <MobileLink key={key} href={localizeHref(href, locale)} onOpenChange={setOpen}>
                {t(`nav.${key}`)}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
