export default function Loading() {
  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header>
        <div className='bg-content3 h-7 w-64 animate-pulse rounded-md' />
        <div className='bg-content3 mt-2 h-4 w-40 animate-pulse rounded-md' />
      </header>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='bg-content2 rounded-md border border-neutral-700 p-4'>
          <div className='space-y-3'>
            <div className='bg-content3 h-5 w-32 animate-pulse rounded' />
            <div className='space-y-2'>
              <div className='bg-content3 h-4 w-full animate-pulse rounded' />
              <div className='bg-content3 h-4 w-4/5 animate-pulse rounded' />
              <div className='bg-content3 h-4 w-3/5 animate-pulse rounded' />
            </div>
          </div>
        </div>
        <div className='bg-content2 rounded-md border border-neutral-700 p-4'>
          <div className='space-y-3'>
            <div className='bg-content3 h-5 w-32 animate-pulse rounded' />
            <div className='space-y-2'>
              <div className='bg-content3 h-4 w-full animate-pulse rounded' />
              <div className='bg-content3 h-4 w-4/5 animate-pulse rounded' />
              <div className='bg-content3 h-4 w-3/5 animate-pulse rounded' />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

