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
    <section className="c-section" id="contact">
      <div className="c-container c-stack">
        <h2 className="type-h2">{heading}</h2>
        {description && <p className="type-body">{description}</p>}
        <div className="contact-form-wrapper">
          <form className="contact-form">
            {/* TO DO: wire up real fields here later */}
            <div className="field-group">
              <div className="field field--half">
                <label className="type-label" htmlFor="name">
                  <div className="field-label">Name: </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </label>
              </div>

              <div className="field field--half">
                <label className="type-label" htmlFor="email">
                  <div className="field-label">Email: </div>
                  <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    name="email"
                    required
                  />
                </label>
              </div>

              <div className="field field--full">
                <label className="type-label" htmlFor="message">
                  <div className="field-label">Message: </div>
                  <textarea
                    placeholder="Message"
                    id="message"
                    name="message"
                    required
                  ></textarea>
                </label>
              </div>
            </div>

            <button type="submit" className="c-button">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
