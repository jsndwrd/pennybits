"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function Navbar() {
  const links = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Landing Page", url: "/" },
  ];

  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SignedIn>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="flex h-full flex-col">
                  <SheetHeader className="border-b p-6">
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>Quick links</SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-1 flex-col gap-1 p-3">
                    {links.map((link) => {
                      const active = pathname === link.url;
                      return (
                        <Link
                          key={link.url}
                          href={link.url}
                          className={
                            active
                              ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
                              : "rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                    <div className="my-2 h-px bg-border" />
                    <Link
                      href="/user-profile"
                      className={
                        pathname.startsWith("/user-profile")
                          ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
                          : "rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                    >
                      Profile
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </SignedIn>
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Pennybits
          </Link>
        </div>

        <SignedIn>
          <UserButton userProfileMode="navigation" userProfileUrl="/user-profile" />
        </SignedIn>
      </div>
    </header>
  );
}

export default Navbar;
