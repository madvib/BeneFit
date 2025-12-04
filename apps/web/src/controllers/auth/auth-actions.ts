'use server';

import { authUseCases } from '@/providers/auth-use-cases';
import { revalidatePath } from 'next/cache';
import { getRequestContext } from './get-request-context';
import { EmailAddress, Password } from '@bene/shared-domain';

export interface LoginFormState {
  success?: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
}

export async function loginAction(
  _previous: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = EmailAddress.create(formData.get('email') as string);
  const password = Password.create(formData.get('password') as string);
  const next = (formData.get('next') as string) || '/user/activities';

  const result = await authUseCases.loginUseCase().then((uc) =>
    uc.execute({
      email: email.value,
      password: password.value,
    }),
  );
  if (result.isSuccess) {
    // Successful login - redirect to the next page or default
    revalidatePath('/', 'layout');
    return {
      success: true,
      redirectUrl: next,
    };
  } else {
    return {
      success: false,
      error: result.error?.message || 'Login failed',
    };
  }
}

export interface SignupFormState {
  success?: boolean;
  message?: string;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

export async function signupAction(
  _prev: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const email = EmailAddress.create(formData.get('email') as string);
  const password = Password.create(formData.get('password') as string);
  const confirmPassword = Password.create(formData.get('confirmPassword') as string);
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;

  if (email.isFailure) {
    return {
      success: false,
      error: email.error.message,
    };
  }
  if (password.isFailure) {
    return {
      success: false,
      error: password.error.message,
    };
  }

  // Check if passwords match
  if (!password.value.equals(confirmPassword.value)) {
    return {
      success: false,
      error: 'Passwords do not match',
    };
  }

  // Validate that name and surname are provided
  if (!name || !surname) {
    return {
      success: false,
      error: 'Both first name and last name are required',
    };
  }

  const fullName = `${name} ${surname}`;

  const result = await authUseCases.signupUseCase().then((uc) =>
    uc.execute({
      email: email.value,
      password: password.value,
      name: fullName,
    }),
  );

  if (result.isSuccess) {
    revalidatePath('/', 'layout');
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      error: result.error?.message || 'Signup failed',
    };
  }
}

export interface ResetPasswordFormState {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function resetPasswordAction(
  _prev: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const email = formData.get('email') as string;

  const result = await authUseCases.resetPasswordUseCase().then((uc) =>
    uc.execute({
      email: email,
    }),
  );

  return result.isSuccess
    ? {
        success: true,
        message: 'Password reset instructions sent to your email',
      }
    : {
        success: false,
        error: result.error?.message || 'Password reset failed',
      };
}

export interface UpdatePasswordFormState {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function updatePasswordAction(
  _prev: UpdatePasswordFormState,
  formData: FormData,
): Promise<UpdatePasswordFormState> {
  const password = Password.create(formData.get('password') as string);
  const confirmPassword = Password.create(formData.get('confirmPassword') as string);

  if (password.isFailure) {
    return {
      success: false,
      error: password.error.message,
    };
  }

  // Check if passwords match
  if (!password.value.equals(confirmPassword.value)) {
    return {
      success: false,
      error: 'Passwords do not match',
    };
  }

  // In a real implementation, we would update the password here
  // For now, we'll return success as the original page did
  return {
    success: true,
    message: 'Password updated successfully',
  };
}

export async function signOutAction(
  _prev: boolean,
  _formData: FormData,
): Promise<boolean> {
  const requestContext = await getRequestContext();
  const result = await authUseCases
    .signOutUseCase()
    .then((uc) => uc.execute(requestContext));

  return result.isSuccess;
}
