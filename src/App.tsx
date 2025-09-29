import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import {
  Heart,
  Star,
  Users,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  ChevronDown,
  Check,
  Music,
  BookOpen,
  Gamepad2,
} from "lucide-react";
import axios from "axios";
interface RegistrationForm {
  childName: string;
  childAge: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  specialNeeds: string;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState<RegistrationForm>({
    childName: "",
    childAge: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    specialNeeds: "",
  });

  // Refs para los círculos decorativos
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);
  const circle4Ref = useRef<HTMLDivElement>(null);

  // Efecto para animaciones de confeti
  useEffect(() => {
    if (isRegistered) {
      const colors = ["#FF5252", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"];
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.top = "0";
      confetti.style.left = "0";
      confetti.style.width = "100%";
      confetti.style.height = "100%";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "1000";
      document.body.appendChild(confetti);

      for (let i = 0; i < 100; i++) {
        setTimeout(() => {
          const particle = document.createElement("div");
          particle.style.position = "absolute";
          particle.style.width = `${Math.random() * 10 + 5}px`;
          particle.style.height = particle.style.width;
          particle.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          particle.style.borderRadius = "50%";
          particle.style.left = `${Math.random() * 100}vw`;
          particle.style.top = "-10px";
          particle.style.opacity = "0.8";
          particle.style.transform = `rotate(${Math.random() * 360}deg)`;

          confetti.appendChild(particle);

          const animation = particle.animate(
            [
              { top: "-10px", opacity: 1, transform: `rotate(0deg) scale(1)` },
              {
                top: `${Math.random() * 100 + 50}vh`,
                left: `${
                  parseFloat(particle.style.left) + (Math.random() * 200 - 100)
                }px`,
                opacity: 0.2,
                transform: `rotate(${Math.random() * 360}deg) scale(0.5)`,
              },
            ],
            {
              duration: Math.random() * 3000 + 2000,
              easing: "cubic-bezier(0.1, 0.8, 0.3, 1)",
              fill: "forwards",
            }
          );

          animation.onfinish = () => particle.remove();
        }, i * 30);
      }

      return () => {
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      };
    }
  }, [isRegistered]);

  // Efecto para mover los círculos con el cursor o scroll
  useEffect(() => {
    const circles = [
      { ref: circle1Ref, baseX: 10, baseY: 10, factor: 0.02 },
      { ref: circle2Ref, baseX: 80, baseY: 25, factor: 0.03 },
      { ref: circle3Ref, baseX: 25, baseY: 80, factor: 0.025 },
      { ref: circle4Ref, baseX: 75, baseY: 75, factor: 0.035 },
    ];

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth > 768) {
        // Solo para desktop
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        circles.forEach((circle) => {
          if (circle.ref.current) {
            const newX = circle.baseX + (x - 50) * circle.factor;
            const newY = circle.baseY + (y - 50) * circle.factor;
            circle.ref.current.style.left = `${newX}%`;
            circle.ref.current.style.top = `${newY}%`;
          }
        });
      }
    };

    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        // Solo para móvil
        const scrollY = (window.scrollY / window.innerHeight) * 50;

        circles.forEach((circle, index) => {
          if (circle.ref.current) {
            const scrollFactor = index % 2 === 0 ? scrollY : -scrollY;
            const newY = circle.baseY + scrollFactor;
            circle.ref.current.style.top = `${newY}%`;
          }
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
  try {
    console.log(formData)
    const response = await axios.post("https://conferencita.vercel.app/api/registrar", formData);

    if (response.status === 200) {
      setIsRegistered(true); // ✅ se registró correctamente
      console.log("Formulario enviado correctamente");
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
};


  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animación de estrellas flotantes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-30px) translateX(10px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
          .animate-pulse { animation: pulse 2s ease-in-out infinite; }
          .animate-bounce { animation: bounce 2s ease-in-out infinite; }
          .animate-spin-slow { animation: spin 8s linear infinite; }
          .hover-zoom:hover { transform: scale(1.05); }
          .hover-wiggle:hover { animation: wiggle 0.5s ease-in-out; }
          .text-gradient {
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
          }
        `}
      </style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                <h1 className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 titles">
                  Conferencitas
                </h1>
              </span>
            </div>

            <nav className="hidden md:flex space-x-8 text-xl">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-gray-700 hover:text-blue-600 transition-colors font-semibold hover:animate-bounce"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("sobre")}
                className="text-gray-700 hover:text-blue-600 transition-colors font-semibold hover:animate-bounce"
              >
                Sobre el Evento
              </button>
              <button
                onClick={() => scrollToSection("actividades")}
                className="text-gray-700 hover:text-blue-600 transition-colors font-semibold hover:animate-bounce"
              >
                Actividades
              </button>
              <button
                onClick={() => scrollToSection("inscripcion")}
                className="text-gray-700 hover:text-blue-600 transition-colors font-semibold hover:animate-bounce"
              >
                Inscripción
              </button>
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ChevronDown
                className={`h-6 w-6 transform transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden animate-fade-in-down">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection("sobre")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Sobre el Evento
                </button>
                <button
                  onClick={() => scrollToSection("actividades")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Actividades
                </button>
                <button
                  onClick={() => scrollToSection("inscripcion")}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Inscripción
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden"
      >
        {/* Elementos decorativos con refs */}
        <div
          ref={circle1Ref}
          className="absolute w-8 h-8 bg-yellow-400 rounded-full opacity-70 animate-float transition-all duration-300 ease-out"
          style={{ left: "10%", top: "10%" }}
        />
        <div
          ref={circle2Ref}
          className="absolute w-6 h-6 bg-pink-400 rounded-full opacity-70 animate-float delay-1000 transition-all duration-300 ease-out"
          style={{ left: "80%", top: "25%" }}
        />
        <div
          ref={circle3Ref}
          className="absolute w-10 h-10 bg-blue-400 rounded-full opacity-70 animate-float delay-1500 transition-all duration-300 ease-out"
          style={{ left: "25%", top: "80%" }}
        />
        <div
          ref={circle4Ref}
          className="absolute w-12 h-12 bg-purple-400 rounded-full opacity-70 animate-float delay-2000 transition-all duration-300 ease-out"
          style={{ left: "75%", top: "75%" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 titles">
                  Conferencitas
                </span>
                <br />
                <span className="text-2xl md:text-3xl text-gray-700">
                  Donde la fe cobra vida
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Un evento especial diseñado para niños donde aprenderán sobre el
                amor de Dios a través de historias bíblicas, música, juegos y
                actividades divertidas que fortalecerán su fe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => scrollToSection("inscripcion")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse"
                >
                  ¡Inscribir Ahora!
                </button>
                <button
                  onClick={() => scrollToSection("sobre")}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 hover:animate-bounce"
                >
                  Conocer Más
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>4 y 5 De Octubre</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Nombre de el Lugar</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Para niños de... Poner edades</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden hover-zoom transition-all duration-300">
                <img
                  src=""
                  alt="Foto de las conferencitas"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-400 rounded-full opacity-80 animate-pulse delay-1000" />
              <div className="absolute top-1/2 -right-6 w-12 h-12 bg-blue-400 rounded-full opacity-80 animate-float delay-500" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-xl" />
        <div className="absolute bottom-10 -right-20 w-48 h-48 bg-purple-100 rounded-full opacity-30 blur-xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Qué son las{" "}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 titles">
                Conferencitas?
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-bold">
              Las Conferencitas son eventos especiales donde los niños descubren
              el amor de Dios de manera divertida y educativa, creando recuerdos
              inolvidables mientras fortalecen su fe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enseñanza Bíblica
              </h3>
              <p className="text-gray-600">
                Historias bíblicas contadas de manera dinámica y comprensible
                para los más pequeños.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Música y Alabanza
              </h3>
              <p className="text-gray-600">
                Canciones alegres que ayudan a los niños a expresar su amor por
                Dios.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-xl text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Juegos y Diversión
              </h3>
              <p className="text-gray-600">
                Actividades lúdicas que refuerzan los valores cristianos de
                manera entretenida.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 md:p-12 border border-orange-100 hover:shadow-lg transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Una experiencia{" "}
                  <span className="text-gradient bg-gradient-to-r from-orange-500 to-pink-500">
                    transformadora
                  </span>
                </h3>
                <p className="text-gray-600 mb-6">
                  Durante estos dos días, los niños vivirán una experiencia
                  única llena de aprendizaje, amistad y crecimiento espiritual
                  en un ambiente seguro y amoroso.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Ambiente seguro y supervisado
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Líderes capacitados y amorosos
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Juegos y Recreación</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src=""
                  alt="Foto de niños haciendo actividades"
                  className="w-full h-64 object-cover rounded-xl shadow-lg hover-zoom transition-transform duration-300"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-80 animate-pulse -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section
        id="actividades"
        className="py-20 bg-gray-50 relative overflow-hidden"
      >
        {/* Círculos decorativos */}
        {/* <div className="absolute top-[-150px] left-[-100px] w-72 h-72 bg-pink-400 rounded-full opacity-30 blur-3xl animate-float-slow z-0" />
        <div className="absolute top-[-200px] right-[-120px] w-72 h-72 bg-blue-400 rounded-full opacity-30 blur-3xl animate-float-slow delay-1000 z-0" />
        <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-yellow-300 rounded-full opacity-20 blur-2xl animate-float-slow delay-1500 z-0" /> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Información del{" "}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">
                Evento
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Todo lo que necesitas saber sobre las <span className="titles text-gradient bg-gradient-to-r from-blue-600 to-purple-600">Conferencitas 2025</span>
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white/30 backdrop-blur-md w-full md:w-[80%] rounded-xl shadow-lg p-8 text-center border border-white/50 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Detalles del Evento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Fechas</p>
                      <p className="text-gray-600">4 y 5 de Octubre 2025</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Horarios</p>
                      <p className="text-gray-600">
                        9:00 AM - 4:00 PM cada día
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ubicación</p>
                      <p className="text-gray-600">
                        Direccion
                        <br />
                        Calle o avenida
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Edades</p>
                      <p className="text-gray-600">4 a 12 años</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horario de actividades */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600">
                Horario Diario
              </span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-500 transition-transform duration-300 hover:scale-105">
                <div className="w-24 flex-shrink-0 font-medium text-blue-700">
                  9:00 AM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Registro y Bienvenida
                  </h4>
                  <p className="text-gray-600">
                    Los niños son recibidos con actividades de integración
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-purple-50/50 p-4 rounded-lg border-l-4 border-purple-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-purple-700">
                  9:30 AM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Tiempo de Alabanza
                  </h4>
                  <p className="text-gray-600">
                    Canciones divertidas y movidas para empezar el día con
                    energía
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-green-50/50 p-4 rounded-lg border-l-4 border-green-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-green-700">
                  10:00 AM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Historia Bíblica
                  </h4>
                  <p className="text-gray-600">
                    Enseñanza interactiva con títeres y actuaciones
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-yellow-50/50 p-4 rounded-lg border-l-4 border-yellow-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-yellow-700">
                  11:00 AM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Manualidades</h4>
                  <p className="text-gray-600">
                    Actividades creativas relacionadas con la lección
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-pink-50/50 p-4 rounded-lg border-l-4 border-pink-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-pink-700">
                  12:00 PM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Almuerzo</h4>
                  <p className="text-gray-600">
                    Tiempo para comer y socializar
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-indigo-50/50 p-4 rounded-lg border-l-4 border-indigo-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-indigo-700">
                  1:00 PM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Juegos y Recreación
                  </h4>
                  <p className="text-gray-600">
                    Actividades físicas y juegos en equipo
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-red-50/50 p-4 rounded-lg border-l-4 border-red-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-red-700">
                  2:30 PM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Refrigerio</h4>
                  <p className="text-gray-600">
                    Merienda saludable para recargar energías
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-teal-50/50 p-4 rounded-lg border-l-4 border-teal-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-teal-700">
                  3:00 PM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Tiempo de Reflexión
                  </h4>
                  <p className="text-gray-600">
                    Aplicación práctica de lo aprendido
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-orange-50/50 p-4 rounded-lg border-l-4 border-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-24 flex-shrink-0 font-medium text-orange-700">
                  3:30 PM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Cierre y Despedida
                  </h4>
                  <p className="text-gray-600">
                    Oración final y entrega de materiales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section
        id="inscripcion"
        className="py-20 bg-white relative overflow-hidden"
      >
        {/* Partículas decorativas flotantes */}
        <div className="absolute top-10 left-10 w-10 h-10 bg-pink-400 rounded-full opacity-40 animate-float-slow z-0" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-float-slow delay-1000 z-0" />
        <div className="absolute top-1/2 left-[-30px] w-12 h-12 bg-yellow-300 rounded-full opacity-20 blur-2xl animate-float-slow delay-1500 z-0" />
        <div className="absolute top-20 right-1/3 w-8 h-8 bg-purple-400 rounded-full opacity-30 blur-sm animate-float-slow delay-2000 z-0" />
        <div className="absolute bottom-1/3 left-1/4 w-14 h-14 bg-teal-300 rounded-full opacity-20 blur-md animate-float-slow delay-3000 z-0" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Inscripción
              </h2>
              <p className="text-lg text-gray-600">
                Completa el formulario para inscribir a tu hijo/a en las
                Conferencitas 2025
              </p>
            </div>

            {!isRegistered ? (
              <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 md:p-12 border border-white/50 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">
                      Formulario de Inscripción
                    </span>
                  </h3>
                  <p className="text-gray-600">
                    Completa todos los campos para registrar a tu hijo/a
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="group">
                    <label
                      htmlFor="childName"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                    >
                      Nombre completo del niño/a *
                    </label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm"
                      placeholder="Ej: María García"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="childAge"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                    >
                      Edad del niño/a *
                    </label>
                    <select
                      id="childAge"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none hover:border-purple-300 shadow-sm appearance-none bg-white"
                    >
                      <option value="">Seleccionar edad</option>
                      {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                        <option key={age} value={age}>
                          {age} años
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="group">
                    <label
                      htmlFor="parentName"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                    >
                      Nombre del padre/madre *
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm"
                      placeholder="Ej: Juan García"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="parentEmail"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                    >
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="parentEmail"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none hover:border-purple-300 shadow-sm"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="group">
                    <label
                      htmlFor="parentPhone"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                    >
                      Teléfono principal *
                    </label>
                    <input
                      type="tel"
                      id="parentPhone"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm"
                      placeholder="Ej: +1 234 567 8900"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="emergencyPhone"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                    >
                      Teléfono de emergencia *
                    </label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none hover:border-purple-300 shadow-sm"
                      placeholder="Ej: +1 234 567 8901"
                    />
                  </div>
                </div>

                <div className="mb-6 group">
                  <label
                    htmlFor="emergencyContact"
                    className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                  >
                    Contacto de emergencia *
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm"
                    placeholder="Nombre y relación (Ej: Ana García - Abuela)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="group">
                    <label
                      htmlFor="allergies"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                    >
                      Alergias o restricciones alimentarias
                    </label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none outline-none hover:border-purple-300 shadow-sm"
                      placeholder="Especificar alergias o escribir 'Ninguna'"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="specialNeeds"
                      className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                    >
                      Necesidades especiales
                    </label>
                    <textarea
                      id="specialNeeds"
                      name="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none outline-none hover:border-blue-300 shadow-sm"
                      placeholder="Cualquier información adicional o escribir 'Ninguna'"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>¡Inscribir a mi hijo/a!</span>
                  {/* <Heart className="h-5 w-5" /> */}
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  * Campos obligatorios. La información será utilizada
                  únicamente para fines del evento.
                </p>
              </form>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-2xl p-8 md:p-12 text-center shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
                  <span className="text-gradient bg-gradient-to-r from-green-600 to-teal-600">
                    ¡Inscripción Exitosa!
                  </span>
                </h3>
                <p className="text-green-700 mb-6 text-lg">
                  Hemos recibido la inscripción de{" "}
                  <strong className="text-green-800">
                    {formData.childName}
                  </strong>{" "}
                  para las Conferencitas 2025. Recibirás un correo de
                  confirmación con todos los detalles en los próximos minutos.
                </p>
                <div className="bg-white/80 rounded-lg p-6 border border-green-200/50 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                    Próximos pasos:
                  </h4>
                  <ul className="text-left space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>
                        Revisa tu correo electrónico para la confirmación
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>
                        Guarda las fechas: 4 y 5 de Octubre, 9:00 AM - 4:00 PM
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>
                        ¡Lleguen listos para una experiencia increíble!
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen los padres
            </h2>
            <p className="text-lg text-gray-600">
              Testimonios de familias que han vivido la experiencia de las
              Conferencitas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Mi hija Sofia no paró de hablar sobre las Conferencitas durante
                semanas. Fue una experiencia transformadora que fortaleció mucho
                su fe."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">María González</p>
                  <p className="text-gray-500 text-sm">
                    Madre de Sofia (8 años)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Los líderes fueron increíbles con los niños. Diego aprendió
                mucho y hasta ahora sigue cantando las canciones que aprendió."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">C</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Carlos Ruiz</p>
                  <p className="text-gray-500 text-sm">
                    Padre de Diego (10 años)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Una organización excelente y un ambiente muy seguro. Ana y Luis
                ya están emocionados por las próximas Conferencitas."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">L</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Laura Mendoza</p>
                  <p className="text-gray-500 text-sm">Madre de Ana y Luis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div> */}
                <span className="text-xl font-bold">Conferencitas</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Creando recuerdos eternos y fortaleciendo la fe de los más
                pequeños a través de experiencias transformadoras llenas de amor
                y aprendizaje.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <button
                    onClick={() => scrollToSection("inicio")}
                    className="hover:text-white transition-colors"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("sobre")}
                    className="hover:text-white transition-colors"
                  >
                    Sobre el Evento
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("actividades")}
                    className="hover:text-white transition-colors"
                  >
                    Actividades
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("inscripcion")}
                    className="hover:text-white transition-colors"
                  >
                    Inscripción
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Contacto</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>info@conferencitas.org</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1" />
                  <span>
                    Dirección del lugar
                    <br />
                    Av. Principal #123
                    <br />
                    Ciudad, País
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Conferencitas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
