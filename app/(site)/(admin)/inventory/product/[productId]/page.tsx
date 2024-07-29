import prismadb from "@/lib/prismadb";
import { ProductForm }  from "./_components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string}
}) => {
  const initialData = prismadb.product.findUnique({
    where:{
      code:params.productId
    },
    select:{
      code:true,
      productCategoryId:true,
      valueUnit:true,
      name:true
    },
  });

  const productCategories = prismadb.productCategory.findMany();

  const [initial,categories] = await Promise.all([initialData,productCategories]);
  

  

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <ProductForm initialData={initial} prodCategories={categories}/>
      </div>
    </div>
  );
}

export default ProductPage;
