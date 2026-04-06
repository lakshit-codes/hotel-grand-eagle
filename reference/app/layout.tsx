import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import LayoutWrapper from '@/components/LayoutWrapper';
import StoreProvider from '@/app/StoreProvider';
import { AnnotatorPlugin } from '@/components/annotationPlugin';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ChunkErrorRecovery from '@/components/ChunkErrorRecovery';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'NestCraft Interiors',
  description: 'Design-led interiors and furniture storefront built with Next.js.',
  icons: {
    icon: '/assets/Image/favicon.svg', // 👈 favicon added
    shortcut: '/assets/Image/favicon.svg',
    apple: '/assets/Image/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <ChunkErrorRecovery />
        <StoreProvider>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            {/* <AnnotatorPlugin /> */}
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
