"use client";

import NextLink from 'next/link';
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation';
import React from 'react';

export function Link(props: React.ComponentProps<typeof NextLink>) {
  return <NextLink {...props} />;
}

export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  return useNextParams() as unknown as T;
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}
