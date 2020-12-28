import {
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE
} from '../actions/types'

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
}

export default function(state = initialState, action){
  switch(action.type){

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        respos: [],
        loading: false
      }

    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      }
    
    case GET_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false
      }

    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }    

    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        profile: null
      }

    default:
      return state
  }
}