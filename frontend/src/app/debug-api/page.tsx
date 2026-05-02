"use client";
import React, { useEffect, useState } from 'react';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8005/syllabus/subjects')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => setError(e.toString()));
  }, []);

  return (
    <div className="p-20">
      <h1>Debug connectivity</h1>
      <p>Target: http://localhost:8005/syllabus/subjects</p>
      {error && <div className="text-red-500">Error: {error}</div>}
      {data && <div className="text-green-500">Data: {JSON.stringify(data)}</div>}
      {!data && !error && <div>Loading...</div>}
    </div>
  );
}
