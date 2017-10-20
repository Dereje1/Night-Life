"use strict"//displays a curated list of all the polls / user created polls
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router'; //need for redirecting user
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row,InputGroup,FormControl,Button,FormGroup,MenuItem} from 'react-bootstrap'

import {fetchVenues} from '../actions/venueaction'
import Singlevenue from './singlevenue'
class Home extends React.Component{
  constructor(props){
    super(props)

  }
  componentDidMount(){
    console.log("CDM Mounted for home")
    this.props.fetchVenues()
  }
  venueQuery(e){//goest to a specific poll clicked by user
    event.preventDefault()
    let venueSearch = findDOMNode(this.refs.venueQ).value.trim()
    if(e.keyCode===13){
      this.props.fetchVenues(venueSearch)
    }
    if(e==="button"){
      console.log("Button clicked")
    }
  }
  parseVenues(){
    let businesses = this.props.venues.venues[0].yelpFullResult.businesses
    let venuNames = businesses.map((b,idx)=>{
      return (<Singlevenue key={idx} business={b}/>)
    })
    return(venuNames)
  }
  render(){
    //let city =
    if(this.props.venues.venues.length){
      if(!this.props.venues.venues[0].error){
        return (
          <Grid >
            <Row>
            <FormGroup>
              <InputGroup >
                <FormControl ref="venueQ"  type="text" onKeyDown={(e)=>this.venueQuery(e)}/>
                <Button componentClass={InputGroup.Button} type="submit" onClick ={()=>this.venueQuery("button")}><span style={{"fontSize":"20px"}} className="fa fa-location-arrow"/> </Button>
              </InputGroup>
            </FormGroup>
            </Row>
            <Row className="text-center">
              <h1>Venues in {this.props.venues.venues[0].yelpFullResult.businesses[0].location.city}</h1>
            </Row>
            <Row className="display-flex" style={{"marginTop":"25px"}}>
                {this.parseVenues()}
            </Row>
          </Grid>
        )
      }
     else{
       return (
         <Grid >
           <Row style={{"marginTop":"25px"}}>
             <Col xs={8} xsOffset={2}>
               <h1>No Venues Found for {this.props.venues.venues[0].originalRequest}</h1>
             </Col>
           </Row>
         </Grid>
       )
     }

    }
    else{
      return (
        <Grid >
          <Row style={{"marginTop":"25px"}}>
            <Col xs={8} xsOffset={2}>
              <h1>Loading Venues....</h1>
            </Col>
          </Row>
        </Grid>
      )
    }

  }
}

function mapStateToProps(state){
  return state
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
          fetchVenues:fetchVenues
          }, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Home)
