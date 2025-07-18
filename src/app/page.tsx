import Link from "next/link";

import { AuroraText } from "@/components/magicui/aurora-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <>
      <DotPattern
        glow
        className={cn(
          "fixed inset-0 w-full h-full -z-10 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />

      {/* Header */}
      <header className="fixed left-0 top-0 z-50 border-b w-full backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-3xl font-black tracking-tight">JiraClone</span>
          <Link href="/auth/sign-up">
            <ShinyButton>Sign Up</ShinyButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-40 max-w-7xl mx-auto px-6">
        <AuroraText className="text-4xl md:text-6xl font-extrabold mb-4">
          Organize. Track. Collaborate.
        </AuroraText>
        <TextAnimate
          className="text-lg md:text-xl max-w-2xl mx-auto mb-6 font-medium"
          animation="blurIn"
          as="p"
        >
          JiraClone is your open-source solution for seamless task management,
          project tracking, and team collaboration. Built for productivity,
          designed for everyone.
        </TextAnimate>
        <Link href="/auth/sign-up">
          <ShimmerButton className="w-48 h-12 shadow-2xl mt-8 mb-16">
            <span className="whitespace-pre-wrap text-center font-medium text-sm leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Get Started
            </span>
          </ShimmerButton>
        </Link>
        <div className="relative rounded-xl max-w-7xl border border-muted overflow-hidden">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          {/* TODO: Add a screenshot of the app */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://startup-template-sage.vercel.app/hero-dark.png"
            alt="JiraClone Board Screenshot"
          />
        </div>
      </section>

      {/* TODO: add features section */}

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 py-8 mt-12 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-zinc-400">
            © {new Date().getFullYear()} JiraClone built by{" "}
            <a
              target="_blank"
              href="http://mrghasemi1992.ir"
              className="text-white"
            >
              Mohammad Reza Ghasemi
            </a>
          </span>
          <div className="flex gap-4">
            <a
              href="https://github.com/luckydevboy/jira-clone"
              target="_blank"
              className="text-zinc-400 hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
