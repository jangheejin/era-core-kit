// apps/site/src/components/ContactForm.tsx
'use client';

export type ContactFormProps = {
  heading?: string;
  description?: string;
};

export function ContactForm({
  heading = 'Get in touch',
  description = 'Fill out the contact form below',
}: ContactFormProps) {
  return (
    <section className="c-section" id="contact">
      <div className="c-container c-stack">
        <h2 className="type-h2">{heading}</h2>
        {description && <p className="type-body">{description}</p>}

        <form>
          {/* your fields go here */}
          <div className="field-group">
            <label className="type-label">
              Name
              <input type="text" name="name" />
            </label>
          </div>

          <button type="submit" className="c-button">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
