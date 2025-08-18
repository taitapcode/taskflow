'use client';
import createClient from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../_store/user';
import { useEffect, useState } from 'react';
import AvatarUploader from '../_components/AvatarUploader';
import { Card, CardBody, Input, Button } from '@heroui/react';

export default function AccountPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useUserStore();
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function extractAvatarPath(publicUrl: string | null | undefined) {
    try {
      if (!publicUrl) return null;
      const url = new URL(publicUrl);
      const marker = '/storage/v1/object/public/avatar/';
      const idx = url.pathname.indexOf(marker);
      if (idx === -1) return null;
      const path = url.pathname.slice(idx + marker.length);
      return decodeURIComponent(path);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    setDisplayName(user?.displayName ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
  }, [user?.displayName, user?.avatarUrl]);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const oldPath = extractAvatarPath(user?.avatarUrl);
    const newPath = extractAvatarPath(avatarUrl);
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName, avatar_url: avatarUrl || null },
    });
    if (error) {
      setMessage(`Failed to save: ${error.message}`);
    } else if (data.user) {
      updateUser(data.user);
      setMessage('Profile saved.');
      if (oldPath && oldPath !== newPath) {
        const { error: removeErr } = await supabase.storage.from('avatar').remove([oldPath]);
        if (removeErr) console.error('Failed to remove old avatar:', removeErr.message);
      }
    }
    setSaving(false);
  }

  async function handleLogOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) console.error('Error logging out:', error.message);
    logout();
    router.push('/');
  }

  return (
    <div className='flex min-h-full min-w-full items-start justify-center'>
      <div className='flex w-full max-w-2xl flex-col gap-6'>
        <header>
          <h1 className='text-2xl font-semibold'>Account</h1>
          <p className='text-foreground-500 mt-1 text-sm'>Manage your profile and session</p>
        </header>

        <Card shadow='sm' className='bg-content2 border border-neutral-700'>
          <CardBody className='p-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <AvatarUploader
                onUploaded={(url) => {
                  setAvatarUrl(url);
                  setMessage('Avatar updated.');
                }}
              />
            </div>
            <div>
              <Input label='Email' value={user?.email ?? ''} isDisabled variant='bordered' />
            </div>
            <div>
              <Input
                label='Display Name'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Your name'
                variant='bordered'
              />
            </div>
            <div className='sm:col-span-2'>
              <Input
                label='Avatar URL'
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder='https://…'
                variant='bordered'
              />
            </div>
            </div>
            {message && <p className='text-foreground-500 mt-3 text-xs'>{message}</p>}
            <div className='mt-4 flex gap-2'>
              <Button onPress={saveProfile} isDisabled={saving} color='primary' className='text-background'>
                {saving ? 'Saving…' : 'Save Profile'}
              </Button>
              <Button variant='bordered' onPress={handleLogOut}>
                Logout
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
