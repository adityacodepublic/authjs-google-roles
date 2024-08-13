import prismadb from "@/lib/prismadb";
import { OrderForm }  from "./_components/order-form";
import { getFormData } from "@/actions/order-form-action";

const AddOrderPage = async ({
  params
}: {
  params: { order: string}
}) => {
  const data = await getFormData(params.order);
  return ( 
    <div className="flex-col bg-[#fffff5]">
      <div className="flex-1 justify-center items-center space-y-4 p-2 py-2">
        <OrderForm initialData={data.initial} orgs={data.customer} flimSize={data.flims} canSize={data.cans} wireType={data.wires} processFlow={data.flows}/>
      </div>
    </div>
  );
}

export default AddOrderPage;
