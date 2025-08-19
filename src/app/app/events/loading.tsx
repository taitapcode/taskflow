export default function Loading() {
  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header className='flex items-end justify-between'>
        <div>
          <div className='h-7 w-40 animate-pulse rounded-md bg-content3' />
          <div className='mt-2 h-4 w-60 animate-pulse rounded-md bg-content3' />
        </div>
      </header>

      <div className='flex flex-col gap-6'>
        {[0, 1].map((i) => (
          <div key={i} className='rounded-md border border-neutral-700 bg-content2 p-4'>
            <div className='mb-3 h-5 w-40 animate-pulse rounded bg-content3' />
            <div className='space-y-3'>
              <div className='grid grid-cols-5 gap-3'>
                <div className='col-span-2 h-4 animate-pulse rounded bg-content3' />
                <div className='col-span-1 h-4 animate-pulse rounded bg-content3' />
                <div className='col-span-1 h-4 animate-pulse rounded bg-content3' />
                <div className='col-span-1 h-4 animate-pulse rounded bg-content3' />
              </div>
              {[...Array(4)].map((_, r) => (
                <div key={r} className='grid grid-cols-5 items-center gap-3'>
                  <div className='col-span-2 h-5 animate-pulse rounded bg-content3' />
                  <div className='col-span-1 h-5 animate-pulse rounded bg-content3' />
                  <div className='col-span-1 h-6 animate-pulse rounded bg-content3' />
                  <div className='col-span-1 h-5 animate-pulse rounded bg-content3' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

