import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: {},
    dataArray: []
}

export const slice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        ADD_DATA: (state, action) => {
            state.data = action.payload
            state.dataArray = [...state.dataArray, action.payload]
        }

    },
})

// Action creators are generated for each case reducer function
export const { ADD_DATA } = slice.actions

export default slice.reducer