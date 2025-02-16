import Link from "next/link";
import { PlusCircleIcon, ListBulletIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo</h1>
      <div className="flex flex-col space-y-4">
        <Link
          href="/projects/create"
          className="bg-blue-500 text-white p-3 rounded shadow flex items-center space-x-2 hover:bg-blue-600"
        >
          <PlusCircleIcon className="h-6 w-6" />
          <span>Cadastrar Projetos</span>
        </Link>
        <Link
          href="/projects"
          className="bg-green-500 text-white p-3 rounded shadow flex items-center space-x-2 hover:bg-green-600"
        >
          <ListBulletIcon className="h-6 w-6" />
          <span>Listar Projetos</span>
        </Link>
        <Link
          href="/reports"
          className="bg-purple-500 text-white p-3 rounded shadow flex items-center space-x-2 hover:bg-purple-600"
        >
          <ChartBarIcon className="h-6 w-6" />
          <span>Relatórios</span>
        </Link>
      </div>
    </div>
  );
}
