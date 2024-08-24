import prismadb from "@/lib/prismadb";
import { ReportForm }  from "./_components/report-form";

const ProductPage = async ({ params }:{ params: { reportId: string }})=>{
  const initialData = await prismadb.report.findUnique({where:{id:params.reportId}});

  return ( 
    <div className="flex-col ">
      <div className="flex-1 justify-center items-center space-y-5 p-2 py-2">
        <ReportForm initialData={initialData}/>
      </div>
    </div>
  );
}

export default ProductPage;
