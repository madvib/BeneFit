export default function Loading() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">BeneFit Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert insights, tips, and guides to help you on your fitness journey.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="animate-pulse flex space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-secondary rounded-xl overflow-hidden shadow-md"
          >
            <div className="h-48 bg-muted animate-pulse"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-6 bg-muted rounded animate-pulse mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-20 bg-muted rounded animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
