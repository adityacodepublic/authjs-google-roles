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
      quantity:true,
      suppliers:{
        select:{
          supplier:{
            select:{
              id:true,
              name:true,
            }
          }
        }
      }
    },
  });

  const supplier = prismadb.supplier.findMany({
    select:{
      id:true,
      name:true,
    }
  })

  const productCategories = prismadb.productCategory.findMany();

  const [initial,suppliers,categories] = await Promise.all([initialData,supplier,productCategories]);
  
  const transform = (data: typeof initial) => {
    if (!data) return null;
    const transformedData = {
      suppliers: data.suppliers.map(supplierItem => supplierItem.supplier.id),
      productCategory: data.productCategoryId,
      code: data.code,
      valueUnit: data.valueUnit,
      quantity: data.quantity,
    };
  
    return transformedData;
  };
  

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <ProductForm initialData={transform(initial)} suppliers={suppliers} prodCategories={categories}/>
      </div>
    </div>
  );
}

export default ProductPage;
