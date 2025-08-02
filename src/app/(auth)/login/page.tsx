'use client';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '../schema';
import { Form, Input, Button, Link } from '@heroui/react';
import NextLink from 'next/link';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-content1 text-content1-foreground flex w-90 flex-col items-center gap-5 rounded-2xl p-5'
    >
      <h1 className='text-3xl'>Login</h1>
      <Input
        {...register('username')}
        color='primary'
        label='Email'
        labelPlacement='outside'
        placeholder='Enter your username'
      />
      <Input
        {...register('password')}
        color='primary'
        label='Password'
        type='password'
        labelPlacement='outside'
        placeholder='Enter your password'
      />
      <Button className='w-full py-5' color='primary' type='submit'>
        Log in
      </Button>
      <p>
        Or you don&apos;t have account yet?{' '}
        <Link href='/signup' as={NextLink} underline='hover' className='text-blue-500'>
          Sign up
        </Link>
      </p>
    </Form>
  );
}
