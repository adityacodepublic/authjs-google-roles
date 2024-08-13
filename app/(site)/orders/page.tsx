import getData from "@/actions/get-data"
import SignIn from "@/app/(auth)/signin/page";
import { auth } from "@/auth"

const OrdersPage = async() => {

    const orders = await getData(20);
    const session = await auth();

    return (
    <div className="w-full h-full">
        <SignIn/>
        <h1 className="text-black">{JSON.stringify(session)}</h1>
    </div>
    )
}

export default OrdersPage;


