import createClient from '@/lib/supabase/browser';
import { useUserStore } from '../_store/user';
import { useState } from 'react';
import { Button } from '@/app/_components/UI';

type Props = {
  onUploaded?: (publicUrl: string) => void;
};

export default function AvatarUploader({ onUploaded }: Props) {
  const { user, updateUser } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const oldUrl = user.avatarUrl || null;
      const oldPath = extractAvatarPath(oldUrl);

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext) ? ext : 'jpg';
      const path = `${user.id}/${Date.now()}.${safeExt}`;

      const { error: uploadError } = await supabase.storage.from('avatar').upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined,
      });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatar').getPublicUrl(path);

      const { data: updated, error: updateErr } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (updateErr) throw updateErr;
      if (updated.user) updateUser(updated.user);
      onUploaded?.(publicUrl);

      if (oldPath && oldPath !== path) {
        const { error: removeErr } = await supabase.storage.from('avatar').remove([oldPath]);
        if (removeErr) {
          // Non-fatal cleanup failure
          console.error('Failed to remove old avatar:', removeErr.message);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload avatar.';
      setError(message);
    } finally {
      setUploading(false);
      // Clear the input so the same file can be re-selected if needed
      e.target.value = '';
    }
  }

  const inputId = 'avatar-input';
  return (
    <div>
      <label className='mb-1 block text-sm'>Avatar</label>
      <div className='flex items-center gap-3'>
        {user?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt='Current avatar'
            className='h-12 w-12 rounded-full border border-neutral-700 object-cover'
          />
        ) : (
          <div className='h-12 w-12 rounded-full border border-dashed border-neutral-700' />
        )}
        <input
          id={inputId}
          type='file'
          accept='image/*'
          onChange={onFileChange}
          disabled={uploading}
          className='sr-only'
        />
        <Button variant='bordered' onClick={() => document.getElementById(inputId)?.click()}>
          {uploading ? 'Uploading…' : 'Upload new'}
        </Button>
      </div>
      {error && <p className='mt-2 text-xs text-red-500'>{error}</p>}
    </div>
  );
}
