import React, { useState } from 'react';
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { db,auth,storage } from "../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import {useNavigate, Link} from "react-router-dom";

const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userCountry, setUserCountry] = useState('');

    // Fetch user country from IP address
    fetch('https://geolocation-db.com/json/')
    .then(res => res.json())
    .then(data => {
        setUserCountry(data.country_name)
     
    })
    .catch(err => setErr(true));
    

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const language = e.target[3].value;
        const file = e.target[4].files[0];


        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

        
            uploadTask.on(

            (error) => {
                setErr(true);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                await updateProfile(res.user,{
                    displayName,
                    photoURL: downloadURL,
                    phoneNumber: language,
                });
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName,
                    email,
                    photoURL: downloadURL,
                    language: language,
                    country: userCountry,
                  });

                  await setDoc(doc(db, "userChats", res.user.uid), {});
                  navigate("/");
               });
             }
            );

        } catch (err){
            setLoading(false);
            setErr(true);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
            <span className='logo'>Codebenders chat</span>
            <span className='title'>Register</span>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Username' />
                <input type='email' placeholder='Email' />
                <input type='password' placeholder='Password' />
                <select>
                    <option value=''>Select your language</option>
                    <option value='en'>English</option>
                    <option value='fr'>French</option>
                    <option value='es'>Spanish</option>
                    <option value='de'>German</option>
                    <option value='it'>Italian</option>
                    <option value='ru'>Russian</option>
                    <option value='zh'>Chinese</option>
                    <option value='ja'>Japanese</option>
                    <option value='ko'>Korean</option> 
                    <option value='ar'>Arabic</option> 
                    <option value='hi'>Hindi</option>
                    <option value='ur'>Urdu</option>
                </select>
                <input type='file' style={{display:"none"}} id="file" />
                <label htmlFor="file">
                    <img src={Add} alt="addAvatar" />
                    <span>Upload your avatar</span>
                </label>
                <button>Sign up</button>
                {err && <span>Something went wrong.</span>}
            </form>
            <p>Already registered? <Link to="/login">Login</Link></p>
            </div>

        </div>
    );
    };

export default Register;
