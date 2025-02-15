"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function EditProjectPage() {
  const [project, setProject] = useState<any>(null); // Dados do projeto
  const [tasks, setTasks] = useState<any[]>([]); // Tarefas
  const [tasksToRemove, setTasksToRemove] = useState<number[]>([]); // IDs das tarefas a remover
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planejado");

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
        setTasks(projectData.tasks || []);
      } catch (error) {
        toast.error("Erro ao buscar o projeto.");
        console.error(error);
      }
    };
    fetchProject();
  }, [id]);

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

  const handleRemoveTask = (index: number, taskId?: number) => {
    if (taskId) {
      setTasksToRemove([...tasksToRemove, taskId]);
    }
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/projects/${id}`,
        {
          name,
          description,
          status,
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
                    onClick={() => handleRemoveTask(index, task.id)}
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
    </div>
  );
}
