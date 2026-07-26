"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Leaf,
  Users,
  ShieldCheck,
  Heart,
  ArrowRight,
} from "lucide-react";
import { ScrollAnimate } from "@/components/scroll-animate";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, {
    once: true,
    margin: "-100px",
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, 5044, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });

    return () => controls.stop();
  }, [isInView]);

  return (
    <div className="bg-background min-h-screen">

      {/* HEADER */}
      <section className="pt-24 pb-12 text-center">
        <ScrollAnimate delay={100}>
          <div className="container mx-auto px-6 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-6">
              About US
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-text-secondary mb-10">
              Our Story
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />
          </div>
        </ScrollAnimate>
      </section>

      {/* STORY TEXT */}
      <section className="pb-16">
        <ScrollAnimate delay={200}>
          <div className="container mx-auto px-6 max-w-4xl text-center space-y-8 text-lg text-text-secondary leading-relaxed">

            <p>
              Our story comes from the soil, the sun, and the slow rhythm of village life in <strong className="text-text-primary">Dhampur, Bijnor, Uttar Pradesh.</strong>
            </p>

            <p>
              Three years ago, <strong className="text-text-primary">Mudassir</strong> chose to walk away from a well-paid job and fast city life. He came back home with a simple thought in his heart: <em className="italic font-medium">the taste he grew up with should not disappear.</em> The taste of pickles made patiently, naturally, and with care.
            </p>

            <p>
              In our homes, pickle-making was never rushed. Recipes were passed down through generations, taught by elders, perfected by time. Inspired by those <strong className="text-text-primary">old-age traditional recipes</strong>, we spent almost a year in research and development, testing, tasting, and refining — without using any shortcuts.
            </p>

            <div className="py-6">
              <p className="text-xl text-text-primary font-semibold">
                Today, our pickles are truly <span className="font-extrabold">100% Natural</span> —
              </p>
              <p className="text-text-primary font-bold mt-2">
                No Chemicals | No Preservatives | No Additives.
              </p>
            </div>

            <p>
              What makes our process special is the people behind it. Our pickles are lovingly prepared by a team of <strong className="text-text-primary">30 skilled village women and men</strong>, following traditional methods under <strong className="text-text-primary">strict hygiene standards.</strong> Clean hands, clean spaces, and honest work are at the heart of everything we do.
            </p>

            <p>
              We follow a <strong className="text-text-primary">long and patient process</strong>. One batch of pickles takes <strong className="text-text-primary">around 20 days</strong> to prepare. Ingredients are mixed by hand and <strong className="text-text-primary">slowly dried under the natural sunlight</strong>, just like it has been done for generations. No machines rushing the process — only time, sunlight, and care.
            </p>

            <p>
              We use <strong className="text-text-primary">100% organic ingredients</strong>, carefully sourced directly from local farmers we trust. This not only ensures freshness and purity but also supports farming families in and around our villages.
            </p>

            <p>
              For the past <strong className="text-text-primary">three years</strong>, we have been proudly serving tradition to your table — bringing you pickles that taste like home, memories, and childhood.
            </p>

            <div className="py-8 text-xl font-medium text-text-primary">
              <p>This is not just a business for us.</p>
              <p className="mt-2">It is our way of honoring tradition, empowering rural hands, and sharing food made with love, patience, and honesty.</p>
              <p className="mt-8 text-base text-text-secondary">From our village to your home — thank you for trusting us.</p>
            </div>

          </div>
        </ScrollAnimate>
      </section>

      {/* VALUES LIST */}
      <section className="py-16">
        <ScrollAnimate delay={400}>
          <div className="container mx-auto px-6 max-w-4xl border-y border-border py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Leaf className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <span className="font-semibold text-text-primary">100% Natural</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <Heart className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <span className="font-semibold text-text-primary">Homemade Recipes</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <Users className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <span className="font-semibold text-text-primary">Women Empowerment</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <span className="font-semibold text-text-primary">No Preservatives</span>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* COUNTER & CTA */}
      <section ref={counterRef} className="py-24 text-center">
        <ScrollAnimate delay={500}>
          <div className="container mx-auto px-6">
            <h3 className="text-6xl md:text-7xl font-bold text-text-primary tracking-tight">
              {count.toLocaleString()}
            </h3>
            <p className="mt-4 text-xl text-text-secondary font-medium">
              Loved by 5,000+ Customers
            </p>

            <div className="mt-12">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="px-10 rounded-full text-base tracking-wide">
                  VISIT STORE
                </Button>
              </Link>
            </div>
          </div>
        </ScrollAnimate>
      </section>

    </div>
  );
}
