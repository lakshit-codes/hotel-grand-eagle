"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";
import { fetchProducts } from "../store/products/productsThunk";

export default function GetAllProducts() {
  const { allProducts, loading, error, hasFetched } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  const dispatch = useDispatch<AppDispatch>();

  const { nestCraftUser: user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    if (!hasFetched && !loading) {
      dispatch(fetchProducts());
    }
  }, [user, hasFetched, loading]);

  return null;
}
