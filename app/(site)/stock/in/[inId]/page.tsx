import prismadb from "@/lib/prismadb";
import { QuickInForm }  from "./_components/quickIn-form";
import { getInstock } from "@/lib/transforms/po-data-transform";
import { getCurrentRole } from "@/lib/get-current-role";

const InPage = async ({
  params
}: {
  params: { inId: string}
}) => {
  const initialData = prismadb.inStock.findUnique({
    where:{
      id:params.inId
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
  });
  const product = prismadb.product.findMany();

  const [initial,suppliers,products] = await Promise.all([initialData,supplier,product]);
  const initials = initial? getInstock(initial): null;

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <QuickInForm initialData={initials} suppliers={suppliers} products={products} />
      </div>
    </div>
  );
}

export default InPage;
