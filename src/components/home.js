"use strict"//displays a curated list of all the polls / user created polls
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router'; //need for redirecting user
import {Grid,Col,Row,ListGroup,ListGroupItem} from 'react-bootstrap'

class Home extends React.Component{
  constructor(props){
    super(props)

  }
  componentDidMount(){
    console.log("CDM Mounted for home")

  }
  goToPoll(poll){//goest to a specific poll clicked by user
  }

  render(){
    return (
      <Grid >
        <Row style={{"marginTop":"25px"}}>
          <Col xs={8} xsOffset={2}>
            <h1>Home</h1>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state){
  return state
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
          getPolls:getPolls
          }, dispatch)
}
export default (Home)
