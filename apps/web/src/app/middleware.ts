import { getSession } from '@/controllers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // const session = await getSession();
  // if (!session.data?.isAuthenticated) {
  //   redirect('/login');
  // }
  console.log('Middleware triggered for path:', request.nextUrl.pathname);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
