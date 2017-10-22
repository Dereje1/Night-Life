"use strict"

export function goersReducer(state={allGoers:[]},action){
  switch(action.type){
    case "GO_TO_VENUE":
      //let previouslyGoing = [...state.goers.goers]
      return {...state, allGoers: [...state.allGoers,...action.payload]};
      break;
    case "CANCEL_VENUE":
      let venueCopy =  [...state.allGoers]
      let indexOfDeletion = venueCopy.findIndex(function(venue){
        return (venue.userName===action.payload.userName&&venue.yelpID===action.payload.yelpID)
      })
      let venuRemoved = [...venueCopy.slice(0,indexOfDeletion),...venueCopy.slice(indexOfDeletion+1)]

      return (indexOfDeletion===-1) ? {allGoers: venueCopy} : {allGoers: venuRemoved};
      break
    case "GET_VENUE_GOERS":
      return {...state, allGoers: [...action.payload]};
      break;
  }
  return state
}
