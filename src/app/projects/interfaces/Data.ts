export interface CepData {
    cep: string;
    uf: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade: string;
    estado: string;
    regiao?: string;
    ddd?: string;
    siafi?: string;
  }

  export interface TaskData {
    id: number;
    title: string;
    description: string;
    status: string;
  }

  export interface ProjectData {
    id: number;
    name: string;
    description: string;
    start_date: string;
    address: CepData;
    tasks: TaskData[];
    user_id: number;
  }
  