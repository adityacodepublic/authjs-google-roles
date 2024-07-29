import prismadb from "@/lib/prismadb";
import { TextareaForm }  from "./_components/text-area";

const ProductPage = async ()=>{
  const productCategories = await prismadb.productCategory.findMany();

  return ( 
    <div className="flex justify-center items-center w-full h-full bg-[#fffff5]">
      <div className="space-y-4 mt-11 p-2 mb-5">
        <TextareaForm prodCategories={productCategories}/>
      </div>
    </div>
  );
}

export default ProductPage;
