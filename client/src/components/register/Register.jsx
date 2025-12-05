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

        if (e.target.name === "repass") {
            const confirm = e.target;
            if (confirm.value !== form.password) {
                confirm.setCustomValidity("Passwords do not match!");
            } else {
                confirm.setCustomValidity("");
            }
        }
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (form.password.length < 4) {
            e.target.password.setCustomValidity("Password must be at least 4 characters long!");
            e.target.password.reportValidity();
            return;
        } else {
            e.target.password.setCustomValidity("");
        }

        try {
            await register({
                email: form.email.trim(),
                fullName: form.fullName.trim(),
                password: form.password.trim(),
            });

            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="register-page">
            <Header />

            <div className="register-center">
                <div className="register-card">
                    <h2 className="register-title">Create Account</h2>

                    <form onSubmit={onSubmit} className="register-form">

                        <label className="label">Full Name (optional)</label>
                        <input
                            className="input"
                            type="text"
                            name="fullName"
                            placeholder="John Travolta"
                            value={form.fullName}
                            onChange={onChange}
                        />

                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="email"
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
                            placeholder="Password"
                            minLength={4}                       
                            title="Password must be at least 4 characters long"
                            value={form.password}
                            onChange={onChange}
                            required
                        />

                        <label className="label">Confirm Password</label>
                        <input
                            className="input"
                            type="password"
                            name="repass"
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
