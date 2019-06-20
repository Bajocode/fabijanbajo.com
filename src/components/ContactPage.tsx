import React from 'react';

const ContactPage: React.FC = () => (
  <div>
    <form
      className="contact-form"
      action="https://formspree.io/youremail@mail.com"
      method="POST"
    >
      <div className="form-group">
        <input type="name" className="form-control" placeholder="Name" name="name" required />
      </div>
      <div className="form-group">
        <input type="email" className="form-control" placeholder="Email" name="name" required />
      </div>
      <div className="form-group">
        <textarea
          className="form-control"
          placeholder="Message"
          rows={7}
          name="name"
          required
          defaultValue=""
        />
      </div>
      <button type="submit" className="btn btn-submit btn-primary">Submit</button>
    </form>
  </div>
);

export default ContactPage;
