import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from "styled-components"
import { auth, db } from '../firebase';
import MoreVertIcon from "@material-ui/icons/MoreVert"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import MicIcon from "@material-ui/icons/Mic"
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';

function ChatScreen( { chat, messages}) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(db
        .collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc"));
    const showMessages = () => {
        if (messagesSnapshot) {
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

    return (
        <Container>
            <Header>
                <Avatar />
                <HeaderInformation>
                    <h3>Recipient Email</h3>
                    <p>Last seen ...</p>

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
                {showMessages()}
                <EndOfMessage/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon/>
                <Input />
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

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    border-bottom: 1px solid whitesmoke;

`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;
const EndOfMessage = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;