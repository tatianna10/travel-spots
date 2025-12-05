import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router";
import Header from "../header/Header";

export default function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        repass: "",
    });

    const [error, setError] = useState("");

    function onChange(e) {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
        setError(""); 
    }

    async function onSubmit(e) {
        e.preventDefault();

        // ===== Email validation =====
        const emailPattern = /.+@.+\..+/;
        if (!emailPattern.test(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // ===== Required fields =====
        if (!form.email.trim() || !form.password.trim()) {
            setError("Email and password are required!");
            return;
        }

        // ===== Password length =====
        if (form.password.length < 4) {
            setError("Password must be at least 4 characters long.");
            return;
        }

        // ===== Password match =====
        if (form.password !== form.repass) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await register({
                email: form.email.trim(),
                fullName: form.fullName.trim(),
                password: form.password.trim(),
            });

            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="register-page">
            <Header />

            <div className="register-center">
                <div className="register-card">
                    <h2 className="register-title">Create Account</h2>

                    <form onSubmit={onSubmit} className="register-form">

                        <label className="label" htmlFor="fullName">
                            Full Name (optional)
                        </label>
                        <input
                            className="input"
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="John Travolta"
                            value={form.fullName}
                            onChange={onChange}
                        />

                        <label className="label" htmlFor="email">Email</label>
                        <input
                            className="input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={onChange}
                            required
                        />

                        <label className="label" htmlFor="register-password">
                            Password
                        </label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            id="register-password"
                            placeholder="Password"
                            value={form.password}
                            onChange={onChange}
                            required
                        />

                        <label className="label" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            className="input"
                            type="password"
                            name="repass"
                            id="confirm-password"
                            placeholder="Repeat Password"
                            value={form.repass}
                            onChange={onChange}
                            required
                        />

                        <button className="register-btn" type="submit">
                            Register
                        </button>
                    </form>

                    {error && <p className="form-error">{error}</p>}

                    <p className="login-text">
                        Already have an account?{" "}
                        <Link className="login-link" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
