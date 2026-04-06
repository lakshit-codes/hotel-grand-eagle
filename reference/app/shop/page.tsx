import { Suspense } from 'react';
import Component from '@/components/pages/CategoryPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Shop...</div>}>
      <Component />
    </Suspense>
  );
}
