import prismadb from "@/lib/prismadb";
import { PurchaseForm }  from "./_components/purchase-form";

const ProductPage = async ({
  params
}: {
  params: { poId: string}
}) => {
  const initialData = prismadb.inStock.findUnique({
    where:{
      id:params.poId
    }
  });

  const supplier = prismadb.supplier.findMany({
    select:{
      id:true,
      name:true,
    }
  })

  const product = prismadb.product.findMany();

  const [initial,suppliers,products] = await Promise.all([initialData,supplier,product]);
  
  

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <PurchaseForm initialData={null} suppliers={suppliers} products={products} po={true}/>
      </div>
    </div>
  );
}

export default ProductPage;
