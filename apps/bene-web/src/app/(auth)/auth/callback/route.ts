import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/feed'

  console.log('Callback route hit with token_hash:', token_hash, 'and type:', type);
  
  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // For password recovery, redirect to update password page
      if (type === 'recovery') {
        redirect('/update-password')
      }
      // For signup confirmation, redirect to email confirmed page
      else if (type === 'signup') {
        redirect('/email-confirmed')
      }
      // For other OTP types, redirect to specified redirect URL or feed
      else {
        redirect(next)
      }
    }
    console.log(error?.message);
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}