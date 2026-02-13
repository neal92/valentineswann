import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Clock, Calendar, Sparkles, MapPin, Utensils, Camera, Music } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "./ui/dialog";

const ValentinePage = () => {
  const [step, setStep] = useState("landing"); // landing, proposal, forms, final
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [noButtonOpacity, setNoButtonOpacity] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);
  const [returnTime, setReturnTime] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const noButtonRef = useRef(null);
  const surpriseRef = useRef(null);

  const questions = [
    {
      question: "Où suis-je né ?",
      options: ["France", "Inde", "Seychelles", "Sénégal"],
      correct: 2
    },
    {
      question: "Ma chose préférée au monde",
      options: ["Les jeux", "Manger", "Toi", "Sortir"],
      correct: 2
    },
    {
      question: "Ma couleur préférée",
      options: ["Bleu", "Rouge", "Vert", "Tes yeux"],
      correct: 3
    },
    {
      question: "Mon rêve professionnel",
      options: ["Programmeur", "Chef", "Faire le tour du monde avec toi", "Artiste"],
      correct: 2
    },
    {
      question: "Combien de frères et sœurs ai-je ?",
      options: ["0", "1", "2", "3"],
      correct: 2
    }
  ];

  const handleQuizStart = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackAnswer, setFeedbackAnswer] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (answerIndex) => {
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    setFeedbackCorrect(isCorrect);
    setFeedbackAnswer(questions[currentQuestion].options[questions[currentQuestion].correct]);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz finished
        setQuizFinished(true);
      }
    }, 2000);
  };

  const handleContinueToSurprise = () => {
    const score = answers.filter((answer, index) => answer === questions[index].correct).length;
    if (score === questions.length) {
      setQuizFinished(false);
      setShowQuiz(false);
      setShowVideo(true);
    } else {
      // Reset quiz
      setQuizFinished(false);
      setCurrentQuestion(0);
      setAnswers([]);
      setShowQuiz(true);
    }
  };

  const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;

  const handleSendEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    try {
      // Use environment variable for backend URL, fallback to proxy in development
      const apiUrl = process.env.REACT_APP_BACKEND_URL || '/api/send-video';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
      } else {
        setEmailError(data.error || "Une erreur est survenue lors de l'envoi");
      }
    } catch (error) {
      setEmailError("Impossible de se connecter au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
  }, []);

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
                    Ce site à été faite uniquement pour toi, j'espere que tu saura apprecier et c'est une maniere de te montrer à quel point je t'aime.
                    Bonne navigation  ❤️
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
                      J'aimerai que tu sache que chaque moment passé avec toi est magique.Je sais quee je fais des erreurs, mais cette Saint-Valentin, j'ai quand meme voulu te préparer quelque chose de spécial 
                      pour célébrer ce que nous partageons. Une soirée remplie de surprises, de rires et de moments précieux.
                    </p>
                    <p className="leading-relaxed">
                        Les actions valent plus que mille mots, c’est pour cela que j’ai voulu te montrer, plutôt que te dire, à quel point tu comptes pour moi.
                          Tu illumines mes journées et rends chaque instant extraordinaire.
                          Cette soirée sera le reflet de tout ce que tu représentes pour moi :
                          unique, précieuse et inoubliable.
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
                  
                  {/* Media Mosaic Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {/* Mixed Images and Videos with controls */}
                    {[
                      { type: 'image', src: "/images/image1.jpeg" },
                      { type: 'video', src: "/images/Vidéo.mov" },
                      { type: 'image', src: "/images/image2.jpeg" },
                      { type: 'video', src: "/images/Vidéo_1.mov" },
                      { type: 'image', src: "/images/image3.jpeg" },
                      { type: 'video', src: "/images/Vidéo_2.mov" },
                      { type: 'image', src: "/images/IMG_6259.JPEG" },
                      { type: 'video', src: "/images/Vidéo_3.mov" },
                      { type: 'image', src: "/images/img1.jpeg" },
                      { type: 'video', src: "/images/Vidéo_4.mov" },
                      { type: 'video', src: "/images/v_1.mov" },
                      { type: 'video', src: "/images/Vidéo_5.mov" },
                      { type: 'video', src: "/images/v_4.mov" },
                      { type: 'video', src: "/images/Vidéo_6.mov" },
                      { type: 'video', src: "/images/v_6.mov" },
                      { type: 'video', src: "/images/Vidéo_7.mov" },
                      { type: 'video', src: "/images/v_9.mov" },
                      { type: 'video', src: "/images/Vidéo_8.mov" },
                      { type: 'video', src: "/images/v10.mov" },
                      { type: 'video', src: "/images/Vidéo_9.mov" },
                      { type: 'image', src: "/images/image0.jpeg" }
                    ].map((media, index) => (
                      <motion.div
                        key={`${media.type}-${index}`}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-2xl overflow-hidden border-4 border-rose-400/30 shadow-xl"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.src}
                            alt={`Moment spécial ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video 
                            src={media.src} 
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          >
                            Votre navigateur ne supporte pas la lecture de vidéos.
                          </video>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Special Video Section */}
                  <div className="backdrop-blur-md bg-rose-950/40 p-8 rounded-3xl border border-rose-400/30 shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 text-rose-100 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Vidéo spéciale
                    </h3>
                    <div className="text-center">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 text-xl rounded-full shadow-2xl transition-all hover:scale-110 animate-pulse border-2 border-rose-300"
                        onClick={handleQuizStart}
                      >
                        <Sparkles className="w-6 h-6 mr-2" />
                        Voir la vidéo spéciale
                      </Button>

                      {/* Quiz Dialog */}
                      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
                        <DialogContent className="max-w-md mx-auto bg-rose-950/90 border-rose-400/30">
                          <DialogTitle className="sr-only">Quiz sur moi</DialogTitle>
                          <DialogDescription className="sr-only">Réponds à toutes les questions correctement pour voir la vidéo</DialogDescription>
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-rose-100 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                              Avant de voir la vidéo un petit quizz sur moi 🎯
                            </h3>
                            <p className="text-rose-200 mb-6 text-sm italic">
                              ⚠️ Si tu n'as pas toutes les bonnes réponses, tu ne verras pas la petite vidéo !
                            </p>
                            {!showFeedback ? (
                              <>
                                <p className="text-rose-200 mb-4">
                                  Question {currentQuestion + 1} sur {questions.length}
                                </p>
                                <h4 className="text-xl text-rose-100 mb-6">
                                  {questions[currentQuestion].question}
                                </h4>
                                <RadioGroup onValueChange={(value) => handleAnswer(parseInt(value))} className="space-y-3">
                                  {questions[currentQuestion].options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                      <RadioGroupItem
                                        value={index.toString()}
                                        id={`option-${index}`}
                                        className="border-rose-400 text-rose-600"
                                      />
                                      <Label
                                        htmlFor={`option-${index}`}
                                        className="text-lg text-rose-100 cursor-pointer hover:text-rose-200 transition-colors"
                                      >
                                        {option}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </>
                            ) : (
                              <div className="py-8">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`text-4xl mb-4 ${feedbackCorrect ? 'text-green-400' : 'text-red-400'}`}
                                >
                                  {feedbackCorrect ? '✅ Correct !' : '❌ Incorrect'}
                                </motion.div>
                                {!feedbackCorrect && (
                                  <p className="text-rose-200 text-lg">
                                    La bonne réponse était : <span className="text-amber-300 font-bold">{feedbackAnswer}</span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Quiz Finished Dialog */}
                      <Dialog open={quizFinished} onOpenChange={setQuizFinished}>
                        <DialogContent className="max-w-md mx-auto bg-rose-950/90 border-rose-400/30">
                          <DialogTitle className="sr-only">Résultats du quiz</DialogTitle>
                          <DialogDescription className="sr-only">Voici tes résultats au quiz</DialogDescription>
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`text-4xl mb-4 ${correctAnswers === questions.length ? 'text-amber-300' : 'text-red-400'}`}
                            >
                              {correctAnswers === questions.length ? '🎉' : '😅'}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-rose-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {correctAnswers === questions.length ? 'Parfait !' : 'Presque !'}
                            </h3>
                            <p className="text-rose-200 mb-6">
                              Tu as eu {correctAnswers} bonnes réponses sur {questions.length}
                            </p>
                            {correctAnswers === questions.length ? (
                              <Button
                                onClick={handleContinueToSurprise}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full"
                              >
                                Continuer vers la surprise
                              </Button>
                            ) : (
                              <div>
                                <p className="text-rose-200 mb-4">
                                  Il faut toutes les bonnes réponses pour voir la surprise !
                                </p>
                                <Button
                                  onClick={handleContinueToSurprise}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
                                >
                                  Recommencer le quiz
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Email Form Dialog */}
                      <Dialog open={showVideo} onOpenChange={setShowVideo}>
                        <DialogContent className="max-w-md mx-auto bg-rose-950/90 border-rose-400/30">
                          <DialogTitle className="sr-only">Recevoir la vidéo par email</DialogTitle>
                          <DialogDescription className="sr-only">Entre ton email pour recevoir la vidéo spéciale</DialogDescription>
                          <div className="text-center">
                            {!emailSent ? (
                              <>
                                <h3 className="text-2xl font-bold text-rose-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  Félicitations ! ❤️
                                </h3>
                                <p className="text-rose-200 mb-6">
                                  Tu as réussi le quiz avec {correctAnswers}/{questions.length} !
                                </p>
                                <p className="text-rose-200 mb-6">
                                  Entre ton adresse email pour recevoir la vidéo spéciale :
                                </p>
                                <div className="space-y-4">
                                  <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    value={email}
                                    onChange={(e) => {
                                      setEmail(e.target.value);
                                      setEmailError("");
                                    }}
                                    className="w-full px-4 py-3 rounded-lg bg-rose-900/30 border border-rose-400/30 text-rose-100 placeholder-rose-300/50 focus:outline-none focus:border-rose-400"
                                    disabled={isSubmitting}
                                  />
                                  {emailError && (
                                    <p className="text-red-400 text-sm">{emailError}</p>
                                  )}
                                  <Button
                                    onClick={handleSendEmail}
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-full"
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <span className="inline-block animate-spin mr-2">⏳</span>
                                        Envoi en cours...
                                      </>
                                    ) : (
                                      "Recevoir la vidéo"
                                    )}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-6xl mb-4"
                                >
                                  💌
                                </motion.div>
                                <h3 className="text-2xl font-bold text-rose-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  Email envoyé !
                                </h3>
                                <p className="text-rose-200 mb-4">
                                  Vérifie ta boîte mail ({email})
                                </p>
                                <p className="text-rose-300 text-sm">
                                  Si tu ne vois rien, pense à regarder dans les spams 😉
                                </p>
                                <Button
                                  onClick={() => {
                                    setShowVideo(false);
                                    setEmailSent(false);
                                    setEmail("");
                                  }}
                                  className="mt-6 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full"
                                >
                                  Fermer
                                </Button>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
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
                        <p className="text-rose-100 text-lg">Je viendrai te chercher pour commencer cette soirée magique avec quelque surprise 🎁</p>
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
                        <p className="text-rose-100 text-lg">Une surprise qui te fera sourire... ! 🎁</p>
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
                    onClick={handleNoHover}
                    onTouchStart={handleNoHover}
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
