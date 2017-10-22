"use strict"//unifies all reducers
import {combineReducers} from 'redux';

// HERE IMPORT REDUCERS TO BE COMBINED
import {userStatusReducer} from './userreducer';
import {venueReducer} from './venuereducer';
import {goersReducer} from './goingreducer'

//HERE COMBINE THE REDUCERS
export default combineReducers({
  venues: venueReducer,
  user: userStatusReducer,
  allGoers: goersReducer
})
