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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSurprise = () => {
    surpriseRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    // Keep the button at normal size and opacity (no shrinking)
    setNoButtonScale(1);
    setNoButtonOpacity(1);
  };

  const handleFormSubmit = () => {
    if (returnTime) {
      setStep("final");
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background with roses */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1550015296-7fd664acc768?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMHJvbWFudGljJTIwdmFsZW50aW5lfGVufDB8fHxyZWR8MTc3MDk3NTY0MXww&ixlib=rb-4.1.0&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
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
              className="min-h-screen"
            >
              {/* Hero Section */}
              <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <h1
                    className="text-6xl md:text-8xl font-bold mb-6 text-rose-100"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                    data-testid="hero-title"
                  >
                    Swann
                  </h1>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8"
                  >
                    <Heart className="w-20 h-20 mx-auto text-rose-300" fill="currentColor" />
                  </motion.div>
                  <p className="text-2xl md:text-3xl text-rose-100 mb-12 max-w-3xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Une soirée spéciale t'attend pour la Saint-Valentin
                  </p>
                  <Button
                    onClick={scrollToSurprise}
                    variant="outline"
                    className="bg-transparent border-2 border-rose-300 text-rose-100 hover:bg-rose-600/30 px-8 py-4 text-lg rounded-full"
                    data-testid="scroll-down-button"
                  >
                    Découvre la suite ↓
                  </Button>
                </motion.div>
              </section>

              {/* About Section */}
              <section className="min-h-screen flex items-center justify-center px-4 py-20">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="max-w-4xl backdrop-blur-md bg-rose-950/40 p-8 md:p-16 rounded-3xl border border-rose-400/30 shadow-2xl"
                >
                  <h2
                    className="text-4xl md:text-5xl font-bold mb-8 text-rose-100 text-center"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                    data-testid="about-title"
                  >
                    Une soirée inoubliable
                  </h2>
                  <div className="space-y-6 text-lg text-rose-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <p className="leading-relaxed">
                      Chaque moment passé avec toi est magique. Cette Saint-Valentin, j'ai préparé quelque chose de spécial 
                      pour célébrer ce que nous partageons. Une soirée remplie de surprises, de rires et de moments précieux.
                    </p>
                    <p className="leading-relaxed">
                      Tu illumines mes journées et rends chaque instant extraordinaire. Cette soirée sera le reflet de tout 
                      ce que tu représentes pour moi : unique, précieuse et inoubliable.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Memories Section with Images/Videos */}
              <section className="min-h-screen flex items-center justify-center px-4 py-20">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="max-w-6xl w-full"
                >
                  <h2
                    className="text-4xl md:text-5xl font-bold mb-12 text-rose-100 text-center"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                    data-testid="memories-title"
                  >
                    Nos plus beaux moments
                  </h2>
                  
                  {/* Image Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Placeholder images - User will replace these */}
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <motion.div
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-2xl overflow-hidden border-4 border-rose-400/30 shadow-xl"
                        data-testid={`memory-image-${num}`}
                      >
                        <img
                          src={`https://images.unsplash.com/photo-${num === 1 ? '1655788174766-a63b2d4409d1' : num === 2 ? '1550015296-7fd664acc768' : num === 3 ? '1712677927853-4481a1c078bc' : num === 4 ? '1661153795615-439d1cd786d5' : num === 5 ? '1655788174766-a63b2d4409d1' : '1550015296-7fd664acc768'}?crop=entropy&cs=srgb&fm=jpg&q=85`}
                          alt={`Placeholder ${num}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Video Section */}
                  <div className="backdrop-blur-md bg-rose-950/40 p-8 rounded-3xl border border-rose-400/30 shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 text-rose-100 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Vidéo spéciale
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-rose-900/30 flex items-center justify-center" data-testid="video-placeholder">
                      <div className="text-center text-rose-200">
                        <Camera className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg">Vidéo personnalisée à ajouter ici</p>
                        <p className="text-sm opacity-70 mt-2">(format: MP4, MOV, etc.)</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Evening Program Section */}
              <section className="min-h-screen flex items-center justify-center px-4 py-20">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="max-w-4xl w-full backdrop-blur-md bg-rose-950/40 p-8 md:p-16 rounded-3xl border border-rose-400/30 shadow-2xl"
                >
                  <h2
                    className="text-4xl md:text-5xl font-bold mb-12 text-rose-100 text-center"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                    data-testid="program-title"
                  >
                    Le dérouler de la soirée
                  </h2>

                  <div className="space-y-8">
                    {/* Timeline items */}
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-6 p-6 bg-rose-900/20 rounded-2xl border border-rose-400/20"
                      data-testid="program-step-1"
                    >
                      <div className="bg-rose-600 rounded-full p-4 flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-amber-300 mb-2">19h00 - Rendez-vous</h3>
                        <p className="text-rose-100 text-lg">Je viendrai te chercher pour commencer cette soirée magique</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-6 p-6 bg-rose-900/20 rounded-2xl border border-rose-400/20"
                      data-testid="program-step-2"
                    >
                      <div className="bg-rose-600 rounded-full p-4 flex-shrink-0">
                        <Utensils className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-amber-300 mb-2">19h30 - Dîner romantique</h3>
                        <p className="text-rose-100 text-lg">Un restaurant exceptionnel avec une ambiance intime et chaleureuse</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-6 p-6 bg-rose-900/20 rounded-2xl border border-rose-400/20"
                      data-testid="program-step-3"
                    >
                      <div className="bg-rose-600 rounded-full p-4 flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-amber-300 mb-2">21h30 - Surprise spéciale</h3>
                        <p className="text-rose-100 text-lg">Une surprise qui te fera sourire... C'est une surprise ! 🎁</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-6 p-6 bg-rose-900/20 rounded-2xl border border-rose-400/20"
                      data-testid="program-step-4"
                    >
                      <div className="bg-rose-600 rounded-full p-4 flex-shrink-0">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-amber-300 mb-2">22h00+ - La suite...</h3>
                        <p className="text-rose-100 text-lg">La soirée continue selon nos envies et notre humeur ✨</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </section>

              {/* Call to Action - Voir la surprise */}
              <section ref={surpriseRef} className="min-h-screen flex items-center justify-center px-4 py-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8"
                  >
                    <Sparkles className="w-24 h-24 mx-auto text-amber-300" />
                  </motion.div>

                  <h2
                    className="text-5xl md:text-6xl font-bold mb-8 text-rose-100"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                    data-testid="surprise-section-title"
                  >
                    Prête pour la surprise ?
                  </h2>

                  <p className="text-xl text-rose-100 mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Maintenant que tu connais le programme, il est temps de me donner ta réponse...
                  </p>

                  <Button
                    onClick={handleSurpriseClick}
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700 text-white px-16 py-8 text-2xl rounded-full shadow-2xl transition-all hover:scale-110 animate-pulse"
                    data-testid="surprise-button"
                  >
                    Voir la surprise
                  </Button>
                </motion.div>
              </section>
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
