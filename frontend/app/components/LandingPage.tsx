
"use client";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function LandingPage() {
  return (
    <div className="relative flex h-lvh items-center justify-center overflow-hidden p-4">
      <div className="from-primary/10 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b" />

      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="mx-auto mt-10 max-w-3xl">
          <CardContent className="space-y-6 p-8 text-center sm:p-10">
            <m.h1
              className="text-4xl font-bold tracking-tight text-balance sm:text-6xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            >
              Manage your <span className="text-primary">finances</span> with
              clarity.
            </m.h1>
            <m.p
              className="text-muted-foreground mx-auto max-w-2xl text-sm text-pretty sm:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            >
              Track transactions, spot spending patterns, and keep a clean view
              of your cashflow - without spreadsheets.
            </m.p>

            <m.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              <SignUpButton>
                <Button className="gap-2">
                  Get started <ArrowUpRight className="size-4" />
                </Button>
              </SignUpButton>
            </m.div>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}

export default LandingPage;
