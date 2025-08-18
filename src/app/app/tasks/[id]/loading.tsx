export default function Loading() {
  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header>
        <div className='h-7 w-64 animate-pulse rounded-md bg-content3' />
        <div className='mt-2 h-4 w-40 animate-pulse rounded-md bg-content3' />
      </header>

      <div className='rounded-md border border-neutral-700 bg-content2 p-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <div className='h-3 w-16 animate-pulse rounded bg-content3' />
            <div className='h-5 w-28 animate-pulse rounded bg-content3' />
          </div>
          <div className='space-y-2'>
            <div className='h-3 w-16 animate-pulse rounded bg-content3' />
            <div className='h-5 w-20 animate-pulse rounded bg-content3' />
          </div>
          <div className='space-y-2'>
            <div className='h-3 w-16 animate-pulse rounded bg-content3' />
            <div className='h-5 w-36 animate-pulse rounded bg-content3' />
          </div>
          <div className='space-y-2'>
            <div className='h-3 w-16 animate-pulse rounded bg-content3' />
            <div className='h-5 w-40 animate-pulse rounded bg-content3' />
          </div>
          <div className='sm:col-span-2 space-y-2'>
            <div className='h-3 w-20 animate-pulse rounded bg-content3' />
            <div className='h-16 w-full animate-pulse rounded bg-content3' />
          </div>
        </div>
      </div>
    </main>
  );
}

