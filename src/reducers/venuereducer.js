"use strict"//sets yelp returned venues into store state

export function venueReducer(state={venues:[]},action){
  switch(action.type){
    case "GET_VENUES":
      return {...state, venues: [...action.payload]};
      break;
    case "GET_VENUES_ERROR":
      return {...state, venues: [...action.payload]};
      break;
  }
  return state
}
