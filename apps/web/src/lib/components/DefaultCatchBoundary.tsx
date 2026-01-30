import {
  Link,
  rootRouteId,
  useMatch,
  useRouter,type  ErrorComponentProps
} from '@tanstack/react-router'
import { ErrorPage } from './error/page-error'
import { Button } from './ui-primitives/buttons/button'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <ErrorPage
      title="Something went wrong"
      message={error.message || 'An unexpected error occurred.'}
      severity="error"
      onRefresh={() => {
        router.invalidate()
      }}
      showRefreshButton
      actions={
        <div className="flex gap-2">
           <Button
            onClick={() => router.invalidate()}
            variant="default"
           >
            Try Again
          </Button>
          {isRoot ? (
            <Link
              to="/"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
            >
              Home
            </Link>
          ) : (
             <Link
              to="/"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
            >
              Go Back
            </Link>
          )}
        </div>
      }
    />
  )
}
