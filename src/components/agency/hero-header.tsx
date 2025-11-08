"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { BurgerMenu } from "./burger-menu";
import { FullScreenMenu } from "./full-screen-menu";
import gsap from "gsap";

interface SocialLink {
  label: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { label: "INSTAGRAM", href: "https://instagram.com" },
  { label: "LINKEDIN", href: "https://linkedin.com" },
  { label: "TWITTER", href: "https://twitter.com" },
  { label: "FACEBOOK", href: "https://facebook.com" },
];

export function HeroHeader() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        backgroundColor: "#E8E4DF",
        color: "#0E0E0E",
        duration: 0.7,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        backgroundColor: "#0E0E0E",
        color: "#E8E4DF",
        duration: 0.7,
        ease: "power2.out",
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col box-border overflow-hidden" style={{ backgroundColor: "#E8E4DF" }}>
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 right-0 w-full -mt-2 sm:-mt-3 md:-mt-4 px-2 sm:px-3 md:px-4 lg:px-6 box-border" style={{ zIndex: 200 }}>
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Image
              src="/mindak-logo.png"
              alt="Mindak Logo"
              width={120}
              height={120}
              className="object-contain"
              style={{
                width: "120px",
                height: "120px",
              }}
              priority
            />
          </div>
          
          {/* Burger Menu - Right */}
          <div className="flex-shrink-0">
            <BurgerMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center flex-col relative px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-16 box-border min-h-screen">
        <div className="flex flex-col justify-center items-center relative w-full max-w-[1200px]">
          {/* Main Title */}
          <h1 className="m-0 p-0 text-center relative w-full">
            <span 
              className="block font-black m-0 p-0"
              style={{
                fontSize: "clamp(60px, 15vw, 280px)",
                color: "#0E0E0E",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
                WebkitFontSmoothing: "antialiased",
                textRendering: "optimizeLegibility"
              }}
            >
              MINDAK
            </span>
          </h1>

          {/* Tagline */}
          <div className="mt-4 sm:mt-6 md:mt-8 relative text-center box-border px-4 sm:px-6 md:px-8">
            <p 
              className="m-0 max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-none mx-auto"
              style={{
                fontSize: "clamp(14px, 3.5vw, 19.1999px)",
                fontWeight: 400,
                color: "#0E0E0E",
                lineHeight: 1.5,
                WebkitFontSmoothing: "antialiased",
                fontKerning: "none",
                wordBreak: "break-word"
              }}
            >
              Nous sommes une agence web à Lyon avec un savoir-faire de précision. Pour créer
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              des sites et des designs, nous mobilisons l'audace et notre amour du détail qui tue.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10 md:mt-12 relative text-center">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(true)}
              className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg"
              style={{
                backgroundColor: "#0E0E0E",
                color: "#E8E4DF",
                fontSize: "clamp(14px, 3vw, 18px)",
                fontWeight: 700,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                border: "2px solid #0E0E0E",
                cursor: "pointer",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              Réserver
            </button>
          </div>
        </div>
      </section>

      {/* Social Links Footer */}
      <footer 
        className="absolute left-0 right-0 flex flex-col justify-end box-border bottom-8 md:bottom-12 lg:bottom-0"
        style={{
          padding: "0 clamp(20px, 4vw, 40.192px)",
        }}
      >
        <ul 
          className="flex justify-between overflow-hidden relative box-border list-none m-0 pt-5 md:pt-8 lg:pt-0"
        >
          {socialLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="relative cursor-pointer uppercase transition-opacity duration-200 hover:opacity-70 block"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0E0E0E",
                  fontSize: "clamp(12px, 2.5vw, 22.1056px)",
                  fontWeight: 700,
                  letterSpacing: "clamp(-0.6px, -0.15vw, -1.10528px)",
                  lineHeight: "clamp(16px, 3.5vw, 30.9479px)",
                  WebkitFontSmoothing: "antialiased",
                  fontKerning: "none",
                  transform: "matrix(1, 0, 0, 1, 0, 0)",
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>

      {/* Full Screen Menu */}
      <FullScreenMenu isOpen={isMenuOpen} />
    </div>
  );
}
