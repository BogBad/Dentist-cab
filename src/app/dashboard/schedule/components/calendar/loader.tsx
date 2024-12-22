import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/30">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}
