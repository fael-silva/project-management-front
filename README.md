# **Frontend - Project Management**

Frontend do sistema **Project Management**, desenvolvido em **Next.js** com integração ao backend para gerenciamento de projetos, tarefas e relatórios. Esta aplicação utiliza o boilerplate **ShadCN UI** e foi estilizada com **TailwindCSS**.

---

## **1️⃣ Funcionalidades do Frontend**

### **🔐 1.1. Autenticação**
- Tela de login com validação de credenciais utilizando JWT.
- Armazenamento do token no `localStorage` para persistência de sessão.
- Botão de logout com redirecionamento automático para a página de login.

### **📂 1.2. Gerenciamento de Projetos**
- **Cadastro:** Formulário com validação de CEP e criação dinâmica de tarefas.
- **Listagem:** Exibição de projetos em uma tabela com suporte a paginação.
  - Botões de ação (`Editar`, `Excluir`) desabilitados para projetos pertencentes a outros usuários, exibindo tooltip informativa.
- **Edição:** Tela para atualizar projetos, incluindo a adição e remoção de tarefas.
- **Exclusão:** Ação com confirmação para evitar exclusões acidentais.
- **Visualização de Endereço no Mapa:** Exibição do endereço com integração ao **Leaflet.js** e **OpenStreetMap**, além de detalhes complementares sobre o endereço.

### **📊 1.3. Relatórios**
- Tela com gráficos de pizza (usando `react-chartjs-2`) para exibir relatórios de projetos e tarefas por status.
- Filtros de data para customizar os dados exibidos no relatório.

### **📌 1.4. Navegação**
- Ícones visuais em menus e botões para facilitar a navegação e melhorar a experiência do usuário.
- Página inicial com links rápidos para cadastro, listagem e relatórios.

---

## **2️⃣ Requisitos e Dependências**

### **📌 2.1. Requisitos**
- **Node.js:** >= 16.x
- **NPM ou Yarn:** Gerenciador de pacotes.
- Backend configurado e rodando ([veja o README do backend](../README.md)).

### **📦 2.2. Dependências**
| Dependência        | Versão       | Descrição                                  |
|--------------------|--------------|------------------------------------------|
| `next`            | ^15.1.7      | Framework para React com suporte a SSR e SSG. |
| `react`           | ^18.x        | Biblioteca para criação de interfaces.      |
| `tailwindcss`     | ^3.x         | Framework de CSS utilitário.               |
| `shadcn/ui`       | ^2.x         | Biblioteca de componentes pré-construídos. |
| `axios`           | ^1.x         | Para chamadas HTTP à API do backend.       |
| `react-hot-toast` | ^2.x         | Para exibição de notificações no sistema.  |
| `react-chartjs-2` | ^5.x         | Wrapper para integração com Chart.js.      |
| `chart.js`        | ^4.x         | Biblioteca para gráficos no relatório.     |
| `leaflet`         | ^1.9.x       | Biblioteca de mapas para renderização do endereço. |
| `react-leaflet`   | ^4.x         | Wrapper React para Leaflet.js.             |
| `@heroicons/react`| ^2.x         | Ícones para navegação e ações no sistema.  |

---

## **3️⃣ Decisões Técnicas**

1. **Framework:**
   - Utilizamos **Next.js** para aproveitar sua capacidade de renderização híbrida e facilitar a criação de rotas dinâmicas.

2. **Estilo e Componentização:**
   - **TailwindCSS:** Utilizado para estilização rápida e consistente.
   - **ShadCN UI:** Forneceu componentes reutilizáveis (ex.: modais, botões e menus).

3. **Gráficos:**
   - **Chart.js** integrado via `react-chartjs-2` para criar gráficos de pizza na tela de relatórios.

4. **Autenticação:**
   - Token JWT armazenado no `localStorage`.
   - Rotas protegidas verificam o token e redirecionam para `/login` se não for válido.

5. **Mapas e Geocoding:**
   - Utilização de **Leaflet.js** e **OpenStreetMap** para renderização do mapa.
   - API do **OpenCage** para geocodificação de endereços, garantindo maior precisão.

6. **Notificações:**
   - `react-hot-toast` para exibição de mensagens de sucesso e erro de forma centralizada.

7. **Navegação com Ícones:**
   - Ícones da biblioteca **Heroicons** foram integrados para melhorar a usabilidade e facilitar a identificação das ações disponíveis.

---

## **4️⃣ Estrutura de Pastas**

```plaintext
project-management-front/
├── public/                     # Arquivos estáticos
├── src/
│   ├── app/                    # Diretório principal de rotas
│   │   ├── projects/           # Páginas relacionadas a projetos
│   │   ├── reports/            # Páginas relacionadas a relatórios
│   │   ├── home/               # Página inicial
│   │   ├── login/              # Página de login
│   │   └── layout.tsx          # Layout padrão para todas as páginas
│   ├── components/             # Componentes reutilizáveis
│   ├── services/               # Arquivos de configuração de API
│   └── styles/                 # Arquivos de estilo global
├── .env.local                  # Arquivo de variáveis de ambiente
├── docker-compose.yml          # Configuração para Docker
├── Dockerfile                  # Configuração do container Docker
├── package.json                # Configuração do npm
├── tailwind.config.js          # Configuração do TailwindCSS
└── README.md                   # Documentação do frontend
```

---

## **5️⃣ Como Rodar a Aplicação Completa (Frontend + Backend)**  

Para rodar a aplicação completa (frontend + backend), siga as instruções disponíveis no README do backend, **seção 6**:  

🔗 **[Acesse as instruções aqui](https://github.com/fael-silva/projectManagement)**  

Lá você encontrará todos os detalhes sobre como:  
✅ Clonar os repositórios corretamente.  
✅ Ajustar o `docker-compose-project.yml`.  
✅ Subir os containers do backend, banco e frontend.  
✅ Acessar a aplicação em execução.   

---

