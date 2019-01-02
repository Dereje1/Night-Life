"use strict"//main page listing all venues
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {findDOMNode} from 'react-dom';
import {Grid,Col,Row,InputGroup,FormControl,Button,FormGroup,OverlayTrigger,Image,Tooltip} from 'react-bootstrap'

//custom redux actions
import {fetchVenues} from '../actions/venueaction'
import {goToVenue,getGoers,cancelVenue} from '../actions/goingactions'
//custom react components
import Singlevenue from './singlevenue'

class Home extends React.Component{
  constructor(props){
    super(props)

    this.state={
      matched:false,//true if all going are matched for the listed venues
      userGoingYelpIDs:[],//all places the user is going in the db
      othersGoingYelpIDS:[],//all places people other than the user are going in the db
      updated:false//true if a new venue query has completed loading
    }
    this.matchGoersWithVenues=this.matchGoersWithVenues.bind(this)
  }
  componentDidMount(){
    console.log("CDM Mounted for home")
    this.props.fetchVenues()//fetch venues with ip/session stored
    this.props.getGoers()//get all that are going to venues
  }
  componentDidUpdate(prevProps, prevState) {
    if(!this.state.matched){this.matchGoersWithVenues()}//match goers then state to true
    if(prevProps.venues.venues[0]!==this.props.venues.venues[0]){//if venues have changed means succesful loading
      this.setState({updated:true},
        ()=>{findDOMNode(this.refs.venueQ).value =""}//callback after update to clear text from input form
      )
    }
  }
  goingToVenue(venueID){//executes on going button click
    if(!this.props.user.user.authenticated){//if not authenticated simply redirect to twitter
      window.location =  "/auth/twitter"
    }
    else{//next check if user has already opted to go to the venue, if so....
      if(this.state.userGoingYelpIDs.includes(venueID)){
        let cancelInfo= {//set up delete query
              yelpID: venueID,
              userName: this.props.user.user.username
              }
        let copyofGoing=[...this.state.userGoingYelpIDs]
        let indexOfDeletion = copyofGoing.findIndex(function(v){
          return (v===venueID)
        })
        this.setState({//delete from component state and when done delete from database
          userGoingYelpIDs: [...copyofGoing.slice(0,indexOfDeletion),...copyofGoing.slice(indexOfDeletion+1)]
        },this.props.cancelVenue(cancelInfo))
      }
      else{//user has not opted to go yet
        let addToGoers =  {//set up add query
           yelpID: venueID,
           userName: this.props.user.user.username,
           timeStamp: Date.now()
        }
        this.setState({//add to component state and when done add to database
          userGoingYelpIDs: [...this.state.userGoingYelpIDs,venueID]
        },this.props.goToVenue(addToGoers))
      }
    }
  }

  venueQuery(e){//finds venues per request type
    //event.preventDefault() preventDefaultwoeks in development but not production???
    let venueSearch = findDOMNode(this.refs.venueQ).value.trim()
    if(e.keyCode===13||e==="loc"){//check if enter pressed or location button
      this.setState(
        {matched:false,
        userGoingYelpIDs:[],
        othersGoingYelpIDS:[],
        updated:false
      })//zero out component state
      if(e==="loc"){//if location button pressed , get venues by location from server
        this.props.fetchVenues('byipforced')
      }
      else{//otherwise get venues by user search term from server
        this.props.fetchVenues(venueSearch)
      }
      this.props.getGoers()//update goers from db incase user has opted to go a venue on previous page
      window.scroll(0, window.innerWidth*0.46)//scroll down ,could update speed in the future
    }
  }
  matchGoersWithVenues(){//matches who is going with the currently loaded venue list
    if(!this.props.allGoers.allGoers.length){return}//exit if going list is null
    let allgoing = this.props.allGoers.allGoers[0]
    let currrentUser = this.props.user.user.username
    //separately identify user going list from all others who are going and store yelp ids as they should be unique
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
    //then set component's state accordingly
    this.setState(
      {userGoingYelpIDs:userGoing,
        othersGoingYelpIDS:othersGoing,
        matched:true
      })
  }
  parseVenues(){//main function to parse venue list from server
    if (!this.state.updated) return null;
    let businesses = this.props.venues.venues[0].yelpFullResult.businesses

    let allVenues = businesses.map((b,idx)=>{//map thru all businesses returned
      //if user is going to the business set val to 0 or 1
      let userGoing = this.state.userGoingYelpIDs.includes(b.id) ? 1 : 0
      //find total number of other people going to the business
      let othersGoing = this.state.othersGoingYelpIDS.reduce(function(acc,curr,aidx,arr){
          if(arr[aidx]===b.id){return acc+1}
          else{return acc+0}
      },0)
      return (//note props being sent to the dumb Singlevenue component and that onClick comes back to this component
              <Singlevenue
                key={idx}
                business={b}
                onClick={this.goingToVenue.bind(this)}
                going={[userGoing,othersGoing]}
                />
              )
    })
    return(allVenues)
  }
  createForm(){
    const tooltip = (<Tooltip id="tooltip"><strong> Current Location</strong></Tooltip>);
    return(
      <FormGroup>
        <InputGroup >
          <FormControl ref="venueQ"  type="text" onKeyDown={(e)=>this.venueQuery(e)} style={{"height":"75px","borderRadius":"10px 0 0px 10px","fontSize":"20px"}} placeholder="enter address, neighborhood, city, state or zip, optional country"/>
          <OverlayTrigger placement="bottom" overlay={tooltip}>
            <Button componentClass={InputGroup.Button} style={{"height":"75px","borderRadius":"0px 10px 10px 0px"}} type="submit" onClick ={()=>this.venueQuery("loc")}><span style={{"fontSize":"45px"}} className="fa fa-location-arrow"/></Button>
          </OverlayTrigger>
        </InputGroup>
      </FormGroup>
    )
  }
  render(){

    if(this.props.venues.venues.length){//ensure that venues are loaded before rendering
      if(!this.props.venues.venues[0].error){//also ensure that yelp has not returned an error
        //conditional loading message
        const updateMessage= this.state.updated ? "Showing Venues in "+ this.props.venues.venues[0].yelpFullResult.businesses[0].location.city: "Loading Venues...."
        return (
          <Grid >
            <Row style={{"marginTop":"25px","marginBottom":"5px"}}>
              <Image className="frontpic center-block" src="/images/Wall_Food.jpg" rounded />
            </Row>
            <Row>
              {this.createForm()}
            </Row>
            <Row className="text-center">
                <h1 style={{"fontFamily":"Abril Fatface"}}>{updateMessage}</h1>
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
               {this.createForm()}
           </Row>
         </Grid>
       )
     }

    }
    else{
      return (
        <Grid >
          <Row style={{"marginTop":"25px"}}>
              <h1 className="text-center">Loading....</h1>
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
