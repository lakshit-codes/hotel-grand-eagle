import Component from "@/components/pages/ProductDetailPage";
import GetSingleProduct from "@/lib/GetAllDetails/GetSingleProduct";
import { getSingleProduct } from "@/lib/getPageData";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getSingleProduct(id);

  return (
    <>
      {/* <GetSingleProduct id={params.id} /> */}
      <Component currentProduct={product} />
    </>
  );
}
