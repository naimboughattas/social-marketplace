import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['business', 'influencer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'business'
    }
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      await signup(data.email, data.password, data.role);
      navigate('/dashboard/buy');
    } catch (error) {
      setError('root', {
        message: 'Failed to create account. Please try again.'
      });
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start growing your Instagram presence today"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            {...register('role')}
            className="w-full rounded-md border border-gray-200 p-2"
          >
            <option value="business">Business</option>
            <option value="influencer">Influencer</option>
          </select>
        </div>

        {errors.root && (
          <div className="text-sm text-red-500">
            {errors.root.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}