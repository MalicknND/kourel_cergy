import { Skeleton } from "@/components/ui/skeleton";

export function MembersSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

