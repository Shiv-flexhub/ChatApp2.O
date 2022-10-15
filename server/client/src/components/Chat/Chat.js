import React,{ useState, useEffect } from "react";
import io from 'socket.io-client'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom';
import './Chat.css'
import InforBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from '../TextContainer/TextContainer'

let socket;

const Chat = ()=>{

    let location = useLocation();

    const [ name, setName ] = useState("");
    const [ room, setRoom ] = useState("");
    const [ users, setUsers ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ messages, setMessages ] = useState([]);

    const ENDPOINT = 'http://localhost:5000';

    useEffect(()=>{
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT)
        console.log(socket);

        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},(error)=>{
            if(error){
                alert(error);
            }
        });

        return ()=>{
            socket.emit('disconnect');
            socket.off();
        }

    },[ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
          });

          socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    },[])

    //function for sending messages
    const sendMessage = ( event ) => {
        event.preventDefault();

        if( message ){
            socket.emit('sendMessage', message, () => setMessage('') )
        }
    }

    console.log( users );

    return(
        <div className="outerContainer">
            <div className="container">
                <InforBar room = { room }/>
                <Messages messages={messages} name={name}/>
                <Input message = { message } setMessage = { setMessage } sendMessage = { sendMessage }/>
            </div>
                <TextContainer users={users}/>
        </div>
    )
}

export default Chat;