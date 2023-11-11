import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";


const Chat = () => {
    const { data } = useContext(ChatContext);

    const handleBack = () => {
        // display .sidebar as block
        const sidebar = document.querySelector(".sidebar");
        sidebar.style.display = "block";

        // display .chat as none
        const chat = document.querySelector(".chat");
        chat.style.display = "none";
    }

    
    return (
        // display chat div as none if there is no user selected
        <div className="chat">
            <div className="chatInfo" onClick={handleBack}>
                <span>{data.user?.displayName}</span>
                <div className="chatIcons">
                    {/* <img src={Cam} alt="" />
                    <img src={Add} alt="" />
                    <img src={More} alt="" /> */}
                   <button>Go back</button>
                </div>

                <div className="backArrow">
                    <i className="fas fa-arrow-left"></i>
                </div>
            </div>
            <Messages />
            <Input />
            </div>
    )
}

export default Chat;