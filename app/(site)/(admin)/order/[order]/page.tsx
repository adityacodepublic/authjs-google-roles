import prismadb from "@/lib/prismadb";
import { OrderForm }  from "./_components/order-form";

const AddOrderPage = async ({
  params
}: {
  params: { order: string}
}) => {
  const initialData = prismadb.order.findUnique({
    where:{
      id:params.order
    }
  });
  const customers = prismadb.organisation.findMany();
  const [initial, customer] = await Promise.all([initialData,customers])
  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <OrderForm initialData={initial} orgs={customer}/>
      </div>
    </div>
  );
}

export default AddOrderPage;
