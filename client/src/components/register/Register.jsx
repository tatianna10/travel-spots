import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        repass: "",
    });

    function onChange(e) {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (form.password !== form.repass) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await register({
                email: form.email,
                password: form.password,
            });

            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <h2 className="register-title">Create Account</h2>

                <form onSubmit={onSubmit} className="register-form">

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

                    <label className="label" htmlFor="register-password">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        id="register-password"
                        placeholder="Password"
                        value={form.password}
                        onChange={onChange}
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
                    />

                    <button className="register-btn" type="submit">Register</button>
                </form>

                <p className="login-text">
                    Already have an account?{" "}
                    <a className="login-link" href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}
