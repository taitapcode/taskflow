export default function Loading() {
  return (
    <main className='flex min-h-full flex-col gap-6'>
      <header className='flex items-end justify-between'>
        <div className='bg-content3 h-7 w-40 animate-pulse rounded-md' />
      </header>

      {/* Summary cards skeleton */}
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='bg-content2 h-20 animate-pulse rounded-md border border-neutral-700 p-4'
          >
            <div className='flex items-center gap-3'>
              <div className='bg-content3 h-9 w-9 rounded-md' />
              <div className='flex flex-1 flex-col gap-2'>
                <div className='bg-content3 h-3 w-24 rounded' />
                <div className='bg-content3 h-5 w-12 rounded' />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Recent tasks skeleton */}
        <div className='lg:col-span-2'>
          <div className='bg-content2 animate-pulse rounded-md border border-neutral-700 p-4'>
            <div className='bg-content3 mb-3 h-5 w-32 rounded' />
            <div className='space-y-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='grid grid-cols-5 items-center gap-3'>
                  <div className='bg-content3 h-4 w-40 rounded' />
                  <div className='bg-content3 h-4 w-28 rounded' />
                  <div className='bg-content3 h-4 w-20 rounded' />
                  <div className='bg-content3 h-4 w-20 rounded' />
                  <div className='bg-content3 h-4 w-24 rounded' />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Upcoming events skeleton */}
        <div className='lg:col-span-1'>
          <div className='bg-content2 animate-pulse rounded-md border border-neutral-700 p-4'>
            <div className='bg-content3 mb-3 h-5 w-40 rounded' />
            <div className='flex flex-col gap-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='space-y-2'>
                  <div className='bg-content3 h-4 w-48 rounded' />
                  <div className='flex items-center gap-2'>
                    <div className='bg-content3 h-3 w-20 rounded' />
                    <div className='bg-content3 h-5 w-20 rounded' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
