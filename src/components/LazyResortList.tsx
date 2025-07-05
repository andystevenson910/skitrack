import { useState, useEffect } from "react";

interface LazyResortListProps {
  resorts: string[];
  onResortClick: (resort: string) => void;
}

export default function LazyResortList({ resorts, onResortClick }: LazyResortListProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resorts.map((resort, index) => (
        <div
          key={index}
          className="cursor-pointer bg-[#8ec4f4] hover:bg-[#7cacd5] text-white rounded transition-all duration-200 p-8 text-center font-medium"
          onClick={() => onResortClick(resort)}
        >
          {resort}
        </div>
      ))}
    </div>
  );
}