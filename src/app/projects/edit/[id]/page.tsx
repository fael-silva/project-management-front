"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function EditProjectPage() {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksToRemove, setTasksToRemove] = useState<number[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null); // Controla a tarefa a ser excluída
  const [isTaskDeleteModalOpen, setIsTaskDeleteModalOpen] = useState(false); // Controla a exibição da modal de exclusão de tarefa
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planejado");
  const [cep, setCep] = useState("");
  const [cepData, setCepData] = useState<any>(null);
  const [isCepValid, setIsCepValid] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectData = response.data;

        setProject(projectData);
        setName(projectData.name);
        setDescription(projectData.description);
        setStatus(projectData.status);

        if (projectData.address.cep) {
          setCep(projectData.address.cep);
          setIsCepValid(true);
          setCepData({
            localidade: projectData.address.localidade,
            uf: projectData.address.uf,
          });
        } else {
          setCep("");
          setIsCepValid(false);
        }

        setTasks(projectData.tasks || []);
      } catch (error) {
        toast.error("Erro ao buscar o projeto.");
        console.error(error);
      }
    };
    fetchProject();
  }, [id]);

  // Função para validar o CEP
  const validateCep = async () => {
    setIsLoadingCep(true);
    setCepError("");
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/cep/${cep}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleTaskChange = (
    index: number,
    field: keyof typeof tasks[number],
    value: string
  ) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { title: "", description: "", status: "pendente" }]);
  };

  const openTaskDeleteModal = (taskId: number) => {
    setTaskToDelete(taskId);
    setIsTaskDeleteModalOpen(true);
  };

  const handleConfirmRemoveTask = () => {
    if (!taskToDelete) return;

    const taskIndex = tasks.findIndex((task) => task.id === taskToDelete);
    if (taskIndex >= 0) {
      if (taskToDelete) {
        setTasksToRemove([...tasksToRemove, taskToDelete]);
      }
      const updatedTasks = [...tasks];
      updatedTasks.splice(taskIndex, 1);
      setTasks(updatedTasks);
    }

    setIsTaskDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCepValid) {
      toast.error("Por favor, valide o CEP antes de atualizar o projeto.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/projects/${id}`,
        {
          name,
          description,
          status,
          cep,
          tasks,
          tasks_to_remove: tasksToRemove,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Projeto atualizado com sucesso!");
      router.push("/projects"); // Redireciona para a listagem
    } catch (error) {
      toast.error("Erro ao atualizar o projeto.");
      console.error(error);
    }
  };

  if (!project) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-2xl font-bold text-center">Editar Projeto</h1>

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
            <div>
              <label className="block font-bold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="planejado">Planejado</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
              </select>
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
                <div>
                  <label className="block font-bold mb-2">Status</label>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleTaskChange(index, "status", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="concluída">Concluída</option>
                  </select>
                </div>
                {tasks.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => openTaskDeleteModal(task.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
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

          {/* Botão de Atualizar */}
          <div className="text-center">
            <Button
              type="submit"
              className="bg-blue-500 text-white p-2 w-full max-w-md rounded"
            >
              Atualizar Projeto
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de Exclusão de Tarefa */}
      <Dialog open={isTaskDeleteModalOpen} onOpenChange={setIsTaskDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button
              onClick={() => setIsTaskDeleteModalOpen(false)}
              className="bg-gray-500 text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRemoveTask}
              className="bg-red-500 text-white"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
