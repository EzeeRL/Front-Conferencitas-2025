// src/Entrada.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

interface Inscripcion {
  id: number;
  nombre_chico: string;
  apellido_chico: string;
  edad: number;
  nombre_responsable: string;
  apellido_responsable: string;
  celular_responsable: string;
  condicion_medica: boolean;
  detalle_condicion?: string;
  plenaria: string; // "plenaria1,plenaria2"
  pago: boolean;
  asistio_plenaria1?: boolean;
  asistio_plenaria2?: boolean;
  asistio_plenaria3?: boolean;
  asistio_plenaria4?: boolean;
  salio?: boolean;
}

const Entrada: React.FC = () => {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [searchId, setSearchId] = useState("");
  const [filtered, setFiltered] = useState<Inscripcion[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] =
    useState<Inscripcion | null>(null);
  const [selectedPlenarias, setSelectedPlenarias] = useState<number[]>([]);
  const [plenariasModal, setPlenariasModal] = useState<number[]>([]);
  const [selectedPlenariaFilter, setSelectedPlenariaFilter] = useState<
    number | ""
  >("");
  const [modalEdadOpen, setModalEdadOpen] = useState(false);
  const [nuevaEdad, setNuevaEdad] = useState<number | "">("");

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    try {
      const res = await axios.get(
        "https://conferencitas-back-final.vercel.app/api/inscripciones"
      );

      const data = Array.isArray(res.data)
        ? res.data.map((d: any) => ({
            ...d,
            salio: !!d.salio,
            asistio_plenaria1: !!d.asistio_plenaria1,
            asistio_plenaria2: !!d.asistio_plenaria2,
            asistio_plenaria3: !!d.asistio_plenaria3,
            asistio_plenaria4: !!d.asistio_plenaria4,
          }))
        : [];

      setInscripciones(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error al obtener inscripciones:", error);
      setInscripciones([]);
      setFiltered([]);
    }
  };

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeText(e.target.value);
    setSearchId(e.target.value);

    const filteredList = inscripciones.filter((i) => {
      const nombreCompleto = normalizeText(
        `${i.nombre_chico} ${i.apellido_chico}`
      );
      const nombreInvertido = normalizeText(
        `${i.apellido_chico} ${i.nombre_chico}`
      );
      const soloNombre = normalizeText(i.nombre_chico);
      const soloApellido = normalizeText(i.apellido_chico);

      const matchesSearch =
        i.id.toString() === value ||
        nombreCompleto.includes(value) ||
        nombreInvertido.includes(value) ||
        soloNombre.includes(value) ||
        soloApellido.includes(value);

      const matchesPlenaria =
        !selectedPlenariaFilter ||
        i.plenaria.split(",").includes(`plenaria${selectedPlenariaFilter}`);

      return matchesSearch && matchesPlenaria;
    });

    setFiltered(filteredList);
  };

  const handlePlenariaFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedPlenariaFilter(value ? parseInt(value) : "");

    const filteredList = inscripciones.filter((i) => {
      const nombreCompleto = normalizeText(
        `${i.nombre_chico} ${i.apellido_chico}`
      );
      const nombreInvertido = normalizeText(
        `${i.apellido_chico} ${i.nombre_chico}`
      );
      const soloNombre = normalizeText(i.nombre_chico);
      const soloApellido = normalizeText(i.apellido_chico);
      const valueNormalized = normalizeText(searchId);

      const matchesSearch =
        i.id.toString() === valueNormalized ||
        nombreCompleto.includes(valueNormalized) ||
        nombreInvertido.includes(valueNormalized) ||
        soloNombre.includes(valueNormalized) ||
        soloApellido.includes(valueNormalized);

      const matchesPlenaria =
        !value || i.plenaria.split(",").includes(`plenaria${value}`);

      return matchesSearch && matchesPlenaria;
    });

    setFiltered(filteredList);
  };

  const openModal = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion);

    const plenariasDisponibles = inscripcion.plenaria
      .split(",")
      .map((p) => parseInt(p.replace("plenaria", "")));

    const inicial: number[] = plenariasDisponibles.filter(
      (num) => inscripcion[`asistio_plenaria${num}` as keyof Inscripcion]
    );

    setSelectedPlenarias(inicial);
    setPlenariasModal(plenariasDisponibles);
    setModalOpen(true);
  };

  const togglePlenaria = (num: number) => {
    setSelectedPlenarias((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const confirmarIngreso = async () => {
    if (!selectedInscripcion) return;
    try {
      for (let i of plenariasModal) {
        const asistio = selectedPlenarias.includes(i);
        await axios.patch(
          `https://conferencitas-back-final.vercel.app/api/inscripciones/asistencia/${selectedInscripcion.id}`,
          { plenaria: i, asistio }
        );
      }

      setInscripciones((prev) =>
        prev.map((ins) =>
          ins.id === selectedInscripcion.id
            ? {
                ...ins,
                asistio_plenaria1: selectedPlenarias.includes(1),
                asistio_plenaria2: selectedPlenarias.includes(2),
                asistio_plenaria3: selectedPlenarias.includes(3),
                asistio_plenaria4: selectedPlenarias.includes(4),
              }
            : ins
        )
      );
      setFiltered((prev) =>
        prev.map((ins) =>
          ins.id === selectedInscripcion.id
            ? {
                ...ins,
                asistio_plenaria1: selectedPlenarias.includes(1),
                asistio_plenaria2: selectedPlenarias.includes(2),
                asistio_plenaria3: selectedPlenarias.includes(3),
                asistio_plenaria4: selectedPlenarias.includes(4),
              }
            : ins
        )
      );

      setModalOpen(false);
      setSelectedInscripcion(null);
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
    }
  };

  const toggleSalida = async (
    id: number,
    nombre: string,
    salioActual: boolean
  ) => {
    const confirmar = window.confirm(
      `¿Seguro que querés marcar a ${nombre} como ${
        salioActual ? "NO salió" : "SALIDO"
      }?`
    );
    if (!confirmar) return;

    try {
      const nuevoValor = !salioActual;
      await axios.patch(
        `https://conferencitas-back-final.vercel.app/api/inscripciones/salio/${id}`,
        { salio: nuevoValor }
      );

      setInscripciones((prev) =>
        prev.map((ins) => (ins.id === id ? { ...ins, salio: nuevoValor } : ins))
      );
      setFiltered((prev) =>
        prev.map((ins) => (ins.id === id ? { ...ins, salio: nuevoValor } : ins))
      );

      alert(
        `Ahora ${nombre} está marcado como ${
          nuevoValor ? "SALIDO" : "NO salió"
        }.`
      );
    } catch (error) {
      console.error("Error al cambiar salida:", error);
      alert("Error al actualizar salida.");
    }
  };

  // 🧮 Calcular total de ingresados según el filtro
  const totalIngresaron = useMemo(() => {
    if (!inscripciones.length) return 0;

    if (!selectedPlenariaFilter) {
      return inscripciones.filter(
        (i) =>
          i.asistio_plenaria1 ||
          i.asistio_plenaria2 ||
          i.asistio_plenaria3 ||
          i.asistio_plenaria4
      ).length;
    }

    return inscripciones.filter(
      (i) => i[`asistio_plenaria${selectedPlenariaFilter}` as keyof Inscripcion]
    ).length;
  }, [inscripciones, selectedPlenariaFilter]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Control de Entrada
      </h1>

      <p className="text-xl font-semibold mb-4 text-center text-green-600">
        <u>Total de inscriptos: {inscripciones.length}</u>
      </p>
      <p className="text-xl font-semibold mb-4 text-center text-blue-600">
        <u>
          Total que ingresaron
          {selectedPlenariaFilter
            ? ` a la plenaria ${selectedPlenariaFilter}`
            : " (todas las plenarias)"}
          : {totalIngresaron}
        </u>
      </p>
      <div className="mb-6 text-center flex flex-col md:flex-row justify-center gap-4">
        <input
          type="text"
          placeholder="Buscar por ID o nombre"
          value={searchId}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedPlenariaFilter}
          onChange={handlePlenariaFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las plenarias</option>
          <option value="1">Plenaria 1</option>
          <option value="2">Plenaria 2</option>
          <option value="3">Plenaria 3</option>
          <option value="4">Plenaria 4</option>
        </select>
      </div>

      {/* Contenedor de scroll horizontal solo para la tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[900px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2">ID</th>
              <th className="border border-gray-300 px-3 py-2">Niño/a</th>
              <th className="border border-gray-300 px-3 py-2">Edad</th>
              <th className="border border-gray-300 px-3 py-2">
                Condición médica
              </th>
              <th className="border border-gray-300 px-3 py-2">Responsable</th>
              <th className="border border-gray-300 px-3 py-2">Celular</th>
              <th className="border border-gray-300 px-3 py-2">Plenaria</th>
              <th className="border border-gray-300 px-3 py-2 text-center">
                Ingreso
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center">
                Salida
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filtered) && filtered.length > 0 ? (
              filtered.map((ins) => (
                <tr
                  key={ins.id}
                  className={`border transition-colors duration-200 ${(() => {
                    const count =
                      (ins.asistio_plenaria1 ? 1 : 0) +
                      (ins.asistio_plenaria2 ? 1 : 0) +
                      (ins.asistio_plenaria3 ? 1 : 0) +
                      (ins.asistio_plenaria4 ? 1 : 0);

                    if (count === 4)
                      return "bg-green-500 hover:border-gray-700";
                    if (count === 3)
                      return "bg-green-400 hover:border-gray-700";
                    if (count === 2)
                      return "bg-green-300 hover:border-gray-700";
                    if (count === 1)
                      return "bg-green-200 hover:border-gray-700";
                    return "hover:bg-gray-300 hover:border-gray-700";
                  })()}`}
                >
                  <td className="border border-gray-300 px-3 py-2">{ins.id}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    {ins.apellido_chico} {ins.nombre_chico}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {ins.edad}
                    <button
                      className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => {
                        setSelectedInscripcion(ins);
                        setNuevaEdad(ins.edad);
                        setModalEdadOpen(true);
                      }}
                    >
                      ✏️
                    </button>
                  </td>

                  <td className="border border-gray-300 px-3 py-2">
                    {ins.condicion_medica
                      ? ins.detalle_condicion || "Sí"
                      : "No"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {ins.apellido_responsable} {ins.nombre_responsable}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {ins.celular_responsable}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {ins.plenaria}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => openModal(ins)}
                    >
                      Marcar ingreso
                    </button>
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      className={`px-2 py-1 rounded text-white ${
                        ins.salio
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() =>
                        toggleSalida(ins.id, ins.nombre_chico, !!ins.salio)
                      }
                    >
                      {ins.salio ? "Cancelar salida" : "Marcar salida"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No se encontraron inscripciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedInscripcion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              Marcar asistencia de: {selectedInscripcion.nombre_chico}
            </h2>

            <div className="mb-4 text-xl">
              {plenariasModal.map((num) => (
                <label
                  key={num}
                  className="flex items-center mb-2 cursor-pointer p-[5px] transform transition duration-300 hover:scale-105 hover:bg-gray-300"
                >
                  <input
                    type="checkbox"
                    className="mr-2 cursor-pointer"
                    checked={selectedPlenarias.includes(num)}
                    onChange={() => togglePlenaria(num)}
                  />
                  Plenaria {num}
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-red-600 rounded text-white transform transition-transform duration-300 hover:scale-105"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600 transform transition-transform duration-300 hover:scale-105"
                onClick={confirmarIngreso}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEdadOpen && selectedInscripcion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              Editar edad de: {selectedInscripcion.nombre_chico}
            </h2>

            <input
              type="number"
              value={nuevaEdad}
              onChange={(e) => setNuevaEdad(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-red-600 rounded text-white"
                onClick={() => setModalEdadOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={async () => {
                  if (!selectedInscripcion) return;
                  try {
                    await axios.patch(
                      `https://conferencitas-back-final.vercel.app/api/inscripciones/edad/${selectedInscripcion.id}`,
                      { edad: nuevaEdad }
                    );

                    // actualizar estado en frontend
                    setInscripciones((prev) =>
                      prev.map((ins) =>
                        ins.id === selectedInscripcion.id
                          ? { ...ins, edad: nuevaEdad as number }
                          : ins
                      )
                    );
                    setFiltered((prev) =>
                      prev.map((ins) =>
                        ins.id === selectedInscripcion.id
                          ? { ...ins, edad: nuevaEdad as number }
                          : ins
                      )
                    );

                    setModalEdadOpen(false);
                    setSelectedInscripcion(null);
                  } catch (error) {
                    console.error("Error al actualizar edad:", error);
                    alert("Error al actualizar edad.");
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entrada;
