"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";
import { fetchCart } from "../store/cart/cartThunk";

export default function GetCart() {
  const { items, loading, error, hasCartFetched } = useSelector(
    (state: RootState) => state.cart,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasCartFetched) {
      dispatch(fetchCart());
    }
  }, []);

  return null;
}
