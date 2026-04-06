"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";
import { fetchProductsByCategory } from "../store/products/productsThunk";
import { useParams } from "next/navigation";

function checkIsFetched(arr: any[], id: string) {
  let main = arr.map((d) => d.categoryIds).flat();
  return main.includes(id);
}

export default function GetAllProducts() {
  const { id } = useParams<{ id: string }>();
  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (checkIsFetched(allProducts, id)) {
      return;
    }
    dispatch(fetchProductsByCategory(id));
  }, [id]);

  return null;
}
