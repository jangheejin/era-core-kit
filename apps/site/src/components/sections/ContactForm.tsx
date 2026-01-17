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
        
        <h2 className="type-h2">{heading}</h2>
        {description && <p className="type-body">{description}</p>}
        <div className="contact-form-wrapper">
          <form className="contact-form" method="post" action="#">
            {/* TO DO: wire up real fields here later (Demo-only right now.) */}
            <div className="field-group">
              <div className="field">
                <label className="type-label field-label" htmlFor="name">
                  Name
                </label>
                  <input
                    className="input"
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                  />
              </div>

              <div className="field">
                <label className="type-label field-label" htmlFor="email">
                  Email
                </label>
                    <input
                      className="input"
                      type="email"
                      placeholder="you@company.com"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                    />
              </div>

              <div className="field field--full">
                <label className="type-label field-label" htmlFor="message">
                  Message
                 </label>
                    <textarea
                      className="input"
                      placeholder="What can we help with?"
                      id="message"
                      name="message"
                      required
                    />
                  <p className="type-small contact-form__fineprint">
                    Please don't include sensitive information in this message.
                  </p>
              </div>
            </div>

            <div className="contact-form__actions">
              <button type="submit" className="c-button">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
