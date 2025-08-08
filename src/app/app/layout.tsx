import Sidebar from './_components/Sidebar';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className='bg-content1 flex h-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-700 md:flex-row'>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
