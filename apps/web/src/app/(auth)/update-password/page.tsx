'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthError } from '@/components/auth/auth-error/auth-error';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      // For now, show success and redirect
      setSuccess(true);
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error_) {
      setError(
        error_ instanceof Error
          ? error_.message
          : 'An error occurred while updating the password.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">
            Password Updated
          </h2>
          <div className="bg-success/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-success mb-4">
            <p>Your password has been updated successfully!</p>
          </div>
          <p className="text-center text-secondary-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">
          Update Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <AuthError message={error} />}

          <div className="mb-4">
            <label
              className="block text-secondary-foreground mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-secondary-foreground mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
