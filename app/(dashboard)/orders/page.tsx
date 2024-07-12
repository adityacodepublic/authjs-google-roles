import getData from "@/actions/get-data"
import SignIn from "@/app/(auth)/signin/page";
import { auth } from "@/auth"
import { useCurrentRole } from "@/hooks/use-current-role";

const OrdersPage = async() => {

    const orders = await getData(20);
    const session = await auth();

    return (
    <div className="w-full h-full">
        <SignIn/>
        <h1 className="text-black">{session?.user?.role}</h1>
    </div>
    )
}

export default OrdersPage
// useSession in client 
// auth       in server

