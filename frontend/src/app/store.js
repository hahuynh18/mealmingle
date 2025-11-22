import {configureStore} from '@reduxjs/toolkit'
import pantryListReducer from '../pages/features/pantry_list/pantryListSlice';
const store = configureStore({
  reducer: {
    pantryList: pantryListReducer,
  }
})

export default store;