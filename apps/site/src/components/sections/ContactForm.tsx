// apps/site/src/components/ContactForm.tsx

// Keep ContactForm as a client-only component.
// Not imported or exported anywhere in packages/blocks

"use client";

import { useState } from "react";

export type ContactFormProps = {
  heading?: string;
  description?: string;
};

export function ContactForm({
  heading = "Get in touch",
  description = "Fill out the contact form below",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="c-section contact" id="contact">
      <div className="c-container c-stack">
        <p></p>
        <p></p>
        
        <h2 className="type-h2">{heading}</h2>
        {description && <p className="type-body">{description}</p>}
        <div className="contact-form-wrapper">
			<form className="contact-form" onSubmit={onSubmit}>
				<div className="field-group">
					<div className="field">
						<label className="type-label" htmlFor="name">
							<div className="field-label">Name</div>
							<input
								type="text"
								id="name"
								name="name"
								autoComplete="name"
								placeholder="Your name"
								required
							/>
						</label>
					</div>

					<div className="field">
						<label className="type-label" htmlFor="email">
							<div className="field-label">Email</div>
							<input
								type="email"
								id="email"
								name="email"
								autoComplete="email"
								inputMode="email"
								placeholder="you@domain.com"
								required
							/>
						</label>
					</div>

					<div className="field field--message">
						<label className="type-label" htmlFor="message">
							<div className="field-label">Message</div>
							<textarea
								id="message"
								name="message"
								placeholder="What do you want to talk about?"
								rows={6}
								required
							/>
						</label>
					</div>
				</div>

				<button type="submit" className="c-button">
					Send
				</button>
				{submitted ? (
					<p className="form-status form-status--ok" role="status">
						Submitted (demo). This form doesn’t send yet.
					</p>
				) : (
					<p className="contact-form__helper">Demo form: this doesn’t send yet.</p>
				)}
			</form>
      </div>
      </div>
    </section>
  );
}
