"use client";

import { useState, type FormEvent } from "react";

export function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Online submission is not yet wired up (Phase 2: Supabase). We
    // intentionally do not send this anywhere — see README "Future CMS".
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-gold bg-off-white p-6 text-sm text-charcoal">
        Thank you. Online enquiry submission is not yet active — please reach the school office
        directly using the contact details on this page in the meantime.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-charcoal">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1.5 w-full border border-border bg-paper px-4 py-2.5 text-sm text-charcoal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-charcoal">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1.5 w-full border border-border bg-paper px-4 py-2.5 text-sm text-charcoal focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-charcoal">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full border border-border bg-paper px-4 py-2.5 text-sm text-charcoal focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-charcoal">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1.5 w-full border border-border bg-paper px-4 py-2.5 text-sm text-charcoal focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-sm bg-navy px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase hover:bg-navy-dark"
      >
        Send Enquiry
      </button>
    </form>
  );
}
