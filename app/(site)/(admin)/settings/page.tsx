import getData from "@/actions/get-data"
import { auth } from "@/auth"
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const OrdersPage = async() => {

    // const orders = await getData(20);
    // const session = await auth();

    return (
    <div className="w-full h-full">
      <CardWrapper headerLabel="Users" headerDescription="view users, edit user roles...">
        <Button onClick={redirect("./users")}>Users</Button>
      </CardWrapper>
    </div>
    )
}

export default OrdersPage;
