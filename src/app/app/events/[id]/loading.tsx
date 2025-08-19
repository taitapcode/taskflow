export default function Loading() {
  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header>
        <div className='bg-content3 h-7 w-64 animate-pulse rounded-md' />
        <div className='bg-content3 mt-2 h-4 w-40 animate-pulse rounded-md' />
      </header>

      <div className='bg-content2 rounded-md border border-neutral-700 p-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <div className='bg-content3 h-3 w-16 animate-pulse rounded' />
            <div className='bg-content3 h-5 w-36 animate-pulse rounded' />
          </div>
          <div className='space-y-2'>
            <div className='bg-content3 h-3 w-16 animate-pulse rounded' />
            <div className='bg-content3 h-5 w-24 animate-pulse rounded' />
          </div>
          <div className='space-y-2'>
            <div className='bg-content3 h-3 w-16 animate-pulse rounded' />
            <div className='bg-content3 h-5 w-40 animate-pulse rounded' />
          </div>
          <div className='space-y-2 sm:col-span-2'>
            <div className='bg-content3 h-3 w-20 animate-pulse rounded' />
            <div className='bg-content3 h-16 w-full animate-pulse rounded' />
          </div>
        </div>
      </div>
    </main>
  );
}
