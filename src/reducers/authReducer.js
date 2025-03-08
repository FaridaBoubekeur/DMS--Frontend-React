// src/reducers/authReducer.js
const initialState = {
 isAuthenticated: false,
 user: null,
 role: null,
};

const authReducer = (state = initialState, action) => {
 switch (action.type) {
   case 'LOGIN':
     return {
       ...state,
       isAuthenticated: true,
       user: action.payload.username,
       role: action.payload.role,
     };
   case 'LOGOUT':
     return {
       ...state,
       isAuthenticated: false,
       user: null,
       role: null,
     };
   default:
     return state;
 }
};

export default authReducer;