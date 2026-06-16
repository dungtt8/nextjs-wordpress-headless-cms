import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  return (
    <nav className={cn("sticky top-0 z-50 px-4 pt-4", className)} id={id}>
      <div
        id="nav-container"
        className="poster-card max-w-6xl mx-auto flex items-center justify-between rounded-full px-5 py-3 sm:px-7"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            className="dark:invert h-[26.44px] w-auto"
            width={42}
            height={26.44}
          />
          <h2 className="font-display text-lg leading-none tracking-tight text-[#2a2355]">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild className="hidden sm:flex rounded-full bg-[#6e59b1] px-5 hover:bg-[#5f4b9f]">
            <Link href="/#lead-form">Get Started</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
