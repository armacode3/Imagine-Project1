'use client';
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button className="button" onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}