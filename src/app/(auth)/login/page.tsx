'use client';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from './schema';
import createClient from '@/lib/supabase/browser';
import { Form, Input, Button } from '@/app/_components/UI';
import NextLink from 'next/link';
import { LockKeyhole, LogIn, User } from 'lucide-react';

export default function Login() {
  const router = useRouter();
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
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-foreground text-background flex w-100 flex-col items-center gap-5 rounded-xl p-10'
    >
      <h1 className='text-3xl font-semibold'>Login</h1>
      {errors.root && <p className='text-danger'>{errors.root.message}</p>}
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
      <Button className='w-full' color='primary' type='submit' size='lg' disabled={isSubmitting}>
        <LogIn /> Log in
      </Button>
      <p>
        Or you don&apos;t have account yet?{' '}
        <NextLink href='/signup' className='text-primary hover:underline'>Sign up</NextLink>
      </p>
    </Form>
  );
}
