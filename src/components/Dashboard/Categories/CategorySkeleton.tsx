import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="bg-white overflow-hidden">
          <div className="h-48 relative bg-gray-100">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-5 w-16" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
