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

    const inputhandler = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const saveinfo = (e) => {
        e.preventDefault();
        if (!form.Username || !form.Email || !form.Password) {
            alert("Please fill in all fields.");
            return;
        }
        add({ ...form, avatar, posts: [] });
        goToLogin(); // Redirect to login after registration
    };

    return (
        <div className="registration-bg">
            <header className="registration-header">
                <h1>RECEPITO</h1>
                <p className="registration-slogan">Cook. Share. Inspire</p>
            </header>
            <form>
                <input
                    id="Username"
                    type="text"
                    placeholder="Username"
                    value={form.Username}
                    onChange={inputhandler}
                />
                <input
                    id="Email"
                    type="email"
                    placeholder="Email"
                    value={form.Email}
                    onChange={inputhandler}
                />
                <input
                    id="Password"
                    type="password"
                    placeholder="Password"
                    value={form.Password}
                    onChange={inputhandler}
                />
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
                <button className="profile-done" onClick={saveinfo}>Submit</button>
            </form>
            <p className="login-switch">
                Already have an account?{" "}
                <span className="login-link" onClick={goToLogin}>Login</span>
            </p>
        </div>
    );
};

export default Regestration;