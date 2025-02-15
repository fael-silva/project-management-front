import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo à Home</h1>
      <div className="flex flex-col space-y-4">
        <Link href="/projects/create" className="bg-blue-500 text-white p-3 rounded shadow">
          Cadastrar Projetos
        </Link>
        <Link href="/projects" className="bg-green-500 text-white p-3 rounded shadow">
          Listar Projetos
        </Link>
        <Link href="/reports" className="bg-purple-500 text-white p-3 rounded shadow">
          Relatórios
        </Link>
      </div>
    </div>
  );
}
