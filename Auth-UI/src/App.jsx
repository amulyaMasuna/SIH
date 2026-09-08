import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("");

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div className="page">
        <div className="login-box">

          <h1>LegalLens</h1>
          {/* <p className="subtitle">Your Legal Assistance Platform</p> */}

          <h2>Login</h2>

          <label>Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select your role</option>
            <option value="person">Person</option>
            <option value="field">Field Officer</option>
            <option value="metrology">Metrology Officer</option>
          </select>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <button
            className="login-button"
            onClick={() => {
              if (!role) {
                alert("Please select your role");
                return;
              }

              setPage(role);
            }}
          >
            Login
          </button>

          <button
            className="link-button"
            onClick={() => setPage("forgot")}
          >
            Forgot Password?
          </button>

          <p className="signup-text">
            Don't have an account?
            <button
              className="signup-button"
              onClick={() => setPage("signup")}
            >
              Sign Up
            </button>
          </p>

        </div>
      </div>
    );
  }

  // SIGN UP PAGE
  if (page === "signup") {
    return (
      <div className="page">
        <div className="login-box">

          <h1>LegalLens</h1>
          <h2>Create Account</h2>

          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label>Role</label>
          <select>
            <option value="">Select your role</option>
            <option value="person">Person</option>
            <option value="field">Field Officer</option>
            <option value="metrology">Metrology Officer</option>
          </select>

          <label>Password</label>
          <input type="password" placeholder="Create a password" />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
          />

          <button className="login-button">
            Create Account
          </button>

          <button
            className="link-button"
            onClick={() => setPage("login")}
          >
            Back to Login
          </button>

        </div>
      </div>
    );
  }

  // FORGOT PASSWORD PAGE
  if (page === "forgot") {
    return (
      <div className="page">
        <div className="login-box">

          <h1>LegalLens</h1>
          <h2>Forgot Password?</h2>

          <p>
            Enter your registered email and we'll help you
            reset your password.
          </p>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <button className="login-button">
            Send Reset Link
          </button>

          <button
            className="link-button"
            onClick={() => setPage("login")}
          >
            Back to Login
          </button>

        </div>
      </div>
    );
  }

  // PERSON DASHBOARD
  if (page === "person") {
    return (
      <Dashboard
        title="Person Dashboard"
        description="Welcome to your LegalLens dashboard."
        setPage={setPage}
      />
    );
  }

  // FIELD OFFICER DASHBOARD
  if (page === "field") {
    return (
      <Dashboard
        title="Field Officer Dashboard"
        description="Welcome, Field Officer."
        setPage={setPage}
      />
    );
  }

  // METROLOGY OFFICER DASHBOARD
  if (page === "metrology") {
    return (
      <Dashboard
        title="Metrology Officer Dashboard"
        description="Welcome, Metrology Officer."
        setPage={setPage}
      />
    );
  }
}

// DASHBOARD COMPONENT
function Dashboard({ title, description, setPage }) {
  return (
    <div className="dashboard">

      <nav>
        <h2>LegalLens</h2>

        <button onClick={() => setPage("login")}>
          Logout
        </button>
      </nav>

      <main>
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="dashboard-card">
          <h3>LegalLens</h3>
          <p>
            Your personalized legal assistance dashboard.
          </p>
        </div>
      </main>

    </div>
  );
}

export default App;