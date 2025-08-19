'use client';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from './schema';
import createClient from '@/lib/supabase/browser';
import { Form, Input, Button, Card, CardBody } from '@/app/_components/UI';
import NextLink from 'next/link';
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn, Mail } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.signInWithPassword(data);
    if (error) setError('root', { type: 'manual', message: error.message });
    else if (user) router.push('/app');
  };

  return (
    <Card className='w-[420px] max-w-[92vw] backdrop-blur-md'>
      <CardBody className='p-6 sm:p-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold'>Welcome back</h1>
          <p className='text-foreground-600 mt-1 text-sm'>Log in to continue to TaskFlow</p>
        </div>

        {errors.root && (
          <div className='mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-danger text-sm'>
            {errors.root.message}
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <Input
            {...register('email')}
            label='Email'
            placeholder='you@example.com'
            variant='flat'
            size='lg'
            errorMessage={errors.email?.message || ''}
            isInvalid={!!errors.email}
            startContent={<Mail size={18} />}
          />

          <Input
            {...register('password')}
            label='Password'
            placeholder='••••••••'
            type={showPassword ? 'text' : 'password'}
            variant='flat'
            size='lg'
            errorMessage={errors.password?.message || ''}
            isInvalid={!!errors.password}
            startContent={<LockKeyhole size={18} />}
            endContent={
              <button
                type='button'
                className='text-foreground-600 hover:text-foreground'
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button className='mt-2 w-full' color='primary' type='submit' size='lg' disabled={isSubmitting}> 
            {isSubmitting ? <Loader2 className='animate-spin' size={18} /> : <LogIn size={18} />} 
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </Form>

        <p className='text-foreground-600 mt-6 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <NextLink href='/signup' className='text-primary hover:underline'>Sign up</NextLink>
        </p>
      </CardBody>
    </Card>
  );
}
