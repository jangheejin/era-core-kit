// apps/site/src/components/ContactForm.tsx

// Keep ContactForm as a client-only component.
// Not imported or exported anywhere in packages/blocks

"use client";

export type ContactFormProps = {
  heading?: string;
  description?: string;
};

export function ContactForm({
  heading = "Get in touch",
  description = "Fill out the contact form below",
}: ContactFormProps) {
  return (
    <section className="c-section contact" id="contact">
      <div className="c-container c-stack">
        <p></p>
        <p></p>
        
        <div className="contact__inner">
          <div className="contact__copy c-stack">
            <h2 className="type-h2">{heading}</h2>
            {description && <p className="type-body">{description}</p>}
            <p className="type-small type-muted">
              Fields marked <span aria-hidden="true">*</span> are required.
            </p>
          </div>

          <div className="contact__card">
            <form className="contact-form" aria-label="Contact form">
              <div className="contact-form__grid">
                <div className="contact-field">
                  <label className="contact-field__label" htmlFor="name">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    className="input contact-field__input"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label className="contact-field__label" htmlFor="email">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    className="input contact-field__input"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@domain.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </div>

                <div className="contact-field contact-field--full">
                  <label className="contact-field__label" htmlFor="message">
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    className="input contact-field__input"
                    id="message"
                    name="message"
                    placeholder="What are you working on, and how can we help?"
                    autoComplete="off"
                    required
                    rows={7}
                  />
                </div>
              </div>

              <div className="contact-form__actions">
                <button type="submit" className="c-button c-button--alt2">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
