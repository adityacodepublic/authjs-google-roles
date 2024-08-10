import prismadb from "@/lib/prismadb";
import { OutForm }  from "./_components/outForm";
import { getCurrentId } from "@/lib/get-current-Id";
import { redirect } from "next/navigation";

const OutPage = async ({
  params
}: {
  params: { outId: string}
}) => {
  const product = prismadb.product.findMany();
  const user = getCurrentId();
  const out = prismadb.outStock.findUnique({where:{id:params.outId}})
  const[products,users,outs] = await Promise.all([product,user,out]);

  const check = () => {
    if(users) return users;
    else redirect("/orders");
  };
  
  return ( 
    <div className="flex justify-center items-center w-full h-full bg-[#fffff5]">
      <div className="space-y-4 mt-11 mb-5">
        <OutForm products={products} user={check()} initialData={outs}/>
      </div>
    </div>
  );
}

export default OutPage;
