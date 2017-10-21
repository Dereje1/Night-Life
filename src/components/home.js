"use strict"//displays a curated list of all the polls / user created polls
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router'; //need for redirecting user
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row,InputGroup,FormControl,Button,FormGroup,MenuItem,Image} from 'react-bootstrap'

import {fetchVenues} from '../actions/venueaction'
import Singlevenue from './singlevenue'
class Home extends React.Component{
  constructor(props){
    super(props)

    this.state={
      going:[]
    }
  }
  componentDidMount(){
    console.log("CDM Mounted for home")
    this.props.fetchVenues()
  }
  goingToVenue(venueID){
    if(!this.props.user.user.authenticated){
      window.location =  "/auth/twitter"
    }
    else{
      if(this.state.going.includes(venueID)){
        let copyofGoing=[...this.state.going]
        let indexOfDeletion = copyofGoing.findIndex(function(v){
          return (v===venueID)
        })
        this.setState({
          going: [...copyofGoing.slice(0,indexOfDeletion),...copyofGoing.slice(indexOfDeletion+1)]
        })
      }
      else{
        this.setState({
          going: [...this.state.going,venueID]
        })
      }
    }
  }
  venueQuery(e){//goest to a specific poll clicked by user
    event.preventDefault()
    let venueSearch = findDOMNode(this.refs.venueQ).value.trim()
    if(e.keyCode===13){
      this.props.fetchVenues(venueSearch)
      window.scroll(0, 600) 
    }
  }
  parseVenues(){
    let businesses = this.props.venues.venues[0].yelpFullResult.businesses
    let venuNames = businesses.map((b,idx)=>{
      let totalGoing = this.state.going.includes(b.id) ? 1 : 0
      return (<Singlevenue key={idx} business={b} onClick={this.goingToVenue.bind(this)} going={totalGoing}/>)
    })
    return(venuNames)
  }
  render(){
    //let city =
    if(this.props.venues.venues.length){
      if(!this.props.venues.venues[0].error){
        return (
          <Grid >
            <Row style={{"marginTop":"25px","marginBottom":"25px"}}>
              <Image className="frontpic center-block" src="/images/Wall_Food.jpg" rounded />
            </Row>
            <Row>
            <FormGroup>
              <InputGroup >
                <FormControl ref="venueQ"  type="text" onKeyDown={(e)=>this.venueQuery(e)} placeholder="enter address, neighborhood, city, state or zip, optional country"/>
                <Button componentClass={InputGroup.Button} type="submit" onClick ={()=>this.props.fetchVenues('byipforced')}><span style={{"fontSize":"20px"}} className="fa fa-location-arrow"/> </Button>
              </InputGroup>
            </FormGroup>
            </Row>
            <Row className="text-center">
              <h1>Showing Venues in {this.props.venues.venues[0].yelpFullResult.businesses[0].location.city}</h1>
            </Row>
            <Row className="display-flex" style={{"marginTop":"25px","marginBottom":"25px"}}>
                {this.parseVenues()}
            </Row>
          </Grid>
        )
      }
     else{
       return (
         <Grid >
           <Row style={{"marginTop":"25px"}}>
               <h1 className="text-center">No Venues Found for {this.props.venues.venues[0].originalRequest}</h1>
               <Button block className="btn btn-danger" onClick={()=>this.props.fetchVenues()}>Go Back</Button>
           </Row>
         </Grid>
       )
     }

    }
    else{
      return (
        <Grid >
          <Row style={{"marginTop":"25px"}}>
              <h1 className="text-center">Loading Venues....</h1>
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
