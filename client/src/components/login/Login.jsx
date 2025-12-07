import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router";
import Header from "../header/Header.jsx";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });

    function onChange(e) {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formElement = e.target;
        const passwordInput = formElement.querySelector('input[name="password"]');

        try {
            await login({
                email: form.email.trim(),
                password: form.password.trim(),
            });

            navigate("/");
        } catch (err) {
            passwordInput.setCustomValidity("Invalid email or password!");
            passwordInput.reportValidity();

            passwordInput.addEventListener("input", () =>
                passwordInput.setCustomValidity("")
            );
        }
    }

    return (
        <div className="login-page">
            <Header />

            <div className="login-center">
                <div className="login-card">
                    <h2 className="login-title">Login</h2>

                    <form onSubmit={onSubmit} className="login-form">

                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="text"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={onChange}
                            required
                        />

                        <label className="label">Password</label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            required
                            minLength={4}
                        />

                        <button className="login-btn" type="submit">
                            Login
                        </button>
                    </form>

                    <p className="register-text">
                        Don't have an account?
                        <Link className="register-link" to="/register"> Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
