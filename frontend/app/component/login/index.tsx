import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '~/context/auth/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

const InputField = ({ id, label, type, register, error, ...props }: any) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      {...props}
      className="w-full px-4 py-2  border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const PasswordField = ({ id, label, register, error }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    {...register(id)}
                    placeholder="********"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};


// User type selection factory
const UserTypeSelector = ({ register, error }: any) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Você é?</label>
        <div className="flex gap-4">
            <label className="flex items-center p-3 bg-blue-600 rounded-lg cursor-pointer flex-1 justify-center border border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-orange-400">
                <input type="radio" value="employee" {...register('userType')} className="sr-only" />
                <span className="text-white">Empregado</span>
            </label>
            <label className="flex items-center p-3 bg-blue-600 rounded-lg cursor-pointer flex-1 justify-center border border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-orange-400">
                <input type="radio" value="company" {...register('userType')} className="sr-only" />
                <span className="text-white">Empresa</span>
            </label>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);


// 2. Login Component
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

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await signIn(data);
      toast.success('Login realizado com sucesso!');
      navigate('/'); // Redirect to home page after login
    } catch (error) {
      toast.error('Falha no login. Verifique suas credenciais.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-300 rounded-xl shadow-neutral-500 shadow-xl">
        <h1 className="text-3xl font-bold text-center ">Login</h1>
        <p className="text-center">Acesse sua conta para continuar</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
          
            <div>
                <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
