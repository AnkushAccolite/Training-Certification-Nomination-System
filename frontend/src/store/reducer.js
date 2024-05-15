import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import authReducer from './authReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  auth: authReducer
});

export default reducer;
