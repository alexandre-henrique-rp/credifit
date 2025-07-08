import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { RegisterData } from "~/types/register";

/**
 * Configuração da instância base do Axios
 */
const baseApi = axios.create({
  baseURL: "http://localhost:3032",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Interceptor de requisição para adicionar automaticamente o token
 */
baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta para tratar erros de autenticação
 */
baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Se o token expirou ou é inválido, limpa o localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Redireciona para login se necessário
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Cliente API com métodos organizados
 */
const apiClient = {
  // Instância do axios para uso direto quando necessário
  axios: baseApi,
  
  /**
   * Métodos de autenticação
   */
  auth: {
    /**
     * Login do usuário
     */
    login: async (email: string, password: string, userType: string) => {
      const response = await baseApi.post('/auth', {
        email,
        password,
        userType
      });
      return response.data;
    },
    
    /**
     * Validação do token e obtenção dos dados do usuário
     */
    me: async (id: number, userType: string) => {
      if (userType === 'company') {
        const response = await baseApi.get(`/company/${id}`);
        return response.data;
      } else {
        const response = await baseApi.get(`/employee/${id}`);
        return response.data;
      }
    },
    
    /**
     * Logout do usuário
     */
    logout: async () => {
      try {
        await baseApi.post('/auth/logout');
      } catch (error) {
        console.warn('Erro no logout:', error);
      } finally {
        localStorage.removeItem('authToken');
      }
    }
  },

  /**
   * Registro de novo usuário (empresa ou funcionário)
   */
  register: async (data: RegisterData) => {
    const { userType, ...rest } = data;
    
    try {
      if (userType === 'company') {
        // Para empresa: envia name, razaoSocial, email, password, cnpj
        const companyData = {
          name: rest.name,
          razaoSocial: rest.razaoSocial,
          email: rest.email,
          password: rest.password,
          cnpj: rest.cnpj
        };
        
        const response = await baseApi.post('/company', companyData);
        return response.data;
      } else {
        // Para funcionário: envia name, cpf, email, password, salary, companyId
        const employeeData = {
          name: rest.name,
          cpf: rest.cpf,
          email: rest.email,
          password: rest.password,
          salary: rest.salary,
          companyCnpj: rest.companyCnpj
        };
        
        const response = await baseApi.post('/employee', employeeData);
        return response.data;
      }
    } catch (error: any) {
      console.error('Erro no registro:', error.response.data.message);
      throw error.response.data.message || error.message || 'Erro ao registrar usuário';
    }
  },

  getLoans: async (id: number) => {
    const response = await baseApi.get(`/employee/loan/${id}`);
    return response.data;
  },

};

export default apiClient;
