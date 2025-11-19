// apps/site/src/components/sections/ContactForm.tsx
// REACT COMPONENT FOR CONTACTFORM
'use client';//component with actual state or interactivity, needs this
import { ImageFigure } from './ImageFigure';

export type ContactFormProps = {
  heading?: string;
  description?: string;
}

export function ContactForm({ heading = "Get in touch", description = "Fill out the contact form below",}: { heading?: string; description?: string; }) {
    return (
      <section className="c-section" id="contact">
        <div className="c-container c-stack">
        <h2 className="type-h2">{heading}</h2>
          <form>
            <label>
                Name
                <input type="text" placeholder="Name" required />
            </label>
            <label>
                Email
                <input type="email" placeholder="Email" required />
            </label>
            <label>
                Message
                <textarea placeholder="Message" required></textarea>
            </label>
            <button type="submit">Send</button>
          </form>
        </div>
      </section>
    );
  }
  