'use client';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupSchema } from './schema';
import createClient from '@/lib/supabase/browser';
import { Form, Input, Button, Card, CardBody } from '@/app/_components/UI';
import NextLink from 'next/link';
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn, Mail, User } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (error) setError('root', { type: 'manual', message: error.message });
    else if (user) router.push('/app');
  };

  return (
    <Card className='w-[520px] max-w-[92vw] backdrop-blur-md'>
      <CardBody className='p-6 sm:p-8'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold'>Create your account</h1>
          <p className='text-foreground-600 mt-1 text-sm'>Start organizing tasks with TaskFlow</p>
        </div>

        {errors.root && (
          <div className='mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-danger text-sm'>
            {errors.root.message}
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <Input
            {...register('displayName')}
            label='Display name'
            placeholder='e.g. Alex Johnson'
            variant='flat'
            size='lg'
            errorMessage={errors.displayName?.message || ''}
            isInvalid={!!errors.displayName}
            startContent={<User size={18} />}
          />

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
            placeholder='Create a password'
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

          <Input
            {...register('confirmPassword')}
            label='Confirm password'
            placeholder='Re-enter your password'
            type={showConfirm ? 'text' : 'password'}
            variant='flat'
            size='lg'
            errorMessage={errors.confirmPassword?.message || ''}
            isInvalid={!!errors.confirmPassword}
            startContent={<LockKeyhole size={18} />}
            endContent={
              <button
                type='button'
                className='text-foreground-600 hover:text-foreground'
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button className='mt-2 w-full' color='primary' type='submit' size='lg' disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className='animate-spin' size={18} /> : <LogIn size={18} />}
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </Form>

        <p className='text-foreground-600 mt-6 text-center text-sm'>
          Already have an account?{' '}
          <NextLink href='/login' className='text-primary hover:underline'>Log in</NextLink>
        </p>
      </CardBody>
    </Card>
  );
}
