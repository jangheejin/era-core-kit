// apps/site/src/components/sections/ContactForm.tsx
// REACT COMPONENT FOR CONTACTFORM
'use client';
import { ImageFigure } from './ImageFigure';

export type ContactFormProps = {
  heading?: string;
  description?: string;
}

export function ContactForm({ 
  heading = "Get in touch", 
  description = "Fill out the contact form below",
//}: ContactFormProps) {
}: { 
  heading?: string; 
  description?: string; 
}) {
    return (
      <section className="c-section" id="contact">
        <div className="c-container c-stack">
          <h2 className="type-h2">{heading}</h2>
          {description && <p className="type-body">{description}</p>}

          <form className="contact-form">
{/* TO DO: wire up real fields here later */}
            <div className="field-group">
              <label className="type-label" htmlFor="name">
                  Name
                  <input type="text" placeholder="Name" id="name" name="name" required />
              </label>
              <label className="type-label" htmlFor="email">
                  Email
                  <input type="email" placeholder="Email" id="email" name="email" required />
              </label>
              <label className="type-label" htmlFor="message">
                  Message
                  <textarea placeholder="Message" id="message" name="message" required></textarea>
              </label>
              <button type="submit" className="c-button">Send</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  