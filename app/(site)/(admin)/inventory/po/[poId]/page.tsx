import prismadb from "@/lib/prismadb";
import { PurchaseForm }  from "./_components/purchase-form";
import { formSchema } from "@/lib/_schema/inventory/purchaseSchema";
import { getInstock } from "@/lib/po-data-transform";

const ProductPage = async ({
  params
}: {
  params: { poId: string}
}) => {
  const initialData = prismadb.inStock.findUnique({
    where:{
      id:params.poId
    },
    include:{
      products:true
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
  const initials = initial? getInstock(initial): null;

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <PurchaseForm initialData={initials} suppliers={suppliers} products={products}/>
      </div>
    </div>
  );
}

export default ProductPage;
