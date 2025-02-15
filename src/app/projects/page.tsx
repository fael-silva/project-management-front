"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token de autenticação ausente. Por favor, faça login.");
          window.location.href = "/login";
          return;
        }

        const response = await api.get(`/projects?per_page=10&page=${currentPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.data);
        setTotalPages(response.data.last_page);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          toast.error("Erro ao buscar projetos.");
          console.error("Erro ao buscar projetos", error);
        }
      }
    };
    fetchProjects();
  }, [currentPage]);

  const handleDelete = async (projectId: number) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Projeto excluído com sucesso!");
        setProjects(projects.filter((project: any) => project.id !== projectId));
      } catch (error) {
        toast.error("Erro ao excluir projeto.");
        console.error("Erro ao excluir projeto", error);
      }
    }
  };

  const openAddressModal = (address: any) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  const openTasksModal = (tasks: any[]) => {
    setSelectedTasks(tasks);
    setIsTasksModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Projetos</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Nome do Projeto</th>
            <th className="border border-gray-300 p-2">Descrição</th>
            <th className="border border-gray-300 p-2">Data de Início</th>
            <th className="border border-gray-300 p-2">Endereço</th>
            <th className="border border-gray-300 p-2">Tarefas</th>
            <th className="border border-gray-300 p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project: any) => (
            <tr key={project.id}>
              <td className="border border-gray-300 p-2">{project.name}</td>
              <td className="border border-gray-300 p-2">{project.description}</td>
              <td className="border border-gray-300 p-2">{project.start_date}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="text-blue-500 underline"
                  onClick={() => openAddressModal(project.address)}
                >
                  Ver Endereço
                </button>
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  className="text-blue-500 underline"
                  onClick={() => openTasksModal(project.tasks)}
                >
                  Ver Tarefas
                </button>
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => router.push(`/projects/edit/${project.id}`)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(project.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginação */}
      <div className="mt-4 flex justify-between">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal de Endereço */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Endereço</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <div>
              <p>CEP: {selectedAddress.cep}</p>
              <p>Logradouro: {selectedAddress.logradouro}</p>
              <p>Bairro: {selectedAddress.bairro}</p>
              <p>Cidade: {selectedAddress.localidade}</p>
              <p>Estado: {selectedAddress.uf}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Tarefas */}
      <Dialog open={isTasksModalOpen} onOpenChange={setIsTasksModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tarefas</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Título
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Descrição
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedTasks.map((task: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{task.title}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {task.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
