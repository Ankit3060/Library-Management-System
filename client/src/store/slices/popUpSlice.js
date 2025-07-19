import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: "popuo",
    initialState : {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        addNewAdminPopup: false,
    },
    reducers:{
        toggleSettingPopup(state){
            state.settingPopup = !state.settingPopup;
        },
        toggleAddBookPopup(state){
            state.addBookPopup = !state.addBookPopup;
        },
        toggleReadBookPopup(state){
            state.readBookPopup = !state.readBookPopup;
        },
        toggleRecordBookPopup(state){
            state.recordBookPopup = !state.recordBookPopup;
        },
        toggleReturnBookPopup(state){
            state.returnBookPopup = !state.returnBookPopup;
        },
        toggleAddNewAdminPopup(state){
            state.addNewAdminPopup = !state.addNewAdminPopup;
        },
        closeAllPopup(state){
            state.settingPopup = false,
            state.addBookPopup = false,
            state.readBookPopup = false,
            state.recordBookPopup = false,
            state.returnBookPopup = false,
            state.addNewAdminPopup = false
        },
    }
})

export const {closeAllPopup, 
              toggleSettingPopup,
              toggleAddBookPopup,
              toggleReadBookPopup,
              toggleRecordBookPopup,
              toggleReturnBookPopup,
              toggleAddNewAdminPopup
            } = popupSlice.actions;

export default popupSlice.reducer;