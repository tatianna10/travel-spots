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

    function onChange(e) {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formElement = e.target;

        const emailInput = formElement.querySelector('input[name="email"]');
        const passwordInput = formElement.querySelector('input[name="password"]');
        const repassInput = formElement.querySelector('input[name="repass"]');

        emailInput.setCustomValidity("");
        passwordInput.setCustomValidity("");
        repassInput.setCustomValidity("");

        if (form.password.length < 4) {
            passwordInput.setCustomValidity("Password must be at least 4 characters long");
            passwordInput.reportValidity();
            passwordInput.addEventListener("input", () => passwordInput.setCustomValidity(""));
            return;
        }

        if (form.password !== form.repass) {
            repassInput.setCustomValidity("Passwords do not match!");
            repassInput.reportValidity();
            repassInput.addEventListener("input", () => repassInput.setCustomValidity(""));
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
            emailInput.setCustomValidity(err.message || "Registration failed!");
            emailInput.reportValidity();
            emailInput.addEventListener("input", () => emailInput.setCustomValidity(""));
        }
    }

    return (
        <div className="register-page">
            <Header />

            <div className="register-center">
                <div className="register-card">
                    <h2 className="register-title">Create Account</h2>

                    <form onSubmit={onSubmit} className="register-form">

                        <label className="label" htmlFor="fullName">Full Name (optional)</label>
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
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={onChange}
                            required
                            pattern="^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$"
                            title="Enter a valid email like name@example.com"
                        />

                        <label className="label" htmlFor="register-password">Password</label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            id="register-password"
                            placeholder="Password"

                            value={form.password}
                            onChange={onChange}
                            required
                            minLength={4}
                            title="Password must be at least 4 characters long"
                        />

                        <label className="label" htmlFor="confirm-password">Confirm Password</label>
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

                    <p className="login-text">
                        Already have an account?
                        <Link className="login-link" to="/login"> Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
