'use client';
import React from 'react';

export type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({ children, ...props }: FormProps) {
  return (
    <form {...props}>
      {children}
    </form>
  );
}

