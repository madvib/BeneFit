"use client";

import { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email) {
      // In a real app, you would submit to your newsletter service
      console.log("Subscribing email:", email);
      setSubmitted(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-secondary p-8 rounded-xl shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
        Get the latest fitness tips, workout routines, and nutrition advice
        delivered straight to your inbox.
      </p>

      {submitted ? (
        <div className="max-w-md mx-auto p-4 bg-green-100 text-green-800 rounded-lg">
          Thank you for subscribing! Please check your email to confirm.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="flex-grow p-3 rounded-l-lg border border-muted bg-background"
            required
          />
          <button type="submit" className="btn btn-primary rounded-l-none">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
