import { SpotlightCard, typography } from '@/lib/components';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    content:
      'This platform completely transformed my fitness journey. The personalized plans helped me reach my goals faster than ever before.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Marathon Runner',
    content:
      'The analytics and tracking features are incredibly detailed. I finally achieved my personal best thanks to the insights from this app.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Newbie to Fitness',
    content:
      'As someone who was intimidated by fitness, this platform made it approachable and fun. The community support has been amazing.',
    rating: 4,
  },
];

export default function AboutTestimonials() {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className={typography.h2}>What Our Users Say</h2>
          <p className={`${typography.p} text-muted-foreground mx-auto mt-4 max-w-2xl`}>
            Don&apos;t just take our word for it - hear from real users who transformed their
            lives
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <SpotlightCard key={testimonial.id} className="p-6">
              <div className="mb-4 flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className={`${typography.p} mb-6 italic`}>&quot;{testimonial.content}&quot;</p>
              <div>
                <p className={typography.large}>{testimonial.name}</p>
                <p className={`${typography.small} text-muted-foreground`}>{testimonial.role}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
