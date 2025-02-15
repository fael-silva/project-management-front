"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirecionamento
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // Importa o toast

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cep, setCep] = useState("");
  const [cepData, setCepData] = useState(null);
  const [tasks, setTasks] = useState([{ title: "", description: "" }]);
  const [isCepValid, setIsCepValid] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");
  const router = useRouter(); // Inicializa o router para redirecionamento

  // Função para validar o CEP
  const validateCep = async () => {
    setIsLoadingCep(true);
    setCepError("");
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/cep/${cep}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCepData(response.data);
      setIsCepValid(true);
    } catch (error) {
      setCepError("CEP inválido ou não encontrado.");
      setIsCepValid(false);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleAddTask = () => {
    setTasks([...tasks, { title: "", description: "" }]);
  };

  const handleRemoveTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleTaskChange = (
    index: number,
    field: keyof typeof tasks[number],
    value: string
  ) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCepValid) {
      toast.error("Por favor, valide o CEP antes de cadastrar o projeto.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/projects",
        { name, description, cep, tasks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Projeto cadastrado com sucesso!");
      router.push("/projects"); // Redireciona para a tela de listagem
    } catch (error) {
      console.error("Erro ao cadastrar projeto:", error);
      toast.error("Erro ao cadastrar projeto. Tente novamente.");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-2xl font-bold text-center">Cadastrar Projeto</h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados do Projeto */}
          <div className="p-6 bg-white rounded shadow-md space-y-4">
            <h2 className="text-lg font-bold">Dados do Projeto</h2>
            <input
              type="text"
              placeholder="Nome do Projeto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Descrição do Projeto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>
            <div>
              <input
                type="text"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={validateCep}
                className={`w-full p-2 border rounded ${
                  cepError ? "border-red-500" : ""
                }`}
              />
              {isLoadingCep && <p className="text-gray-500">Validando CEP...</p>}
              {cepError && <p className="text-red-500">{cepError}</p>}
              {isCepValid && (
                <p className="text-green-500">
                  CEP válido: {cepData?.localidade} - {cepData?.uf}
                </p>
              )}
            </div>
          </div>

          {/* Tarefas */}
          <div className="p-6 bg-white rounded shadow-md space-y-4">
            <h2 className="text-lg font-bold">Tarefas</h2>
            {tasks.map((task, index) => (
              <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
                <h3 className="text-md font-bold mb-2">Tarefa {index + 1}</h3>
                <input
                  type="text"
                  placeholder={`Título da Tarefa ${index + 1}`}
                  value={task.title}
                  onChange={(e) =>
                    handleTaskChange(index, "title", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder={`Descrição da Tarefa ${index + 1}`}
                  value={task.description}
                  onChange={(e) =>
                    handleTaskChange(index, "description", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-2"
                ></textarea>
                {tasks.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveTask(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remover Tarefa
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddTask}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Adicionar Tarefa
            </Button>
          </div>

          {/* Botão de Cadastrar */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={!isCepValid}
              className="bg-blue-500 text-white p-2 w-full max-w-md rounded"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
