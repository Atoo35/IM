import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NotFound from './404'
import Home from './pages/Home'
import Login from './pages/login'
import Register from './pages/register'

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/login' exact component={Login}/>
                <Route path='/register' exact component={Register}/>
                <Route path='/' exact component={Home}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    )
}