import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list1: [],
  list2: [],
  keySelected: "",
  sortProduct: {
    page: 1,
    sort_by: "",
    order_by: "",
    category_id: "",
    size: 20,
  },
  searchProduct: {
    page: 1,
    sort_by: "",
    order_by: "",
    keyword: "",
    size: 20,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setList1: (state, action) => {
      state.list1 = action.payload;
    },
    setList2: (state, action) => {
      state.list2 = action.payload;
    },
    addKeySelected: (state, action) => {
      state.keySelected = action.payload;
    },
    setSortProduct: (state, action) => {
      state.sortProduct = {
        ...state.sortProduct,
        ...action.payload,
      };
    },
    setSearchProduct: (state, action) => {
      state.searchProduct = {
        ...state.searchProduct,
        ...action.payload,
      };
    },
  },
});

export const {
  setList1,
  setList2,
  addKeySelected,
  setSortProduct,
  setSearchProduct,
} = productSlice.actions;

export default productSlice.reducer;
