import * as React from 'react';
import { z } from 'zod';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  ErrorComponentProps,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import '@/lib/api-init'; // Initialize API clients before any components render
import { Providers } from '@/lib/providers/providers';
import { MODALS } from '@/lib/constants';
import { ErrorPage, DefaultCatchBoundary, AuthModals, PlanModals } from '@/lib/components';
import appCss from '@/styles.css?url';

// Define search params schema for the root route
const rootSearchSchema = z.object({
  m: z
    .enum([
      MODALS.LOGIN,
      MODALS.SIGNUP,
      MODALS.RESET_PASSWORD,
      MODALS.UPDATE_PASSWORD,
      MODALS.CONFIRM_EMAIL,
      MODALS.VERIFY_EMAIL,
      MODALS.GENERATE_PLAN,
    ])
    .optional(),
  next: z.string().optional(),
  from: z.string().optional(),
  token: z.string().optional(), // For password reset / verification
  email: z.string().optional(), // For confirmation notice
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'BeneFit - Your Ultimate Fitness Companion',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  validateSearch: (search: unknown) => rootSearchSchema.parse(search),
  errorComponent: (props: ErrorComponentProps) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => (
    <RootDocument>
      <ErrorPage
        title="Page Not Found"
        message="We couldn't find the page you're looking for. It might have been moved or deleted."
        severity="warning"
        showBackButton
        backHref="/"
      />
    </RootDocument>
  ),
  component: RootComponent,
});

function RootComponent() {
  const { m, email } = Route.useSearch();

  return (
    <RootDocument>
      <Outlet />
      <AuthModals activeModal={m} email={email} />
      <PlanModals activeModal={m} />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          {children}
          <Scripts />
          <TanStackRouterDevtools position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
