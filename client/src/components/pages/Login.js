import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Modules/Login.module.css';
import axios from "axios";

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/user/login",
            JSON.stringify({ email, password }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        ).then(res => {
            if (res.data.status === "ok") {
                window.localStorage.setItem("User", JSON.stringify(res.data.data));
                setAuth(res.data.data);
                setEmail('');
                setPwd('');
                navigate(from, { replace: true });
            } else {
                setErrMsg("Incorrect Password or Invalid Email");
            }
        }).catch(
            (err) => console.log("err", err)
        );
        //if (accessToken) {
            
        //}
    }

    return (

        <div className={styles.card}>
            <img src="https://i.ibb.co/XD62Rsw/Black-logo-no-background.png"  className={styles.login_logo} alt = "test"></img>
            <form onSubmit={handleSubmit} style = {{marginRight: "0"}} className={styles.login_card}>
				<h1 style = {{color: "#607EAA"}}>Sign In</h1>
                <input
                    type="text"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={password}
                    required
                />
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
                <button style = {{minWidth : "40%"}}>Sign In</button>
				<p>
                <span>
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
            </form>
            
        </div>

    )
}

export default Login
// import React from 'react';
// import styles from './Modules/Login.module.css';

// function Login() {
//     return (
//         <>
//             <div className={styles.card}>
//                 <img src="https://i.ibb.co/XD62Rsw/Black-logo-no-background.png"  className={styles.login_logo} alt = "test"></img>
//                 <form style = {{marginRight: "0"}} className={styles.login_card}>
//                     <h1 style = {{color: "#607EAA"}}>Login</h1>
//                     <input type="text" placeholder="eg.js@gmail.com"></input>
//                     <input type="password" name="password"></input>
//                     <button style = {{minWidth : "40%"}} type="submit" value="Submit"><h2>Login</h2></button>
//                     <a href="/register">Register</a>
//                 </form>
//             </div>
//         </>
//     )
// }