export default function Loading() {
  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header className='flex items-end justify-between'>
        <div>
          <div className='bg-content3 h-7 w-40 animate-pulse rounded-md' />
          <div className='bg-content3 mt-2 h-4 w-60 animate-pulse rounded-md' />
        </div>
      </header>

      <div className='flex flex-col gap-6'>
        {[0, 1].map((i) => (
          <div key={i} className='bg-content2 rounded-md border border-neutral-700 p-4'>
            <div className='bg-content3 mb-3 h-5 w-40 animate-pulse rounded' />
            <div className='space-y-3'>
              <div className='grid grid-cols-6 gap-3'>
                <div className='bg-content3 col-span-2 h-4 animate-pulse rounded' />
                <div className='bg-content3 col-span-1 h-4 animate-pulse rounded' />
                <div className='bg-content3 col-span-1 h-4 animate-pulse rounded' />
                <div className='bg-content3 col-span-1 h-4 animate-pulse rounded' />
                <div className='bg-content3 col-span-1 h-4 animate-pulse rounded' />
              </div>
              {[...Array(4)].map((_, r) => (
                <div key={r} className='grid grid-cols-6 items-center gap-3'>
                  <div className='bg-content3 col-span-2 h-5 animate-pulse rounded' />
                  <div className='bg-content3 col-span-1 h-6 animate-pulse rounded' />
                  <div className='bg-content3 col-span-1 h-6 animate-pulse rounded' />
                  <div className='bg-content3 col-span-1 h-5 animate-pulse rounded' />
                  <div className='bg-content3 col-span-1 h-5 animate-pulse rounded' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
