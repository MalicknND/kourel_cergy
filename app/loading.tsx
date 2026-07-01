import { MembersSkeleton } from "@/components/members-skeleton";

export default function Loading() {
  return (
    <main className="min-h-svh bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-12 max-w-lg rounded bg-muted" />
          <div className="h-16 max-w-3xl rounded bg-muted" />
        </div>
        <MembersSkeleton />
      </div>
    </main>
  );
}

