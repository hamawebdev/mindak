"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { getPodcastFormQuestions, submitPodcastReservation } from "@/lib/api/podcast-forms";
import type { Question, QuestionAnswer } from "@/types/api";

export function PodcastFormQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<number, string[]>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const totalSteps = questions.length;
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  
  const currentQuestion = questions[currentStep - 1];
  const answer = answers[currentStep] || "";
  
  // Refs for animation targets
  const questionContainerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const hasAnimatedInRef = useRef<boolean>(false);
  const logoRef = useRef<HTMLImageElement>(null);

  // Helper function to get full image URL
  // Images are served through Next.js rewrites, so we can use relative paths
  const getImageUrl = (imagePath: string | undefined): string | null => {
    if (!imagePath) return null;
    return imagePath; // Next.js will rewrite /uploads/* to the backend
  };

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getPodcastFormQuestions();
        
        // Sort by order field
        const sortedQuestions = [...data].sort((a, b) => a.order - b.order);
        setQuestions(sortedQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err instanceof Error ? err.message : "Failed to load form questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Animate logo when loading
  useEffect(() => {
    if (loading && logoRef.current) {
      const logo = logoRef.current;
      
      // Set initial state
      gsap.set(logo, { 
        opacity: 0, 
        scale: 0.8,
        y: 0
      });
      
      // Create looping animation timeline
      const tl = gsap.timeline({ repeat: -1 });
      
      // Fade in and scale up
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      // Gentle float up and down
      .to(logo, {
        y: -15,
        duration: 1.5,
        ease: "sine.inOut"
      })
      .to(logo, {
        y: 0,
        duration: 1.5,
        ease: "sine.inOut"
      });
      
      return () => {
        tl.kill();
      };
    }
  }, [loading]);

  const handleNext = async () => {
    // Validate email if current question is email type
    if (currentQuestion?.question_type === 'email' && answer.trim()) {
      if (!validateEmail(answer.trim())) {
        setEmailError('Please enter a valid email address');
        return;
      }
    }
    
    // If we're on the last step, submit the form
    if (currentStep === totalSteps) {
      await handleSubmit();
      return;
    }
    
    if (currentStep < totalSteps && !isAnimating) {
      setIsAnimating(true);
      
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          setIsAnimating(false);
        }
      });
      
      const elementsToAnimate = [labelRef.current, inputRef.current].filter(Boolean);
      tl.to(elementsToAnimate, {
        y: "-100px",
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.05
      });
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Format answers according to API specification
      const formattedAnswers = questions.map((question, index) => {
        const stepNumber = index + 1;
        const answerValue = answers[stepNumber] || "";
        
        // For checkbox/radio/select questions, try to find the answerId
        let answerId: string | null = null;
        if (["checkbox", "radio", "select"].includes(question.question_type)) {
          const selectedIds = selectedCheckboxes[stepNumber];
          if (selectedIds && selectedIds.length > 0) {
            // For checkbox with multiple selections, use the first one
            // The value field already contains concatenated text
            answerId = selectedIds[0];
          }
        }
        
        return {
          questionId: question.id,
          value: answerValue,
          answerId: answerId,
        };
      }).filter(answer => answer.value.trim() !== ""); // Only include answered questions
      
      // Submit the reservation
      const response = await submitPodcastReservation({
        answers: formattedAnswers,
      });
      
      // Success!
      setConfirmationId(response.confirmationId);
      setSubmitSuccess(true);
      
    } catch (err) {
      console.error("Error submitting podcast reservation:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit reservation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1 && !isAnimating) {
      setIsAnimating(true);
      
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentStep(currentStep - 1);
          setIsAnimating(false);
        }
      });
      
      const elementsToAnimate = [labelRef.current, inputRef.current].filter(Boolean);
      tl.to(elementsToAnimate, {
        y: "-100px",
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
    
    // Clear email error when user types
    if (currentQuestion?.question_type === 'email' && emailError) {
      setEmailError(null);
    }
  };

  // Email validation helper
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckboxToggle = (answerId: string, answerText: string) => {
    setSelectedCheckboxes(prev => {
      const current = prev[currentStep] || [];
      const newSelection = current.includes(answerId)
        ? current.filter(id => id !== answerId)
        : [...current, answerId];
      
      // Update answers with concatenated text
      const selectedTexts = newSelection
        .map(id => currentQuestion.answers.find(a => a.id === id)?.answer_text)
        .filter(Boolean);
      
      setAnswers({
        ...answers,
        [currentStep]: selectedTexts.join(", "),
      });
      
      return {
        ...prev,
        [currentStep]: newSelection
      };
    });
  };

  const handleRadioChange = (answerId: string, answerText: string) => {
    setAnswers({
      ...answers,
      [currentStep]: answerText,
    });
  };

  const handleSelectChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentStep]: value,
    });
  };
  
  // Animate in new question when step changes
  useEffect(() => {
    if (questionContainerRef.current && !loading) {
      const elementsToAnimate = [labelRef.current, inputRef.current].filter(Boolean);
      
      gsap.set(elementsToAnimate, {
        y: "100px",
        opacity: 0
      });
      
      gsap.to(elementsToAnimate, {
        y: "0px",
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1
      });
      
      // Reset the animation flag when step changes
      hasAnimatedInRef.current = false;
      
      // Clear email error when navigating to a new step
      setEmailError(null);
    }
  }, [currentStep, loading]);

  // Animate Next button visibility
  useEffect(() => {
    // For date inputs, check if answer exists (not just trimmed length)
    // Date values like "2000-12-05" are valid even without trimming
    const hasContent = currentQuestion?.question_type === 'date' 
      ? answer.length > 0 
      : answer.trim().length > 0;
    
    if (nextButtonRef.current) {
      if (hasContent && !hasAnimatedInRef.current) {
        // Only animate in once when first becoming visible
        gsap.fromTo(
          nextButtonRef.current,
          {
            opacity: 0,
            y: "20px",
          },
          {
            opacity: 1,
            y: "0px",
            duration: 0.4,
            ease: "power2.out",
          }
        );
        hasAnimatedInRef.current = true;
      } else if (!hasContent && hasAnimatedInRef.current) {
        // Animate out when content is removed
        gsap.to(nextButtonRef.current, {
          opacity: 0,
          y: "20px",
          duration: 0.3,
          ease: "power2.in",
        });
        hasAnimatedInRef.current = false;
      }
    }
  }, [answer, currentQuestion]);

  const renderInputField = () => {
    if (!currentQuestion) return null;

    const { question_type, answers: questionAnswers, placeholder } = currentQuestion;

    switch (question_type) {
      case "checkbox":
        // Check if any answer has an image
        const hasImages = questionAnswers.some(ans => ans.answer_metadata?.image);
        
        return (
          <div 
            ref={inputRef} 
            className="relative w-full overflow-y-auto"
            style={{
              maxHeight: "calc(100vh - 400px)",
              minHeight: "200px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
              }
            `}</style>
            <div 
              className="grid"
              style={{
                gap: hasImages ? "clamp(16px, 2vw, 24px)" : "clamp(8px, 1.5vw, 9.6px)",
                gridTemplateColumns: hasImages 
                  ? "repeat(2, 1fr)" 
                  : "repeat(auto-fit, minmax(clamp(140px, 20vw, 209.663px), 1fr))",
                gridAutoRows: hasImages 
                  ? "clamp(180px, 25vw, 280px)" 
                  : "clamp(100px, 18vw, 140.788px)",
                justifyContent: "center",
                alignContent: "center",
                maxWidth: hasImages ? "900px" : "1300px",
                margin: "0 auto",
                padding: "0 clamp(8px, 2vw, 16px)",
                paddingBottom: "clamp(16px, 3vw, 24px)",
              }}
            >
              {questionAnswers.map((ans) => {
                const isSelected = (selectedCheckboxes[currentStep] || []).includes(ans.id);
                return (
                  <label
                    key={ans.id}
                    className="relative cursor-pointer group"
                    style={{
                      borderRadius: "16px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxToggle(ans.id, ans.answer_text)}
                      className="absolute opacity-0 w-0 h-0"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                    <div
                      className={hasImages 
                        ? "h-full flex flex-col text-center relative overflow-hidden"
                        : "h-full flex flex-col items-center justify-center text-center px-4 relative"
                      }
                      style={{
                        borderRadius: "clamp(12px, 2vw, 16px)",
                        border: isSelected 
                          ? "2.5px solid var(--primary)" 
                          : "1.5px solid rgba(255, 255, 255, 0.15)",
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        color: "#FFFFFF",
                        fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                        fontSize: hasImages ? "clamp(11px, 1.2vw, 13px)" : "clamp(14px, 2vw, 18px)",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        transition: "all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)",
                        whiteSpace: "pre-line",
                        lineHeight: "1.2",
                        padding: hasImages ? "0" : "clamp(8px, 2vw, 16px)",
                        gap: hasImages ? "0" : "clamp(8px, 1.5vw, 12px)",
                      }}
                    >
                      {ans.answer_metadata?.image && (
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "clamp(16px, 3vw, 24px)",
                            paddingBottom: "clamp(8px, 1.5vw, 12px)",
                          }}
                        >
                          <img
                            src={getImageUrl(ans.answer_metadata.image) || ""}
                            alt={ans.answer_text}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}
                      {hasImages ? (
                        <div
                          style={{
                            padding: "clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px)",
                            color: "#FFFFFF",
                            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                            fontSize: "clamp(11px, 1.2vw, 13px)",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            lineHeight: "1.2",
                          }}
                        >
                          {ans.answer_text}
                        </div>
                      ) : (
                        ans.answer_text
                      )}
                      {isSelected && (
                        <div
                          className="absolute"
                          style={{
                            top: "clamp(8px, 1.5vw, 12px)",
                            right: "clamp(8px, 1.5vw, 12px)",
                            width: "clamp(24px, 4vw, 32px)",
                            height: "clamp(24px, 4vw, 32px)",
                            borderRadius: "50%",
                            backgroundColor: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="clamp(12, 2.5vw, 16)"
                            height="clamp(12, 2.5vw, 16)"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              width: "clamp(12px, 2.5vw, 16px)",
                              height: "clamp(12px, 2.5vw, 16px)",
                            }}
                          >
                            <path
                              d="M3 8L6.5 11.5L13 5"
                              stroke="var(--primary)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "radio":
        return (
          <div ref={inputRef} className="relative w-full max-w-[600px]">
            <div className="flex flex-col gap-3">
              {questionAnswers.map((ans) => (
                <label
                  key={ans.id}
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border transition-all"
                  style={{
                    border: answer === ans.answer_text
                      ? "2px solid var(--primary)"
                      : "1px solid rgba(255, 255, 255, 0.15)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#FFFFFF",
                    fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                  }}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={answer === ans.answer_text}
                    onChange={() => handleRadioChange(ans.id, ans.answer_text)}
                    className="w-5 h-5"
                  />
                  {ans.answer_metadata?.image && (
                    <img
                      src={getImageUrl(ans.answer_metadata.image) || ""}
                      alt={ans.answer_text}
                      loading="lazy"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  <span>{ans.answer_text}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "select":
        return (
          <div ref={inputRef} className="relative w-full max-w-[600px]">
            <select
              value={answer}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="w-full bg-transparent outline-none"
              style={{
                border: "0.8px solid hsl(60, 1%, 28%)",
                padding: "clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px)",
                color: "hsl(60, 14%, 95%)",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 400,
                lineHeight: "1.2",
                borderRadius: "8px",
              }}
            >
              <option value="" disabled>
                {placeholder || "Select an option"}
              </option>
              {questionAnswers.map((ans) => (
                <option key={ans.id} value={ans.answer_text} style={{ color: "#000" }}>
                  {ans.answer_text}
                </option>
              ))}
            </select>
          </div>
        );

      case "textarea":
        return (
          <div ref={inputRef} className="relative w-full max-w-[600px]">
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && answer.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={placeholder || "Type your answer here"}
              className="w-full bg-transparent outline-none resize-none"
              rows={4}
              style={{
                border: "0.8px solid hsl(60, 1%, 28%)",
                padding: "clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px)",
                color: "hsl(60, 14%, 95%)",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 400,
                lineHeight: "1.4",
                borderRadius: "8px",
                scrollbarWidth: "none",
              }}
              onFocus={(e) => {
                e.target.style.border = "0.8px solid hsl(60, 14%, 95%)";
              }}
              onBlur={(e) => {
                e.target.style.border = "0.8px solid hsl(60, 1%, 28%)";
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
        );

      case "email":
      case "phone":
      case "url":
      case "number":
      case "date":
        return (
          <div ref={inputRef} className="relative w-full max-w-[600px]">
            <input
              type={question_type}
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && answer.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={placeholder || "Type your answer here"}
              className="w-full bg-transparent outline-none"
              style={{
                borderBottom: emailError && question_type === 'email'
                  ? "0.8px solid #ff6b6b"
                  : "0.8px solid hsl(60, 1%, 28%)",
                padding: "0px clamp(12px, 3vw, 24px)",
                paddingBottom: "2px",
                color: "hsl(60, 14%, 95%)",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 400,
                lineHeight: "1.2",
                textAlign: "center",
                transition: "border 0.25s ease-in",
              }}
              onFocus={(e) => {
                e.target.style.borderBottom = emailError && question_type === 'email'
                  ? "0.8px solid #ff6b6b"
                  : "0.8px solid hsl(60, 14%, 95%)";
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = emailError && question_type === 'email'
                  ? "0.8px solid #ff6b6b"
                  : "0.8px solid hsl(60, 1%, 28%)";
                // Validate email on blur
                if (question_type === 'email' && answer.trim() && !validateEmail(answer.trim())) {
                  setEmailError('Please enter a valid email address');
                }
              }}
            />
            {emailError && question_type === 'email' && (
              <div
                style={{
                  color: "#ff6b6b",
                  fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                  fontSize: "clamp(12px, 2vw, 14px)",
                  fontWeight: 500,
                  textAlign: "center",
                  marginTop: "8px",
                  animation: "fadeIn 0.3s ease-in",
                }}
              >
                {emailError}
              </div>
            )}
            <style jsx>{`
              input::placeholder {
                color: hsl(60, 1%, 28%);
                opacity: 1;
              }
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(-4px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        );

      case "text":
      default:
        return (
          <div ref={inputRef} className="relative w-full max-w-[600px]">
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && answer.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={placeholder || "Type your answer here"}
              className="w-full bg-transparent outline-none resize-none"
              style={{
                borderBottom: "0.8px solid hsl(60, 1%, 28%)",
                padding: "0px clamp(12px, 3vw, 24px)",
                paddingBottom: "2px",
                maxHeight: "300px",
                color: "hsl(60, 14%, 95%)",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 400,
                lineHeight: "1.2",
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
        );
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <img
          ref={logoRef}
          src="/mindaklogowhite.png"
          alt="Mindak Logo"
          style={{
            width: "clamp(120px, 20vw, 200px)",
            height: "auto",
            objectFit: "contain"
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <div style={{ color: "#ff6b6b", fontSize: "24px" }}>{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <div style={{ color: "hsl(60, 14%, 95%)", fontSize: "24px" }}>No questions available</div>
      </div>
    );
  }

  // Success screen
  if (submitSuccess && confirmationId) {
    return (
      <div 
        className="relative min-h-screen flex flex-col items-center justify-center gap-8"
        style={{
          backgroundColor: "#000000",
          padding: "clamp(24px, 5vw, 48px)",
        }}
      >
        <h1 
          className="text-center uppercase"
          style={{
            color: "#FFFFFF",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "clamp(20px, 5vw, 64px)",
            fontWeight: 800,
            letterSpacing: "0.02em",
            lineHeight: "1.2",
            maxWidth: "95vw",
            wordBreak: "keep-all" as const,
            whiteSpace: "nowrap" as const,
          }}
        >
          THANK YOU FOR YOUR TIME
          <br />
          WE WILL GET TO YOU SHORTLY
        </h1>
        <Link
          href="/"
          className="uppercase bg-primary text-primary-foreground hover:opacity-90"
          style={{
            display: "inline-block",
            padding: "clamp(14px, 2.5vw, 18px) clamp(40px, 8vw, 80px)",
            borderRadius: "var(--radius)",
            fontSize: "clamp(14px, 2vw, 18px)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textDecoration: "none",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            transition: "opacity 0.2s ease",
          }}
        >
          RETURN TO MAIN
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen flex flex-col box-border"
      style={{
        backgroundColor: "#000000",
        padding: "clamp(12px, 3vw, 19.2px)",
      }}
    >
      {/* Header */}
      <header 
        className="flex items-start justify-between relative box-border"
        style={{
          padding: "clamp(12px, 3vw, 19.2px) clamp(12px, 3vw, 19.2px) 0px",
        }}
      >
        {/* Back Link */}
        <Link 
          href="/"
          className="flex items-center gap-[4.8px] cursor-pointer"
          style={{
            color: "hsl(60, 14%, 95%)",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "clamp(14px, 2.5vw, 19.2px)",
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "1.2",
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

        {/* Podcast Form Label */}
        <div
          style={{
            color: "hsl(60, 15%, 95%)",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "clamp(14px, 2.5vw, 19.2px)",
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "1.2",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          PODCAST
        </div>
      </header>

      {/* Main Form Content */}
      <main 
        className="flex-1 flex items-center justify-center flex-col relative"
        style={{
          padding: "clamp(24px, 5vw, 48px) clamp(12px, 3vw, 19.2px)",
        }}
      >
        <div 
          ref={questionContainerRef}
          className="flex flex-col items-center justify-center relative w-full"
          style={{
            gap: "clamp(32px, 6vw, 48px)",
          }}
        >
          {/* Question Text */}
          <label
            ref={labelRef}
            htmlFor="field-1"
            style={{
              color: "hsl(60, 14%, 95%)",
              fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
              fontSize: "clamp(20px, 4vw, 38.4px)",
              fontWeight: 800,
              letterSpacing: "clamp(0.5px, 0.15vw, 1.6px)",
              lineHeight: "1.2",
              textAlign: "center",
              textTransform: "uppercase",
              WebkitFontSmoothing: "antialiased",
              cursor: "default",
              maxWidth: "100%",
              wordWrap: "break-word",
              padding: "0 clamp(12px, 3vw, 24px)",
            }}
          >
            {currentQuestion.question_text}
          </label>

          {/* Dynamic Input Field */}
          {renderInputField()}

          {/* Error Message */}
          {submitError && (
            <div
              style={{
                color: "#ff6b6b",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                fontSize: "clamp(14px, 2vw, 16px)",
                fontWeight: 500,
                textAlign: "center",
                padding: "clamp(12px, 2vw, 16px)",
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                borderRadius: "8px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {submitError}
            </div>
          )}

          {/* Next/Submit Button */}
          {(currentQuestion?.question_type === 'date' ? answer : answer.trim()) && (
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              disabled={isAnimating || isSubmitting}
              className="absolute bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                bottom: "clamp(-80px, -15vw, -120px)",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "clamp(12px, 2vw, 16px) clamp(32px, 6vw, 48px)",
                border: "none",
                cursor: "pointer",
                fontSize: "clamp(16px, 2.5vw, 19.2px)",
                fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
                opacity: 0,
                whiteSpace: "nowrap",
              }}
            >
              {isSubmitting ? "Submitting..." : currentStep < totalSteps ? "Next" : "Submit"}
            </button>
          )}
        </div>
      </main>

      {/* Progress Footer */}
      <footer 
        className="relative flex items-center justify-between flex-wrap gap-4"
        style={{
          padding: "0 clamp(12px, 3vw, 19.2px) 0",
        }}
      >
        {/* Left side - Progress Text */}
        <div
          style={{
            color: "hsl(60, 14%, 95%)",
            fontFamily: '"Helvetica Now", "Helvetica Neue", sans-serif',
            fontSize: "clamp(16px, 2.5vw, 19.2px)",
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "1.2",
            marginBottom: "clamp(12px, 3vw, 19.2px)",
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
              fontSize: "clamp(12px, 2vw, 16px)",
              fontWeight: 500,
              letterSpacing: "0.5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              marginBottom: "clamp(12px, 3vw, 19.2px)",
            }}
          >
            PREVIOUS QUESTION
          </button>
        )}

      </footer>

      {/* Progress Bar */}
      <div 
        className="absolute bottom-0 bg-muted"
        style={{
          height: "clamp(3px, 0.5vw, 4px)",
          marginBottom: "0",
          left: "clamp(12px, 3vw, 19.2px)",
          right: "clamp(12px, 3vw, 19.2px)",
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
