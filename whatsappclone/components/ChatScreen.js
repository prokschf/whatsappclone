import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from "styled-components"
import { auth, db } from '../firebase';
import MoreVertIcon from "@material-ui/icons/MoreVert"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import MicIcon from "@material-ui/icons/Mic"
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import firebase from "firebase/compat/app"
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from "timeago-react";

function ChatScreen( { chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const endOfMessageRef = useRef(null);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(db
        .collection("chats")
        .doc(router.query.id)
        .collection("message")
        .orderBy("timestamp", "asc"));
    const [recipientSnapshot] = useCollection(db
        .collection("users")
        .where("email", "==", getRecipientEmail(chat.user, user)));


    const showMessages = () => {        
        if (messagesSnapshot) {
            console.log(messagesSnapshot.docs.length);
            return messagesSnapshot.docs.map(message => (
                <Message 
                    key={message.id} 
                    user={message.data().user}
                    message={{ 
                        ...message.data(),
                        timestammp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        }
    }

    const scrollToBottom = () => {
        /*endOfMessagesRef.const.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })*/
    }

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })
        
        db.collection("chats").doc(router.query.id).collection("message").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        })
        
        setInput("");
        scrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.user, user);
    return (
        <Container>
            <Header>
                    { recipient ? (
                        <Avatar src={recipient?.photoURL}/>
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : "Unavailable"}
                        </p>
                    ) : (
                        <p>Loading Last active ...</p>
                    )}

                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                messages
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input}  onChange={e => setInput(e.target.value)}/>
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>
                    Send Message
                </button>
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Container = styled.div`

`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;

`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 0px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;
const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;
