import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Container, Form, Input } from 'reactstrap'
import socketio from "socket.io-client"
import api from '../../services/api'
import { convertToCamelCase } from '../../functions'
import moment from 'moment'
import $, { data as chat } from 'jquery';
import './home.css'
export default function Home({ history }) {
    const user_id = localStorage.getItem('user_id')
    const user = localStorage.getItem('user')
    const [searchUser, setSearchUser] = useState('')
    const [userList, setUserList] = useState([])
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [sendMessage, setSendMessage] = useState('')
    const [userSelected, setUserSelected] = useState(null)
    const [chatCache,setChatCache] = useState([])
    var lastUser = null
    useEffect(() => {
        if (!user_id || !user)
            history.push('/login')
    })
    const socket = useMemo(() =>
        socketio.connect("http://<YOUR_IP>:8000/", { query: { user: user_id } })
        , [user_id])

    useEffect(() => {
        socket.on('new_message', data => {
            if (userSelected === data.user_id) {
                $('#main-chat').append(`
                <div class='incoming-message'>
                    <div>
                        <p>${data.message}
                        </p>
                    </div>
                    <div>
                        <h6>
                            ${moment(data.date).format('LT')}
                        </h6>
                    </div>
                </div >`)
            }
            else {
                api.get(`/user/${data.email}`, { headers: { user } }).then(response => {
                    if(!searchExistence(response))
                    setUserList([...userList,response.data])
                    setChatCache([...chatCache,data])
                })
            }
        })

    }, [userSelected])

    useEffect(() => {
        console.log('user changed');
        console.log(chatCache);
        $("#main-chat").empty()
        chatCache.forEach(chat=>{
            $('#main-chat').append(`
                <div class='incoming-message'>
                    <div>
                        <p>${chat.message}
                        </p>
                    </div>
                    <div>
                        <h6>
                            ${moment(chat.date).format('LT')}
                        </h6>
                    </div>
                </div >`)
        })
        let dat = chatCache.filter(chat=>chat.user_id!==userSelected)
        setChatCache(dat)
    }, [userSelected])

    function searchExistence(response) {
        let flag=false
        userList.forEach(user => {
            if (user._id === response.data._id){
                flag=true
                return
            }
        });
        return flag
    }
    const handleSearch = async evt => {
        evt.preventDefault()
        try {
            let response = await api.get(`/user/${searchUser}`, { headers: { user } })
            if (userList.filter(user => user._id === response.data._id).length !== 0) {
                return raiseError('user is already in the list')
            }
            setUserList([...userList, response.data])
            setSearchUser('')
        } catch (error) {
            raiseError(error.response.data.message)
        }
        // 
    }
    function raiseError(message) {
        message = convertToCamelCase(message)
        setError(true)
        setErrorMessage(message)

        setTimeout(() => {
            setError(false)
            setErrorMessage("")
        }, 2000)
    }
    


    const handleSendMessage = async evt => {
        evt.preventDefault()
        if (sendMessage.length !== 0) {
            try {
                await api.post(`/message/${userSelected}`, { message: sendMessage }, { headers: { user } })
                $('#main-chat').append(` 
                                            <div class='outgoing-message'>
                                                <div>
                                                    <p>${sendMessage}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h6>
                                                        ${moment(Date.now()).format('LT')}
                                                    </h6>
                                                </div>
                                            </div >
                                        `)
                setSendMessage('')
            } catch (error) {
                raiseError(error.response.data.message)
            }
        }
    }

    return (
        <Container>
            <div className='main-div'>
                <div className="search-div">
                    <div className='search-input-group'>
                        <Input type="text" name="userSearch" id="userSearch" placeholder="Find a user" value={searchUser} onChange={(evt) => setSearchUser(evt.target.value)} />
                        <Button onClick={handleSearch} color='success'>Submit</Button>
                    </div>
                    {errorMessage ? <Alert color='danger'>{errorMessage}</Alert> : ""}
                </div>
                <div className='text-div'>
                    <div className='contacts'>
                        <ul className='events-list'>
                            {userList.map(user => (
                                <li key={user._id} onClick={evt => {setUserSelected(user._id)}}>{user.firstName} {user.lastName}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='chat'>
                        <div className='chat-window'>
                            {userSelected ? <div id="main-chat"></div> : ""}

                        </div>
                        {userSelected ? <div className='test'><div className='chat-input-group'>
                            <Input type='text' placeholder='type message' value={sendMessage} onChange={evt => setSendMessage(evt.target.value)}></Input>
                            <Button color='success' onClick={handleSendMessage}>Send</Button>
                        </div></div> : ""}
                    </div>
                </div>
            </div>
        </Container>
    )

}
