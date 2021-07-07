import React, { useState } from 'react'
import api from '../../services/api'
import { Button, Container, Form, FormGroup, Alert, Input, Label } from 'reactstrap'
import {convertToCamelCase} from '../../functions'
export default function Register({ history }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async evt => {
        evt.preventDefault()
        if (email !== "" && password !== "" && firstName !== "" && lastName !== "") {
            try {
                const response = await api.post('/user/register', { firstName, lastName, email, password })
                if (response.data.message.toLowerCase() === "successfully created")
                    history.push('/')
                else
                    raiseError(response.data.message)                
            } catch (error) {
                raiseError(error.response.data.message)
            }
        }
        else{
            raiseError('Please enter all details')
        }
    }
    function raiseError(message) {
        message=convertToCamelCase(message)
        setError(true)
        setErrorMessage(message)

        setTimeout(() => {
            setError(false)
            setErrorMessage("")
        }, 2000)
    }
    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="exampleEmail" className="mr-sm-2">First Name</Label>
                        <Input type="text" name="firstName" id="firstName" placeholder="John" onChange={evt => setFirstName(evt.target.value)} />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="exampleEmail" className="mr-sm-2">Last Name</Label>
                        <Input type="text" name="lastName" id="lastName" placeholder="Doe" onChange={evt => setLastName(evt.target.value)} />
                    </FormGroup>
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
                    <Button color="primary" className="submit-btn">Register</Button>
                    <Button color="info" onClick={() => history.push('/register')}>Login Instead</Button>
                </FormGroup>
            </Form>
            {errorMessage ? (
                <Alert color='danger'>{errorMessage}</Alert>
            ) : ""}
        </Container>
    )
}