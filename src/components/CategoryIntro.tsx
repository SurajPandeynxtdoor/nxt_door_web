"use client";

interface CategoryIntroProps {
  description?: string;
}

export default function CategoryIntro({ description }: CategoryIntroProps) {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {description && (
          <p className="mt-3 text-base sm:text-lg md:text-xl text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-150">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
