"use strict"//displays a curated list of all the polls / user created polls
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router'; //need for redirecting user
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row,InputGroup,FormControl,Button,FormGroup,OverlayTrigger,Image,Tooltip} from 'react-bootstrap'

import {fetchVenues} from '../actions/venueaction'
import {goToVenue,getGoers,cancelVenue} from '../actions/goingactions'
import Singlevenue from './singlevenue'
class Home extends React.Component{
  constructor(props){
    super(props)

    this.state={
      matched:false,
      userGoingYelpIDs:[],
      othersGoingYelpIDS:[]
    }
    this.matchGoersWithVenues=this.matchGoersWithVenues.bind(this)
  }
  componentDidMount(){
    console.log("CDM Mounted for home")
    this.props.fetchVenues()
    this.props.getGoers()

  }
  componentDidUpdate(prevProps, prevState) {
    if(!this.state.matched){this.matchGoersWithVenues()}
  }
  goingToVenue(venueID){
    if(!this.props.user.user.authenticated){
      window.location =  "/auth/twitter"
    }
    else{
      if(this.state.userGoingYelpIDs.includes(venueID)){
        let cancelInfo= {
              yelpID: venueID,
              userName: this.props.user.user.username
              }
        let copyofGoing=[...this.state.userGoingYelpIDs]
        let indexOfDeletion = copyofGoing.findIndex(function(v){
          return (v===venueID)
        })
        this.setState({
          userGoingYelpIDs: [...copyofGoing.slice(0,indexOfDeletion),...copyofGoing.slice(indexOfDeletion+1)]
        },this.props.cancelVenue(cancelInfo))
      }
      else{
        let addToGoers =  {
           yelpID: venueID,
           userName: this.props.user.user.username,
           timeStamp: Date.now()
        }
        this.setState({
          userGoingYelpIDs: [...this.state.userGoingYelpIDs,venueID]
        },this.props.goToVenue(addToGoers))
      }
    }
  }
  venueQuery(e){//goest to a specific venue clicked by user
    event.preventDefault()
    this.setState(
      {matched:false,
      userGoingYelpIDs:[],
      othersGoingYelpIDS:[]
      })
    let venueSearch = findDOMNode(this.refs.venueQ).value.trim()
    if(e.keyCode===13){
      this.props.fetchVenues(venueSearch)
      this.props.getGoers()
      window.scroll(0, window.innerWidth*0.43)
    }
  }
  matchGoersWithVenues(){
    if(!this.props.allGoers.allGoers.length){return}
    let allgoing = this.props.allGoers.allGoers[0]
    let currrentUser = this.props.user.user.username

    let venuesOfUserGoing = allgoing.filter(function(goers){
      return (goers.userName===currrentUser)
    })
    let userGoing = venuesOfUserGoing.map((v)=>{
      return v.yelpID
    })
    let venuesOfOthersGoing = allgoing.filter(function(goers){
      return (goers.userName!==currrentUser)
    })
    let othersGoing = venuesOfOthersGoing.map((v)=>{
      return v.yelpID
    })
    this.setState(
      {userGoingYelpIDs:userGoing,
        othersGoingYelpIDS:othersGoing,
        matched:true
      })
  }
  parseVenues(){

    let businesses = this.props.venues.venues[0].yelpFullResult.businesses
    let venuNames = businesses.map((b,idx)=>{
      let userGoing = this.state.userGoingYelpIDs.includes(b.id) ? 1 : 0
      let othersGoing = this.state.othersGoingYelpIDS.reduce(function(acc,curr,idx,arr){
          if(arr[idx]===b.id){return acc+1}
          else{return acc+0}

      },0)
      return (<Singlevenue key={idx} business={b} onClick={this.goingToVenue.bind(this)} going={userGoing+othersGoing}/>)
    })
    return(venuNames)
  }
  render(){
    const tooltip = (<Tooltip id="tooltip"><strong> Current Location</strong></Tooltip>);
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
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                  <Button componentClass={InputGroup.Button} type="submit" onClick ={()=>{this.props.fetchVenues('byipforced');this.props.getGoers()}}><span style={{"fontSize":"20px"}} className="fa fa-location-arrow"/> </Button>
                </OverlayTrigger>
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
          <Row style={{"marginTop":"25px","marginBottom":"25px"}}>
            <Image className="frontpic center-block" src="/images/Wall_Food.jpg" rounded />
          </Row>
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
          fetchVenues:fetchVenues,
          goToVenue:goToVenue,
          getGoers:getGoers,
          cancelVenue:cancelVenue
          }, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Home)
