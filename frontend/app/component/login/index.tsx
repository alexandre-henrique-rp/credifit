import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '~/hook/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

// 1. Validation Schema with Zod
const loginSchema = z.object({
  userType: z.enum(['employee', 'company'], {
    required_error: 'Por favor, selecione o tipo de usuário.',
    invalid_type_error: 'Por favor, selecione o tipo de usuário.',
  }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

/**
 * Componente de campo de entrada reutilizável
 */
const InputField = ({ id, label, type, register, error, ...props }: any) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} *
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

/**
 * Componente de campo de senha com visibilidade toggável
 */
const PasswordField = ({ id, label, register, error }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} *
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    {...register(id)}
                    placeholder="Digite sua senha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:border-transparent pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-[#057D88]"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};


/**
 * Seletor de tipo de usuário (Empresa ou Funcionário)
 */
const UserTypeSelector = ({ register, error }: any) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário *</label>
        <div className="flex gap-4">
            <label className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer flex-1 justify-center border-2 border-gray-300 has-[:checked]:border-[#057D88] has-[:checked]:bg-[#057D88] has-[:checked]:text-white transition-colors">
                <input type="radio" value="employee" {...register('userType')} className="sr-only" />
                <span>Funcionário</span>
            </label>
            <label className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer flex-1 justify-center border-2 border-gray-300 has-[:checked]:border-[#057D88] has-[:checked]:bg-[#057D88] has-[:checked]:text-white transition-colors">
                <input type="radio" value="company" {...register('userType')} className="sr-only" />
                <span>Empresa</span>
            </label>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);


/**
 * Componente principal de login com layout moderno
 */
export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { signIn } = useAuth();
  const navigate = useNavigate();

  /**
   * Função para processar o envio do formulário de login
   */
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await signIn(data);
            toast.success('Login realizado com sucesso!');
      navigate('/'); // Redireciona para a página inicial após login
    } catch (error) {
      toast.error('Falha no login. Verifique suas credenciais.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#057D88] to-[#045a63] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo!</h1>
            <p className="text-gray-600">Acesse sua conta para continuar</p>
          </div>
          
          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <UserTypeSelector register={register} error={errors.userType} />
            
            <InputField 
              id="email"
              label="Email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="seuemail@exemplo.com"
            />
            
            <PasswordField
              id="password"
              label="Senha"
              register={register}
              error={errors.password}
            />
            
            {/* Botão de login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-white bg-[#057D88] rounded-lg font-semibold hover:bg-[#045a63] focus:outline-none focus:ring-2 focus:ring-[#057D88] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          {/* Link para registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-[#057D88] hover:text-[#045a63] font-semibold hover:underline transition-colors"
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            © 2024 CrediFít. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
