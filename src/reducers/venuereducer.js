"use strict"

export function venueReducer(state={venues:[]},action){
  switch(action.type){
    case "GET_VENUES":
      return {...state, venues: [...action.payload]};
      break;
  }
  return state
}
