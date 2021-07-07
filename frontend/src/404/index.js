import React from 'react'
import { Container } from 'reactstrap'

export default function NotFound({history}){
    return(
        <Container>
            <h1>404</h1>
            <h2>Page you were looking for doesnt exist</h2>
        </Container>
    )
}