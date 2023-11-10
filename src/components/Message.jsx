import React, { useContext, useEffect, useRef , useState} from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import axios from "axios";
import { db } from "../firebase";
import { collection,query,where,getDoc,getDocs } from "firebase/firestore";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(''); // Default target language is English
  const l_g = 'trnsl.1.1.20220612T202253Z.cab691f2078c1756.6fe44730d88a05cbe5e2ee861b2c156688ff81ce'; // Your Yandex Cloud API key
  const [time_stamp, setTimestamp] = useState(null);

  // message.date is a Firebase timestamp convert to time ago format
  useEffect(() => {
    const dateObject = message.date.toDate();
    const formattedDate = dateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    setTimestamp(formattedDate);
  }
  ,[message.date]);

  
  
 
  useEffect(() => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", currentUser.uid));
  
    getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const language = firstDoc.data().language;
  
          axios
            .get(
              `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${l_g}&text=${message.text}&lang=${language}`
            )
            .then((res) => {
              setTranslatedText(res.data.text[0]);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  }, [message.text, currentUser.uid]);
  


   

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  


  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        {/* <i>{time_stamp}</i> */}
      </div>
      <div className="messageContent">
        <p>{translatedText}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;