import React from "react"
import "semantic-ui-css/semantic.min.css"
import './App.css';

import {Container} from "semantic-ui-react"
import {BrowserRouter as Router, Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Menu from "./components/Menu"
import {AuthProvider} from "./context/auth"
import AuthRoute from "./util/AuthRoute"
import SinglePost from "./pages/SinglePost"

function App() {
  return (
    <AuthProvider>
<Router>
<Container>
<Menu/>
<Route exact path="/" component={Home}/>
<AuthRoute exact path="/login" component={Login}/>
<AuthRoute exact path="/register" component={Register}/>
<Route exact path="/posts/:postId" component={SinglePost}/>
</Container>
</Router>
</AuthProvider>
  );
}

export default App;
