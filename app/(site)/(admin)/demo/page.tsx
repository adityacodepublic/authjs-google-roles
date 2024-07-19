import getAllData from "@/actions/get-alldata";
import prismadb from "@/lib/prismadb";
export const revalidate = 0;
const hi= async() =>{
  const data = await getAllData();

// Function to process each array
  async function processArray (arr: any[]): Promise<String> {
      const dataInput = await prismadb.order.create({
        data:{
          id:arr[1].toString(),
          description:arr[2],
          printing:arr[3],
          filmSize:arr[4],
          canSize:arr[5],
          type:arr[6],
          wireType:arr[7].toString(),
          wireLength:arr[8].toString(),
          quantity:arr[9],
          complete:Boolean(arr[11]),
          createdAt:arr[0],
        }
      }) 

      return data;
  }

  // Function to loop through each array in the 2D array
  async function processData(data: any[][]): Promise<String> {
    for (let i = 4; i < data.length; i++) {
      const man = await processArray(data[i]);
      console.log(man);
    }
    return "completed Successfully";
  }


  //processData(data.data); 14

  return(
    <div className="text-center">Wait processing</div>
  )
};

export default hi;
