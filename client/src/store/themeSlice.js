import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: 'light',
    photo: ''
}

export const counterSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        increment: (state) => {
            if (state.theme === 'light') state.theme = 'dark';
            else {
                state.theme = 'light';
            }
        },
        setPhoto: (state, action) => {
            console.log(action);
            state.photo = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { increment,setPhoto } = counterSlice.actions

export default counterSlice.reducer