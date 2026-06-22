"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const { t } = useI18n();

  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-6 py-16 text-center text-white shadow-lift">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">{t.cta.subtitle}</p>
            <Link href="/demo/teacher" className="mt-8 inline-block">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                {t.cta.button}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
