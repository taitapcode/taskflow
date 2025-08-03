'use client';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupSchema } from './schema';
import createClient from '@/lib/supabase/browser';
import { Form, Input, Button, Link } from '@heroui/react';
import NextLink from 'next/link';
import { LockKeyhole, LogIn, Mail, User } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.displayName,
        },
      },
    });
    console.log(error);
    if (error) setError('email', { type: 'manual', message: error.message });
    else if (user) router.push('/app');
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-foreground text-background flex w-100 flex-col items-center gap-5 rounded-xl p-10'
    >
      <h1 className='text-3xl font-semibold'>Sign Up</h1>
      <Input
        {...register('displayName')}
        placeholder='Display Name'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.displayName?.message || ''}
        isInvalid={!!errors.displayName}
        startContent={<User className={errors.displayName ? 'text-danger' : 'text-content2'} />}
      />
      <Input
        {...register('email')}
        placeholder='Email'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.email?.message || ''}
        isInvalid={!!errors.email}
        startContent={<Mail className={errors.email ? 'text-danger' : 'text-content2'} />}
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
        startContent={<LockKeyhole className={errors.password ? 'text-danger' : 'text-content2'} />}
      />
      <Input
        {...register('confirmPassword')}
        placeholder='Confirm Password'
        type='password'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.confirmPassword?.message || ''}
        isInvalid={!!errors.confirmPassword}
        startContent={
          <LockKeyhole className={errors.confirmPassword ? 'text-danger' : 'text-content2'} />
        }
      />

      <Button className='w-full' color='primary' type='submit' size='lg' disabled={isSubmitting}>
        <LogIn /> Sign Up
      </Button>
      <p>
        Or you already have an account?{' '}
        <Link href='/login' as={NextLink} underline='hover' className='text-primary'>
          Log in
        </Link>
      </p>
    </Form>
  );
}
