import React, { useState } from 'react';
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import imageCompression from "browser-image-compression";


const Register = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userCountry, setUserCountry] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    {err && <span>Something went wrong.</span>}
    const navigate = useNavigate();  // Ensure you have this line

    // fetch('https://geolocation-db.com/json/')
    //     .then(res => res.json())
    //     .then(data => {
    //         setUserCountry(data.country_name)
    //     })
    //     .catch(err => setErr(true));

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const language = e.target[3].value;
        const file = e.target[4].files[0];

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 500,
            useWebWorker: true
        }

        const compressedFile = await imageCompression(file, options);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                (error) => {
                    setErr(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user, {
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
                            country: 'N/A',
                        });

                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    });
                }
            );

            setSelectedImage(URL.createObjectURL(file)); // Set selected image URL

        } catch (err) {
            setLoading(false);
            setErr(true);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>CodBenders Chat</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <input required type='text' placeholder='Username' />
                    <input required type='email' placeholder='Email' />
                    <input required type='password' placeholder='Password' />
                    <select required>
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
                    <option value='tr'>Turkish</option>
                    <option value='pt'>Portuguese</option>
                </select>
                    <input
                        required
                        type='file'
                        style={{ display: 'none' }}
                        id='file'
                        onChange={(e) => {
                            if (e.target.files.length > 0) {
                                setSelectedImage(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />
                    <label htmlFor='file'>
                        <img src={selectedImage || Add} alt='addAvatar' />
                        <span>Upload your avatar</span>
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Please wait...' : 'Sign up'}</button>
                        {err && <span>Something went wrong.</span>}
                </form>
                <p>Already registered? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
