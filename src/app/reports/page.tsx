"use client";

import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReportsPage() {
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [reportData, setReportData] = useState<any>(null);

  // Fetch dos dados do relatório
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/reports/projects", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start_date_from: startDateFrom || undefined,
          start_date_to: startDateTo || undefined,
        },
      });
      setReportData(response.data);
    } catch (error) {
      toast.error("Erro ao buscar relatório.");
      console.error("Erro ao buscar relatório", error);
    }
  };

  // Fetch inicial ao carregar a página
  useEffect(() => {
    fetchReports();
  }, []);

  // Configuração do gráfico de projetos x status
  const projectStatusData = {
    labels: ["Planejado", "Em Andamento", "Concluído"],
    datasets: [
      {
        data: [
          reportData?.projects_by_status["planejado"] || 0,
          reportData?.projects_by_status["em andamento"] || 0,
          reportData?.projects_by_status["concluído"] || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Configuração do gráfico de tarefas x status
  const taskStatusData = {
    labels: ["Pendente", "Em Andamento", "Concluída"],
    datasets: [
      {
        data: [
          reportData?.tasks_by_status["pendente"] || 0,
          reportData?.tasks_by_status["em andamento"] || 0,
          reportData?.tasks_by_status["concluída"] || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>

      {/* Filtros de Data */}
      <div className="mb-6 p-4 bg-white shadow-md rounded">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block font-bold mb-2">Data Inicial</label>
            <input
              type="date"
              value={startDateFrom}
              onChange={(e) => setStartDateFrom(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Data Final</label>
            <input
              type="date"
              value={startDateTo}
              onChange={(e) => setStartDateTo(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>
        <Button
          onClick={fetchReports}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Aplicar Filtros
        </Button>
      </div>

      {/* Gráficos */}
      {reportData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Projetos x Status */}
          <div className="p-4 bg-white shadow-md rounded flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4 text-center">
              Projetos por Status
            </h2>
            <div className="w-full max-w-sm">
              <Pie data={projectStatusData} />
            </div>
          </div>

          {/* Gráfico de Tarefas x Status */}
          <div className="p-4 bg-white shadow-md rounded flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4 text-center">
              Tarefas por Status
            </h2>
            <div className="w-full max-w-sm">
              <Pie data={taskStatusData} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Carregando relatório...</p>
      )}
    </div>
  );
}
