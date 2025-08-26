import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Skeleton className="h-16 w-16 rounded-full mb-6" />
      <p className="text-lg text-gray-700">Loading, please wait...</p>
    </main>
  );
}
