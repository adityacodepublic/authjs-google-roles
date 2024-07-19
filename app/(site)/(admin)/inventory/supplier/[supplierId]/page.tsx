import prismadb from "@/lib/prismadb";
import { SupplierForm }  from "./_components/supplier-form";

const SupplierPage = async ({ params }:{ params: { supplierId: string }}) => {
  const initialData = await prismadb.supplier.findUnique({
    where:{
      id:params.supplierId
    }
  });

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-4">
        <SupplierForm initialData={initialData} />
      </div>
    </div>
  );
}

export default SupplierPage;
