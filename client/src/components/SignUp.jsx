import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function SignUp() {

    function handleSubmit(e) {
    e.preventDefault();
    location.href = "/en";
  }

  return (
    <section className="auth_form">
      <div className="auth_intro">
        <h1>Create your account.</h1>
        <p>A little space for you, your people, and your moments.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="name">Name</label>

          <div className="input_box">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              id="name"
              placeholder="Your name"
              required
            />
          </div>
        </div>

        <div className="input_group">
          <label htmlFor="signup_email">Email</label>

          <div className="input_box">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="email"
              id="signup_email"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="input_group">
          <label htmlFor="signup_password">Password</label>

          <div className="input_box">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              id="signup_password"
              placeholder="Create a password"
              required
            />
          </div>
        </div>

        <button type="submit" className="auth_btn">
          Create account
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </form>

      <p className="auth_switch">
        Already have an account?
        <Link to="/auth/login"> Log in</Link>
      </p>
    </section>
  );
}

export default SignUp;