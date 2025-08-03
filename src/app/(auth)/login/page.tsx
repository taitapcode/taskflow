'use client';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from './schema';
import createClient from '@/utils/supabase/browser';
import { Form, Input, Button, Link } from '@heroui/react';
import NextLink from 'next/link';
import { LockKeyhole, LogIn, User } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const supabase = createClient();
    const { error, data: userData } = await supabase.auth.signInWithPassword(data);
    if (userData) {
      console.log('User logged in:', userData);
      router.push('/app');
    }
    if (error) setError('email', { type: 'manual', message: error.message });
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-foreground text-background flex w-100 flex-col items-center gap-5 rounded-xl p-10'
    >
      <h1 className='text-3xl font-semibold'>Login</h1>
      <Input
        {...register('email')}
        placeholder='Email'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.email?.message || ''}
        isInvalid={!!errors.email}
        startContent={<User />}
      />
      <Input
        {...register('password')}
        placeholder='Password'
        type='password'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.password?.message || ''}
        isInvalid={!!errors.password}
        startContent={<LockKeyhole />}
      />
      <Button className='w-full' color='primary' type='submit' size='lg'>
        <LogIn /> Log in
      </Button>
      <p>
        Or you don&apos;t have account yet?{' '}
        <Link href='/signup' as={NextLink} underline='hover' className='text-primary'>
          Sign up
        </Link>
      </p>
    </Form>
  );
}
