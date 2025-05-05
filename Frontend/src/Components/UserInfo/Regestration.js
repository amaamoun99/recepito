import React, { useState } from "react";
import './Regestration.css';
import img1 from '../../Images/1Girl.jpg';
import img2 from '../../Images/2Girl.jpg';
import img3 from '../../Images/1Girl.jpg';
import img4 from '../../Images/2Girl.jpg';
import img5 from '../../Images/2Girl.jpg';
import img6 from '../../Images/1Girl.jpg';

const imageOptions = [img1, img2, img3, img4, img5, img6];

const Regestration = ({ add, goToLogin }) => {
    const [form, setForm] = useState({
        Username: "",
        Email: "",
        Password: "",
    });
    const [avatar, setAvatar] = useState(imageOptions[0]);
    const [errors, setErrors] = useState({});

    const inputhandler = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.Username.trim()) newErrors.Username = "Username is required.";
        if (!form.Email.trim()) {
            newErrors.Email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
            newErrors.Email = "Invalid email format.";
        }

        if (!form.Password) {
            newErrors.Password = "Password is required.";
        } else if (form.Password.length < 6) {
            newErrors.Password = "Password must be at least 6 characters.";
        } else if (!/[A-Z]/.test(form.Password)) {
            newErrors.Password = "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(form.Password)) {
            newErrors.Password = "Password must contain at least one number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveinfo = (e) => {
        e.preventDefault();
        if (validate()) {
            add({ ...form, avatar, posts: [] });
            goToLogin();
        }
    };

    return (
        <div className="registration-bg">
            <header className="registration-header">
                <h1>RECEPITO</h1>
                <p className="registration-slogan">Cook. Share. Inspire</p>
            </header>
            <form onSubmit={saveinfo} noValidate>
                <input
                    id="Username"
                    type="text"
                    placeholder="Username"
                    value={form.Username}
                    onChange={inputhandler}
                />
                {errors.Username && <p className="error-text">{errors.Username}</p>}

                <input
                    id="Email"
                    type="email"
                    placeholder="Email"
                    value={form.Email}
                    onChange={inputhandler}
                />
                {errors.Email && <p className="error-text">{errors.Email}</p>}

                <input
                    id="Password"
                    type="password"
                    placeholder="Password"
                    value={form.Password}
                    onChange={inputhandler}
                />
                {errors.Password && <p className="error-text">{errors.Password}</p>}

                <div className="avatar-label">Choose your avatar</div>
                <div className="avatar-options">
                    {imageOptions.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`avatar-option-${idx}`}
                            className={`avatar-option${avatar === img ? " selected" : ""}`}
                            onClick={() => setAvatar(img)}
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: "50%",
                                objectFit: "cover",
                                margin: 4,
                                cursor: "pointer"
                            }}
                        />
                    ))}
                </div>

                <button className="profile-done" type="submit">Submit</button>
            </form>

            <p className="login-switch">
                Already have an account?{" "}
                <span className="login-link" onClick={goToLogin}>Login</span>
            </p>
        </div>
    );
};

export default Regestration;
