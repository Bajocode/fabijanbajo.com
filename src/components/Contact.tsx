import React from 'react';

const Contact: React.FC = () => (
  <section className="resume-section p-4 p-lg-5 text-center" id="contact">
    <div className="my-auto">
      <form
        className="contact-form d-flex flex-column align-items-center"
        action="https://formspree.io/youremail@mail.com"
        method="POST"
      >
        <div className="form-group w-80">
          <input type="name" className="form-control" placeholder="Name" name="name" required />
        </div>
        <div className="form-group w-80">
          <input type="email" className="form-control" placeholder="Email" name="name" required />
        </div>
        <div className="form-group w-80">
          <textarea
            className="form-control"
            placeholder="Message"
            rows={7}
            name="name"
            required
            defaultValue=""
          />
        </div>
        <button type="submit" className="btn btn-submit btn-primary w-80">Submit</button>
      </form>
    </div>
  </section>
);

export default Contact;
