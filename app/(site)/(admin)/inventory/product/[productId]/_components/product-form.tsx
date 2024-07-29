"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Product, ProductCategory, Supplier } from "@prisma/client";
import { deleteProduct, submitProduct, updateProduct } from "@/actions/product-form-action";
import { formSchema } from "@/lib/_schema/inventory/productSchema"
import useFormState from "@/hooks/use-form-state";
import { MultiSelect } from "@/components/multiselect";


interface ProductFormProps {
  initialData: z.infer<typeof formSchema> | null,
  prodCategories: ProductCategory[]
}
export const ProductForm:React.FC<ProductFormProps> = ({
  initialData, prodCategories
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {data, setData, clearData} = useFormState();

  const resetValues = {
    name: "",
    valueUnit:"",
  };

  const defaultValues = initialData ? {
    ...initialData
  } : {
    name:"",
    productCategoryId:"",
    valueUnit:"",
    code:""
  } 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const createSupplier = () => {
    setData(form.getValues);
    router.push('/inventory/supplier/new');
    // route to list to edit or create new
  }
  
  
  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      let response;
      if(initialData) response = await updateProduct(data,initialData.code)
      else response = await submitProduct(data);
      console.log(response);
      if (response.status === 200) {
        toast.success(initialData? "Product Updated" : "Product Created");
        router.refresh();
        clearData();
        router.push(`/orders`);
      } else if(response.status === 400) {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if(initialData?.code){
        const user_delete = await deleteProduct(initialData?.code) 
        toast.success('Product deleted.');
        router.refresh();
        router.push(`/orders`);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:max-w-2xl mx-auto mt-11 bg-white border rounded-xl shadow-md ">
          <div className="bg-[#fffece] h-2 rounded-t-xl mx-[0.105rem]"></div>
          <div className="p-6 space-y-7">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Product</h1>
              <p className="text-muted-foreground pt-1">{initialData? "Update product data here.":"Add new product here"}</p>
            </div>
            {initialData && (
              <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                className="rounded-xl"
                type="button"
                onClick={() => setOpen(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            <p className="text-sm text-red-600 mt-1">* Indicates required question</p>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code<span className="text-red-600">*</span></FormLabel>
                <FormDescription>Product code eg: WTM1620BL</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading || !!initialData} {...field} />
                </FormControl>
                {initialData &&
                <FormMessage>Product code cannot be updated. To update, delete this and create new product.</FormMessage>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description<span className="text-red-600">*</span></FormLabel>
                <FormDescription>Product Description eg: COPPER CABLE 16X0.2</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Category</FormLabel>
                  <FormDescription>
                    Choose the category of the product.
                  </FormDescription>
                <FormControl>
                  <MultiSelect
                    data={prodCategories}
                    onValueChange={field.onChange}
                    defaultValue={initialData? [initialData?.productCategoryId]:[]}
                    placeholder="Select options"
                    loading={loading}
                    setLoading={setLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valueUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit <span className="text-red-600">*</span></FormLabel>
                <FormDescription>Add unit of the product.</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <Button className="rounded-2xl bg-[#AAAA00] hover:bg-[#B5B500] font-semibold " variant="default" type="submit" disabled={loading} >
              {loading? 
                <div role="status">
                    <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
                : initialData? "Update":"Submit"}
            </Button>
            <Button disabled={loading} className="rounded-2xl" variant="ghost" type="reset" onClick={()=>{form.reset(resetValues)}}>
              Clear form
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Never submit passwords through Forms.</p>
          </div>
        </form>
      </Form>
    </>
  );
}