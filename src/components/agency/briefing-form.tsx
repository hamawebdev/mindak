"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const questions = [
  {
    id: 1,
    question: "HELLO! WE ARE RADIANCE TEAM. WOULD YOU LIKE INTRODUCE YOURSELF?",
  },
  {
    id: 2,
    question: "SPECIFY A CONVENIENT WAY TO GET IN TOUCH.",
  },
  {
    id: 3,
    question: "WHAT IS YOUR PROJECT ABOUT?",
  },
];

export function BriefingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSteps = questions.length;
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  const currentQuestion = questions[currentStep - 1];
  const answer = answers[currentStep] || "";
  
  // Refs for animation targets
  const questionContainerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const handleNext = () => {
    if (currentStep < totalSteps && !isAnimating) {
      setIsAnimating(true);
      
      // Create timeline for smooth transition
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          setIsAnimating(false);
        }
      });
      
      // Animate current question out (upward)
      tl.to([labelRef.current, inputRef.current, buttonRef.current], {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.05
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1 && !isAnimating) {
      setIsAnimating(true);
      
      // Create timeline for smooth transition
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentStep(currentStep - 1);
          setIsAnimating(false);
        }
      });
      
      // Animate current question out (upward)
      tl.to([labelRef.current, inputRef.current, buttonRef.current], {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.05
      });
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentStep]: value,
    });
  };
  
  // Animate in new question when step changes
  useEffect(() => {
    if (questionContainerRef.current) {
      // Set initial state (from bottom, invisible)
      gsap.set([labelRef.current, inputRef.current, buttonRef.current], {
        y: 100,
        opacity: 0
      });
      
      // Animate in from bottom
      gsap.to([labelRef.current, inputRef.current, buttonRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1
      });
    }
  }, [currentStep]);

  // Animate Next button visibility
  useEffect(() => {
    const hasContent = answer.trim().length > 0;
    
    if (nextButtonRef.current) {
      if (hasContent) {
        // Fade in and slide up when answer is provided
        gsap.fromTo(
          nextButtonRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      } else {
        // Fade out and slide down when answer is cleared
        gsap.to(nextButtonRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [answer.trim().length > 0]);

  return (
    <div 
      className="relative min-h-screen flex flex-col box-border"
      style={{
        backgroundColor: "#000000",
        padding: "19.2px",
      }}
    >
      {/* Header */}
      <header 
        className="flex items-start justify-between relative box-border"
        style={{
          padding: "19.2px 19.2px 0px",
        }}
      >
        {/* Back Link */}
        <Link 
          href="/"
          className="flex items-center gap-[4.8px] cursor-pointer"
          style={{
            color: "hsl(60, 14%, 95%)",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "19.2px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "19.2px",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            style={{
              display: "inline",
              overflow: "hidden",
            }}
          >
            <path 
              d="M10 4L6 8L10 12" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden md:inline">BACK TO THE MAIN SITE</span>
          <span className="md:hidden">BACK</span>
        </Link>

        {/* Briefing Label */}
        <div
          style={{
            color: "hsl(60, 15%, 95%)",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "19.2px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "19.2px",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          BRIEFING
        </div>
      </header>

      {/* Main Form Content */}
      <main 
        className="flex-1 flex items-center justify-center flex-col relative"
        style={{
          padding: "19.2px",
        }}
      >
        <div 
          ref={questionContainerRef}
          className="flex flex-col items-center justify-center relative"
          style={{
            gap: "48px",
          }}
        >
          {/* Hero Title */}
          <label
            ref={labelRef}
            htmlFor="field-1"
            style={{
              color: "hsl(60, 14%, 95%)",
              fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
              fontSize: "clamp(28px, 5vw, 38.4px)",
              fontWeight: 800,
              letterSpacing: "1.6px",
              lineHeight: "1.2",
              textAlign: "center",
              textTransform: "uppercase",
              WebkitFontSmoothing: "antialiased",
              cursor: "default",
              maxWidth: "100%",
              wordWrap: "break-word",
            }}
          >
            {currentQuestion.question}
          </label>

          {/* Input Field */}
          <div ref={inputRef} className="relative w-full max-w-[600px]">
            <textarea
              id="field-1"
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && answer.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder="Type your answer here"
              className="w-full bg-transparent outline-none resize-none"
              style={{
                borderBottom: "0.8px solid hsl(60, 1%, 28%)",
                padding: "0px",
                paddingBottom: "2px",
                maxHeight: "300px",
                color: "hsl(60, 14%, 95%)",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                fontSize: "24px",
                fontWeight: 400,
                lineHeight: "0.8",
                textAlign: "center",
                transition: "border 0.25s ease-in",
                scrollbarWidth: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderBottom = "0.8px solid hsl(60, 14%, 95%)";
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = "0.8px solid hsl(60, 1%, 28%)";
              }}
            />
            <style jsx>{`
              textarea::placeholder {
                color: hsl(60, 1%, 28%);
                opacity: 1;
              }
              textarea::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          {/* Next Button - Shows when user types */}
          {answer.trim() && (
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              disabled={isAnimating}
              className="absolute bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                bottom: "-120px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "16px 48px",
                border: "none",
                cursor: "pointer",
                fontSize: "19.2px",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                opacity: 0,
              }}
            >
              Next
            </button>
          )}
        </div>
      </main>

      {/* Progress Footer */}
      <footer 
        className="relative flex items-center justify-between"
        style={{
          padding: "0 19.2px 0",
        }}
      >
        {/* Left side - Progress Text */}
        <div
          style={{
            color: "hsl(60, 14%, 95%)",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "19.2px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "19.2px",
            marginBottom: "19.2px",
          }}
        >
       {currentStep}<span style={{ padding: '0 16px' }}> / </span>{totalSteps}
        </div>

        {/* Right side - Previous Question Button */}
        {currentStep > 1 && (
          <button
            onClick={handlePrevious}
            className="text-muted-foreground md:absolute md:left-1/2 md:transform md:-translate-x-1/2"
            style={{
              fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              marginBottom: "19.2px",
            }}
          >
            PREVIOUS QUESTION
          </button>
        )}

      </footer>

      {/* Progress Bar - Positioned at the very bottom of the container */}
      <div 
        className="absolute bottom-0 bg-muted"
        style={{
          height: "4px",
          marginBottom: "0",
          left: "19.2px",
          right: "19.2px",
          width: "auto",
        }}
      >
        <div
          className="absolute top-0 left-0 h-full transition-all duration-300 bg-primary"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
    </div>
  );
}
