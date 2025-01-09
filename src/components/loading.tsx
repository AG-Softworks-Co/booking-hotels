// src/components/loading.tsx
import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex justify-center items-center h-20">
        <Loader2 className="animate-spin h-10 w-10"/>
    </div>
  );
}