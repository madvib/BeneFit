export default function OurStory() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      <div>
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-lg mb-4">
          BeneFit was founded in 2020 by a team of fitness enthusiasts and
          software engineers who were frustrated with the lack of
          comprehensive tools available to track and analyze fitness progress.
        </p>
        <p className="text-lg mb-4">
          We recognized that people were using multiple apps to track
          different aspects of their fitness journey, making it difficult to
          get a complete picture of their health and progress.
        </p>
        <p className="text-lg">
          Our solution brings together workout tracking, nutrition monitoring,
          progress analytics, and social features in one powerful, easy-to-use
          platform.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div className="bg-secondary rounded-xl p-8 w-full max-w-md">
          <div className="aspect-w-16 aspect-h-9 bg-background rounded-lg flex items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                Empower individuals to take control of their health and fitness journey
                through data-driven insights and community support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
