'use client';
import { Button } from '@heroui/react';
import { logOut } from './actions';

export default function AccountPage() {
  return (
    <>
      <Button onPress={logOut}>Logout</Button>
    </>
  );
}
