"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null); // Armazena o nome do usuário
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado. Faça login.");
        router.push("/login");
        return;
      }

      const response = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserName(response.data.name);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      toast.error("Erro ao obter dados do usuário.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Título do sistema */}
        <h1 className="text-xl font-bold">
          <Link href="/home">Project Management</Link>
        </h1>

        {/* Menu de navegação */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <Link href="/home" passHref legacyBehavior>
                <NavigationMenuLink className="hover:underline">Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/projects/create" passHref legacyBehavior>
                <NavigationMenuLink className="hover:underline">Cadastro</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/projects" passHref legacyBehavior>
                <NavigationMenuLink className="hover:underline">Listagem</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/reports" passHref legacyBehavior>
                <NavigationMenuLink className="hover:underline">Relatórios</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Nome do usuário e botão de logout */}
        <div className="flex items-center space-x-4">
          {userName && <span className="text-sm text-gray-300">Bem-vindo, {userName}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
