import React, { useState } from 'react'
import api from '../../services/api'
import { Button, Container, Form, FormGroup, Alert, Input, Label } from 'reactstrap'
import './login.css'
import {convertToCamelCase} from '../../functions'

export default function Login({ history }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const handleSubmit = async evt => {
        evt.preventDefault()
        console.log(email, " ", password);
        const response = await api.post('/login', { email, password })
        let user = response.data.user || false
        let user_id = response.data.user_id || false
        try {
            if(user && user_id){
                console.log(user," ",user_id);
                localStorage.setItem('user_id', user_id)
                localStorage.setItem('user', user)
                history.push('/')
            }
            else{
                raiseError(response.data.message)
            }
        } catch (error) {
            raiseError('The server raised an error')
        }
    }

    function raiseError(message){

        message=convertToCamelCase(message)
        setError(true)
        setErrorMessage(message)

        setTimeout(()=>{
            setError(false)
            setErrorMessage("")
        },2000)
    }
    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="exampleEmail" className="mr-sm-2">Email</Label>
                        <Input type="email" name="email" id="email" placeholder="something@idk.cool" onChange={evt => setEmail(evt.target.value)} />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="examplePassword" className="mr-sm-2">Password</Label>
                        <Input type="password" name="password" id="password" placeholder="don't tell!" onChange={evt => setPassword(evt.target.value)} />
                    </FormGroup>
                </div>
                <FormGroup className='login-page'>
                    <Button color="primary" className="submit-btn">Submit</Button>
                    <Button color="info" onClick={()=>history.push('/register')}>Create Account</Button>
                </FormGroup>
            </Form>
            {errorMessage ? (
                <Alert color='danger'>{errorMessage}</Alert>
            ) : ""}
        </Container>
    )
}