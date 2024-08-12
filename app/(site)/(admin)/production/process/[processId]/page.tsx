import prismadb from "@/lib/prismadb";
import { ProcessForm }  from "./_components/process-form";

const SupplierPage = async ({ params }:{ params: { processId: string }}) => {
  const initialData = await prismadb.processFlow.findUnique({
    where:{
      name:params.processId
    },
    include:{
      process:true,
    }
  });

  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-4">
        <ProcessForm initialData={initialData} />
      </div>
    </div>
  );
}

export default SupplierPage;
