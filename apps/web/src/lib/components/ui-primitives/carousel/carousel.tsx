''
import { typography } from '@/lib/components';
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const carouselVariants = cva('relative w-full');

const dotVariants = cva(
  'h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      active: {
        true: 'w-8 bg-primary',
        false: 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50',
      },
    },
  },
);

interface CarouselProps extends VariantProps<typeof carouselVariants> {
  children: React.ReactNode[];
  className?: string;
  autoHeight?: boolean;
}

/**
 * Carousel component for Storybook story consolidation.
 * Displays multiple states/variants in a single story with navigation.
 *
 * NOTE: This is a Storybook-specific component for documentation purposes.
 * Not intended for production use.
 */
export function Carousel({ children, className, autoHeight = true }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div className={carouselVariants({ className })}>
      {/* Slide Container */}
      <div className={autoHeight ? 'h-auto overflow-hidden' : 'h-full overflow-hidden'}>
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              style={{ minWidth: '100%' }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - positioned at bottom to avoid content overlap */}
      {totalSlides > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            className="rounded-full bg-background p-2 shadow-md transition-all hover:scale-110 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Dot Indicators */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={dotVariants({ active: index === currentIndex })}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
          
          <button
            onClick={goToNext}
            className="rounded-full bg-background p-2 shadow-md transition-all hover:scale-110 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Slide Counter */}
      {totalSlides > 1 && (
        <div className={`mt-2 ${typography.muted} text-center`}>
          {currentIndex + 1} / {totalSlides}
        </div>
      )}
    </div>
  );
}
