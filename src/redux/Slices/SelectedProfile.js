import { createSlice } from "@reduxjs/toolkit";

const loadProfile = () => {

    const savedProfile = localStorage.getItem("SelectedProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
};

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    selectedProfile: loadProfile(),
    EditVideoID:""
  },
  reducers: {
    UpdateSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },
    UpdateVideo: (state, action) => {
      state.EditVideoID = action.payload;
    },
  },
});

export const { UpdateSelectedProfile , UpdateVideo} = profileSlice.actions;
export default profileSlice.reducer;
