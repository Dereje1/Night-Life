"use strict"//navigation bar self explanatory
import React from 'react'
import {connect} from 'react-redux'
import {Nav, NavItem, Navbar, Button} from 'react-bootstrap';

class Menu extends React.Component{
  conditionalNav(){
    let autenticationStatus = this.props.user.user.authenticated
    if(autenticationStatus){//the way response comes of user is in string I can change this to JSON response in the future
      return(
        <Nav pullRight>
          <NavItem eventKey={3} href="/">Home</NavItem>
          <NavItem eventKey={4} href="/logout">Logout @ {this.props.user.user.username}</NavItem>
        </Nav>
      )
    }
    else{
      return (
        <Nav pullRight>
          <NavItem eventKey={2} href="/">Home</NavItem>
          <NavItem eventKey={3} href="/auth/twitter">Sign In With Twitter</NavItem>
        </Nav>
      )
    }
  }

  render(){
    let bcolor = (this.props.user.user.authenticated) ? "red" : "white"
    return(
    <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" style={{"color":bcolor}}>Night Life Coordination App</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/about">About</NavItem>
          </Nav>
          {this.conditionalNav()}
        </Navbar.Collapse>
    </Navbar>
    )
  }
}
function mapStateToProps(state){
  return state
}
//only reads store state does not write to it
export default connect(mapStateToProps)(Menu)
