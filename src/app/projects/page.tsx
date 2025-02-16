"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

// Leaflet Dynamic Imports
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [latitude, setLatitude] = useState(-23.55052);
  const [longitude, setLongitude] = useState(-46.633308);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla a modal de exclusão
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null); // ID do projeto a ser excluído
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

        const userResponse = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(userResponse.data.id);

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

  const fetchCoordinates = async (address: any) => {
    try {
      const query = `${address.localidade}, ${address.estado}, ${address.cep}`;
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=0219d00d6b894c21bcb641ef40462629`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
      } else {
        throw new Error("Não foi possível encontrar as coordenadas.");
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      toast.error("Erro ao buscar a localização.");
      return null;
    }
  };

  const openAddressModal = async (address: any) => {
    setSelectedAddress(address);

    const coordinates = await fetchCoordinates(address);
    if (coordinates) {
      setLatitude(coordinates.lat);
      setLongitude(coordinates.lng);
    }

    setIsAddressModalOpen(true);
  };

  const openDeleteModal = (projectId: number) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/projects/${projectToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Projeto excluído com sucesso!");
      setProjects(projects.filter((project: any) => project.id !== projectToDelete));
    } catch (error) {
      toast.error("Erro ao excluir projeto.");
      console.error("Erro ao excluir projeto", error);
    } finally {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const openTasksModal = (tasks: any[]) => {
    setSelectedTasks(tasks);
    setIsTasksModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projetos</h1>
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
              <td className="border border-gray-300 p-2 text-center">
                {(() => {
                  const [year, month, day] = project.start_date.split("-");
                  return `${day}/${month}/${year}`;
                })()}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="text-blue-500"
                  onClick={() => openAddressModal(project.address)}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="text-blue-500"
                  onClick={() => openTasksModal(project.tasks)}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {/* Botão Editar */}
                <button
                  className={`${
                    project.user_id === currentUserId
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } px-2 py-1 rounded mr-2`}
                  onClick={() => router.push(`/projects/edit/${project.id}`)}
                  disabled={project.user_id !== currentUserId}
                  data-tooltip-id={`tooltip-edit-${project.id}`}
                  data-tooltip-content={
                    project.user_id !== currentUserId ? "Este projeto pertence a outro usuário" : ""
                  }
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <Tooltip id={`tooltip-edit-${project.id}`} place="top" effect="solid" />

                {/* Botão Excluir */}
                <button
                  className={`${
                    project.user_id === currentUserId
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } px-2 py-1 rounded`}
                  onClick={() => openDeleteModal(project.id)}
                  disabled={project.user_id !== currentUserId}
                  data-tooltip-id={`tooltip-delete-${project.id}`}
                  data-tooltip-content={
                    project.user_id !== currentUserId ? "Este projeto pertence a outro usuário" : ""
                  }
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <Tooltip id={`tooltip-delete-${project.id}`} place="top" effect="solid" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

      {/* Modal de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.</p>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Endereço */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Endereço</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <div className="flex flex-col md:flex-row h-auto space-y-4 md:space-y-0 md:space-x-4">
              {/* Mapa */}
              <div className="w-full md:w-1/2 h-[400px]">
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  className="h-full w-full rounded"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[latitude, longitude]}>
                    <Popup>
                      {selectedAddress.localidade} - {selectedAddress.estado},{" "}
                      {selectedAddress.cep}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              {/* Detalhes do Endereço */}
              <div className="w-full md:w-1/2 bg-gray-100 p-6 rounded shadow">
                <p><strong>CEP:</strong> {selectedAddress.cep}</p>
                <p><strong>Logradouro:</strong> {selectedAddress.logradouro || "N/A"}</p>
                <p><strong>Complemento:</strong> {selectedAddress.complemento || "N/A"}</p>
                <p><strong>Bairro:</strong> {selectedAddress.bairro || "N/A"}</p>
                <p><strong>Localidade:</strong> {selectedAddress.localidade}</p>
                <p><strong>Estado:</strong> {selectedAddress.estado}</p>
                <p><strong>Região:</strong> {selectedAddress.regiao || "N/A"}</p>
                <p><strong>DDD:</strong> {selectedAddress.ddd}</p>
                <p><strong>SIAFI:</strong> {selectedAddress.siafi}</p>
              </div>
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
                  <th className="border border-gray-300 px-4 py-2 text-left">Título</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Descrição
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
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
