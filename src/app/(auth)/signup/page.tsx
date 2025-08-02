'use client';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupSchema } from '../schema';
import { Form, Input, Button, Link } from '@heroui/react';
import NextLink from 'next/link';
import { LockKeyhole, LogIn, Mail, User } from 'lucide-react';

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-foreground text-background flex w-100 flex-col items-center gap-5 rounded-xl p-10'
    >
      <h1 className='text-3xl font-semibold'>Sign Up</h1>
      <Input
        {...register('username')}
        placeholder='Username'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.username?.message || ''}
        isInvalid={!!errors.username}
        startContent={<User />}
      />
      <Input
        {...register('email')}
        placeholder='Email'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.email?.message || ''}
        isInvalid={!!errors.email}
        startContent={<Mail />}
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
      <Input
        {...register('confirmPassword')}
        placeholder='Confirm Password'
        type='password'
        variant='bordered'
        color='primary'
        size='lg'
        errorMessage={errors.confirmPassword?.message || ''}
        isInvalid={!!errors.confirmPassword}
        startContent={<LockKeyhole />}
      />

      <Button className='w-full' color='primary' type='submit' size='lg'>
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
