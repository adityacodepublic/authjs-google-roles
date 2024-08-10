"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/multiselect";
import { OutStock, Product, ProductCategory } from "@prisma/client";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { submitProduct } from "../../../../../../actions/quick-product-add";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, ScanBarcode, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/alert-modal";
import { formSchema } from "@/lib/_schema/inventory/outSchema";
import { deleteOut, submitOut, updateOut } from "@/actions/out-actions";
import { Scanner } from "@/components/scanner";


interface OutProps {
  initialData: OutStock | null,
  products : Product[],
  user: string,
}
export const OutForm:React.FC<OutProps> = ({
 initialData, products, user
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const resetValues = {
    productId: "",
    quantity: "",
    batchLogId: "",
    userId: user
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      productId: initialData.productId,
      quantity: initialData.quantity.toString(),
      batchLogId: initialData.batchLogId,
      userId: initialData.userId
    } : resetValues
  });

  const createSupplier = () => {
    toast.success("called")
    router.push('/inventory/supplier/new');
    // route to list to edit or create new
  };

  const onSubmit = async(data: z.infer<typeof formSchema>) => {   
    try {
      setLoading(true);
      let response;
      if(initialData) response = await updateOut(initialData,data,initialData.id);
      else response = await submitOut(data);
      if (response.status === 200) {
        toast.success(initialData? "Purchase Order Updated" : "Purchase Order Created");
        router.refresh();
      } else if(response.status === 400 || response.status === 401) {
        toast.error(response?.message || "Something went wrong");
      } else toast.error('Something went wrong.');
    } catch (error: any) {
      toast.error('Something went wrong.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if(initialData){
        const out_delete = await deleteOut(initialData.id);
        if(out_delete.status === 200) toast.success('Product deleted.');
        else toast.error('Something went wrong.');
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

  useEffect(()=>{
    form.setValue('userId', user);
  });

  return (
    <div>
      <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 p-5 w-full md:max-w-[85%] mx-auto mt-11 bg-white border rounded-xl shadow-md ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Out</h1>
              <p className="text-muted-foreground pt-1">{initialData? "Update out data here.":"Add out stock out data here."}</p>
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
          <Separator/>
          <div className=" space-y-10 ">
            <FormField
              control={form.control}
              name={`productId`}
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2 col-span-2">
                  <FormLabel>Products<span className="text-red-600">*</span></FormLabel>
                  <Popover>
                    <div className="">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between w-full",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={loading}
                          >
                          {field.value
                            ? products.find(
                                (language) => language.code === field.value
                              )?.code
                            : "Select product"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput className="h-[2.4rem]" placeholder="Search product..." value={inputValue} onValueChange={setInputValue}/>
                          <CommandEmpty>No products found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {products.map((language) => (
                                <CommandItem
                                  value={language.code + language.name}
                                  key={language.code}
                                  onSelect={() => { form.setValue(`productId`, language.code);}}
                                  disabled={loading}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                        field.value === language.code
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {language.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <CommandSeparator alwaysRender/>
                            <CommandGroup>
                              <CommandItem onClick={()=>{createSupplier()}}>
                                {"Create or edit product"}
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </div>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-2">
                  <FormLabel>Quantity<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Quantity of product out" type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="batchLogId"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-2">
                  <FormLabel>Batch LogId<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <><div className="flex gap-4">
                        <Input placeholder="Scan or enter id" disabled={loading} {...field} />
                        <Button type="button" variant={"outline"} onClick={()=>{setOpenScan(true)}}><ScanBarcode className="h-5 w-5" /></Button>
                      </div>
                      <div className="h-5">
                        <Scanner isOpen={openScan} onValueChange={field.onChange} onClose={() => setOpenScan(false)} loading={loading}/>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <Button type="submit" className="rounded-2xl font-semibold" variant="default" disabled={loading} >
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
          </div>
        </form>
      </Form>
    </div>
  );
};


