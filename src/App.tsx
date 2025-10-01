import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { Heart, Check } from "lucide-react";
import axios from "axios";

interface RegistrationForm {
  participantName: string;
  participantAge: string;
  responsibleName: string;
  responsiblePhone: string;
  specialCondition: string;
  careDetails: string;
  plenarias: string[];
}

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState<RegistrationForm>({
    participantName: "",
    participantAge: "",
    responsibleName: "",
    responsiblePhone: "",
    specialCondition: "",
    careDetails: "",
    plenarias: [],
  });
  const [id, setId] = useState<number | null>(null);

  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);
  const circle4Ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const circles = [
      { ref: circle1Ref, baseX: 10, baseY: 10, factor: 0.02 },
      { ref: circle2Ref, baseX: 80, baseY: 25, factor: 0.03 },
      { ref: circle3Ref, baseX: 25, baseY: 80, factor: 0.025 },
      { ref: circle4Ref, baseX: 75, baseY: 75, factor: 0.035 },
    ];

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth > 768) {
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
    const { name, value, type, checked } = e.target;

    if (name === "plenarias") {
      setFormData((prev) => {
        if (checked) {
          return { ...prev, plenarias: [...prev.plenarias, value] };
        } else {
          return {
            ...prev,
            plenarias: prev.plenarias.filter((p) => p !== value),
          };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /*   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://conferencita.vercel.app/api/registrar",
        formData
      );
      if (response.status === 200) setIsRegistered(true);
    } catch (error) {
      console.error(error);
    }
  }; */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Separar nombre y apellido del participante
      const [apellido_chico = "", nombre_chico = ""] =
        formData.participantName.split(" ");
      // Separar nombre y apellido del responsable
      const [apellido_responsable = "", nombre_responsable = ""] =
        formData.responsibleName.split(" ");

      // Preparar plenarias como string separado por comas
      const plenaria = formData.plenarias.join(",");

      // Armar objeto que envía el front al backend
      const payload = {
        nombre_chico: nombre_chico || formData.participantName,
        apellido_chico: apellido_chico || "",
        nombre_responsable: nombre_responsable || formData.responsibleName,
        apellido_responsable: apellido_responsable || "",
        celular_responsable: formData.responsiblePhone,
        condicion_medica: formData.specialCondition === "si",
        detalle_condicion: formData.careDetails || null,
        plenaria,
        pago: false,
      };

      const response = await axios.post(
        "https://conferencitas-back-final.vercel.app/api/inscripciones",
        payload
      );

      if (response.status === 201) {
        setIsRegistered(true);

        setId(response.data.id);
        console.log(response.data.id);
      }
    } catch (error) {
      console.error("Error al enviar la inscripción:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <section
        id="inscripcion"
        className="py-10 bg-white relative overflow-hidden"
      >
        <div className="absolute top-10 left-10 w-10 h-10 bg-pink-400 rounded-full opacity-40 animate-float-slow z-0" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-float-slow delay-1000 z-0" />
        <div className="absolute top-1/2 left-[-30px] w-12 h-12 bg-yellow-300 rounded-full opacity-20 blur-2xl animate-float-slow delay-1500 z-0" />
        <div className="absolute top-20 right-1/3 w-8 h-8 bg-purple-400 rounded-full opacity-30 blur-sm animate-float-slow delay-2000 z-0" />
        <div className="absolute bottom-1/3 left-1/4 w-14 h-14 bg-teal-300 rounded-full opacity-20 blur-md animate-float-slow delay-3000 z-0" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {!isRegistered ? (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Inscripción
                  </h2>
                  <p className="text-2xl text-gray-600">
                    Completá el formulario para inscribir a tu hijo/a en las
                    Conferencitas 2025
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 md:p-12 border border-white/50 hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Campos principales */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="group">
                      <label
                        htmlFor="participantName"
                        className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                      >
                        Apellido y Nombre del niño/a *
                      </label>
                      <input
                        type="text"
                        id="participantName"
                        name="participantName"
                        value={formData.participantName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm"
                        placeholder="Ej: García María"
                      />
                    </div>

                    <div className="group">
                      <label
                        htmlFor="participantAge"
                        className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                      >
                        Edad *
                      </label>
                      <select
                        id="participantAge"
                        name="participantAge"
                        value={formData.participantAge}
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
                        htmlFor="responsibleName"
                        className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                      >
                        Apellido y Nombre de el/los responsable/s *
                      </label>
                      <input
                        type="text"
                        id="responsibleName"
                        name="responsibleName"
                        value={formData.responsibleName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm"
                        placeholder="Ej: García Juan"
                      />
                    </div>

                    <div className="group">
                      <label
                        htmlFor="responsiblePhone"
                        className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                      >
                        Número de celular de el/los responsable/s *
                      </label>
                      <input
                        type="tel"
                        id="responsiblePhone"
                        name="responsiblePhone"
                        value={formData.responsiblePhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none hover:border-purple-300 shadow-sm"
                        placeholder="Ej: +54 9 11 12345678"
                      />
                    </div>
                  </div>

                  {/* Condición especial */}
                  <div className="mb-6 group">
                    <label
                      htmlFor="specialCondition"
                      className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors"
                    >
                      ¿El niño presenta alguna condición de salud, discapacidad,
                      neurodivergencia o aspecto a tener en cuenta que requiera
                      acompañamiento especial durante las actividades?
                    </label>
                    <select
                      id="specialCondition"
                      name="specialCondition"
                      value={formData.specialCondition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 shadow-sm bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>

                  {formData.specialCondition === "si" && (
                    <div className="mb-6 group">
                      <label
                        htmlFor="careDetails"
                        className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors"
                      >
                        Por favor especificar de qué tipo de cuidado requiere *
                      </label>
                      <textarea
                        id="careDetails"
                        name="careDetails"
                        value={formData.careDetails}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none outline-none hover:border-purple-300 shadow-sm"
                        placeholder="Especificar tipo de cuidado"
                      />
                    </div>
                  )}

                  {/* Plenarias */}
                  <div className="mb-6 group">
                    <label className="block text-lg font-medium text-gray-700 mb-4 group-hover:text-blue-600 transition-colors">
                      Seleccioná a qué plenaria va a asistir (puede ser más de
                      una), recordá que el precio de cada plenaria es de $1.000
                      por niño/a *
                    </label>

                    <div className="space-y-3">
                      <h3 className="text-xl">Sábado:</h3>
                      <label className="flex items-center space-x-3 text-xl">
                        <input
                          type="checkbox"
                          name="plenarias"
                          value="plenaria1"
                          checked={formData.plenarias.includes("plenaria1")}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>Plenaria 1</span>
                      </label>
                      <label className="flex items-center space-x-3 text-xl">
                        <input
                          type="checkbox"
                          name="plenarias"
                          value="plenaria2"
                          checked={formData.plenarias.includes("plenaria2")}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>Plenaria 2</span>
                      </label>

                      <h3 className="text-xl">Domingo:</h3>
                      <label className="flex items-center space-x-3 text-xl">
                        <input
                          type="checkbox"
                          name="plenarias"
                          value="plenaria3"
                          checked={formData.plenarias.includes("plenaria3")}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>Plenaria 1</span>
                      </label>
                      <label className="flex items-center space-x-3 text-xl">
                        <input
                          type="checkbox"
                          name="plenarias"
                          value="plenaria4"
                          checked={formData.plenarias.includes("plenaria4")}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>Plenaria 2</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>¡Inscribir a mi hijo/a!</span>
                  </button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    * Campos obligatorios. La información será utilizada
                    únicamente para fines del evento.
                  </p>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-4xl font-bold text-center text-green-600">
                  ¡Formulario enviado correctamente!
                </h3>
                <br />
                <h1 className="text-center text-2xl">
                  El siguiente número es el{" "}
                  <b>
                    <u>correspondiente a la inscripción del niño/a</u>
                  </b>
                  , por favor,{" "}
                  <b>
                    <u>es de suma importancia</u>
                  </b>{" "}
                  que presente una captura o diga este número a los
                  recepcionistas el día de la conferencia. <br />
                  <b className="text-4xl">
                    <u>{id}</u>
                  </b>
                </h1>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
