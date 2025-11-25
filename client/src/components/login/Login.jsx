import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    function onChange(e) {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        try {
            await login({
                email: form.email,
                password: form.password,
            });

            navigate("/"); // redirect after login
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Login</h2>

                <form onSubmit={onSubmit} className="login-form">
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={onChange}
                    />

                    <label className="label" htmlFor="password">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={onChange}
                    />

                    <button className="login-btn" type="submit">Login</button>
                </form>

                <p className="register-text">
                    Don't have an account?{" "}
                    <a className="register-link" href="/register">Register</a>
                </p>
            </div>
        </div>
    );
}
