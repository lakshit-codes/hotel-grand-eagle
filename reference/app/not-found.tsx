import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-[5%] py-32 text-center">
      <h1 className="text-4xl font-black mb-4">Page Not Found</h1>
      <p className="text-muted font-bold mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="bg-primary text-white px-8 py-4 rounded-full font-black uppercase tracking-wider inline-flex">
        Back Home
      </Link>
    </div>
  );
}
