import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Clock, Calendar, Sparkles, MapPin, Utensils, Camera, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ValentinePage = () => {
  const [step, setStep] = useState("landing"); // landing, proposal, forms, final
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [noButtonOpacity, setNoButtonOpacity] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);
  const [returnTime, setReturnTime] = useState("");
  const noButtonRef = useRef(null);
  const surpriseRef = useRef(null);

  // Countdown to 14.02.2026 at 12:00
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-02-14T12:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSurpriseClick = () => {
    setStep("proposal");
  };

  const handleYesClick = () => {
    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#ffe4e6", "#fbbf24", "#881337", "#ff1744"],
      });
    }, 30);

    setTimeout(() => {
      setStep("forms");
    }, 2000);
  };

  const handleNoHover = () => {
    setAttemptCount((prev) => prev + 1);

    // Move the button to a random position
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;

    setNoButtonPos({ x: newX, y: newY });

    // Shrink the button progressively
    const newScale = Math.max(0.1, 1 - attemptCount * 0.15);
    const newOpacity = Math.max(0, 1 - attemptCount * 0.15);

    setNoButtonScale(newScale);
    setNoButtonOpacity(newOpacity);
  };

  const handleFormSubmit = () => {
    if (returnTime) {
      setStep("final");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1567137841661-994105d2b081?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxyZWQlMjB2ZWx2ZXQlMjBmYWJyaWMlMjB0ZXh0dXJlJTIwZGFya3xlbnwwfHx8fDE3NzA5NzUxNDV8MA&ixlib=rb-4.1.0&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300/20"
            style={
              {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }
          }
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Heart size={20 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center"
              >
                <h1
                  className="text-6xl md:text-8xl font-bold mb-8 text-rose-100"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                  data-testid="landing-title"
                >
                  Swann...
                </h1>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-12"
                >
                  <Sparkles className="w-16 h-16 mx-auto text-amber-300" />
                </motion.div>

                <Button
                  onClick={handleSurpriseClick}
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl transition-all hover:scale-105"
                  data-testid="surprise-button"
                >
                  Voir la surprise
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === "proposal" && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-4"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-2xl backdrop-blur-md bg-rose-950/30 p-12 rounded-3xl border border-rose-400/30 shadow-2xl"
              >
                <Heart className="w-24 h-24 mx-auto mb-8 text-rose-300" />

                <h2
                  className="text-5xl md:text-6xl font-bold mb-12 text-rose-100"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                  data-testid="proposal-question"
                >
                  Veux-tu être ma valentine ?
                </h2>

                <div className="flex gap-6 justify-center items-center">
                  <Button
                    onClick={handleYesClick}
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700 text-white px-16 py-6 text-2xl rounded-full shadow-xl transition-all hover:scale-110"
                    data-testid="yes-button"
                  >
                    Oui ! ❤️
                  </Button>

                  <motion.div
                    ref={noButtonRef}
                    style={{
                      x: noButtonPos.x,
                      y: noButtonPos.y,
                      scale: noButtonScale,
                      opacity: noButtonOpacity,
                    }}
                    onHoverStart={handleNoHover}
                    className="relative"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-16 py-6 text-2xl rounded-full border-2 border-gray-500 cursor-pointer"
                      data-testid="no-button"
                    >
                      Non
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "forms" && (
            <motion.div
              key="forms"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
            >
              <div className="max-w-2xl w-full backdrop-blur-md bg-rose-950/40 p-8 md:p-12 rounded-3xl border border-rose-400/30 shadow-2xl">
                {/* Countdown */}
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="w-6 h-6 text-amber-400" />
                    <h3 className="text-2xl text-rose-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Temps restant pour valider
                    </h3>
                  </div>
                  <div className="flex justify-center gap-4 text-rose-100" data-testid="countdown">
                    <div className="text-center">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {timeLeft.days}
                      </div>
                      <div className="text-sm opacity-70">jours</div>
                    </div>
                    <div className="text-4xl font-bold">:</div>
                    <div className="text-center">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {timeLeft.hours}
                      </div>
                      <div className="text-sm opacity-70">heures</div>
                    </div>
                    <div className="text-4xl font-bold">:</div>
                    <div className="text-center">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {timeLeft.minutes}
                      </div>
                      <div className="text-sm opacity-70">min</div>
                    </div>
                    <div className="text-4xl font-bold">:</div>
                    <div className="text-center">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {timeLeft.seconds}
                      </div>
                      <div className="text-sm opacity-70">sec</div>
                    </div>
                  </div>
                </div>

                {/* Restaurant time */}
                <div className="mb-8 p-6 bg-rose-900/20 rounded-2xl border border-rose-400/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xl text-rose-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Heure du restaurant
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="time-19h"
                      checked={true}
                      disabled={true}
                      className="border-rose-400 data-[state=checked]:bg-rose-600"
                      data-testid="restaurant-time-checkbox"
                    />
                    <Label
                      htmlFor="time-19h"
                      className="text-lg text-rose-100 cursor-not-allowed"
                    >
                      19h00
                    </Label>
                  </div>
                  <p className="text-sm text-rose-300/70 mt-2 italic" data-testid="restaurant-note">
                    De toute façon t'as pas le choix j'ai déjà réservé le restau 😉
                  </p>
                </div>

                {/* Return time */}
                <div className="mb-8">
                  <h3 className="text-xl text-rose-100 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    À quelle heure souhaites-tu rentrer ?
                  </h3>
                  <RadioGroup value={returnTime} onValueChange={setReturnTime} data-testid="return-time-group">
                    <div className="space-y-3">
                      {[
                        { value: "22h", label: "22h00" },
                        { value: "23h", label: "23h00" },
                        { value: "00h", label: "00h00" },
                        { value: "01h", label: "01h00" },
                        { value: "nuit", label: "On reste ensemble toute la nuit ✨" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className="border-rose-400 text-rose-600"
                            data-testid={`return-time-${option.value}`}
                          />
                          <Label
                            htmlFor={option.value}
                            className="text-lg text-rose-100 cursor-pointer hover:text-rose-200 transition-colors"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleFormSubmit}
                  disabled={!returnTime}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 text-xl rounded-full shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="submit-button"
                >
                  Valider mon choix
                </Button>
              </div>
            </motion.div>
          )}

          {step === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-4"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-3xl backdrop-blur-md bg-rose-950/40 p-12 rounded-3xl border border-rose-400/30 shadow-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8"
                >
                  <Heart className="w-32 h-32 mx-auto text-rose-300" fill="currentColor" />
                </motion.div>

                <h2
                  className="text-5xl md:text-6xl font-bold mb-8 text-rose-100"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                  data-testid="final-title"
                >
                  C'est parfait ! ❤️
                </h2>

                <div className="space-y-6 text-rose-100">
                  <p className="text-2xl" style={{ fontFamily: "'Outfit', sans-serif" }} data-testid="final-time">
                    Je viendrai te chercher à <span className="text-amber-300 font-bold">19h00</span>
                  </p>

                  <div className="bg-rose-900/30 p-8 rounded-2xl border border-rose-400/20">
                    <p
                      className="text-xl leading-relaxed italic"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                      data-testid="final-message"
                    >
                      "Chaque moment passé avec toi est un cadeau précieux. J'ai hâte de célébrer cette
                      soirée spéciale à tes côtés et de créer des souvenirs inoubliables ensemble. Tu
                      illumines ma vie comme personne d'autre ne pourrait le faire. ❤️"
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl"
                  >
                    💕
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ValentinePage;