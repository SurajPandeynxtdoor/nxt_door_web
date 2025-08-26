"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Alert variant="destructive" className="max-w-md mb-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred. Please try again."}
        </AlertDescription>
      </Alert>
      <Button variant="destructive" onClick={() => reset()}>
        Try Again
      </Button>
    </main>
  );
}
