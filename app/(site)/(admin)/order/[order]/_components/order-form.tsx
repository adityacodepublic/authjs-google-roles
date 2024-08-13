"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import {
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CanSize, FilmSize, Order, organisation, ProcessFlow, WireType } from "@prisma/client";
import { createCansize, createCustomer, createFlimsize, createWiretype, deleteCansize, deleteCustomer, deleteFlimsize, deleteOrder, deleteWiretype, submitOrder, updateCansize, updateCustomer, updateFlimsize, updateOrder, updateWiretype } from "@/actions/order-form-action";
import { formSchema } from "@/lib/_schema/orderSchema"
import { MultiSelect } from "./multiselect";
import { MultiSelect as Combobox} from "@/components/multiselect";
import { useSession } from "next-auth/react";


interface OrderFormProps {
  initialData: Order | null,
  orgs:organisation[],
  flimSize:FilmSize[],
  canSize:CanSize[],
  wireType:WireType[],
  processFlow:ProcessFlow[]
}
export const OrderForm:React.FC<OrderFormProps> = ({
  initialData,orgs,flimSize,canSize,wireType,processFlow
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const resetValues = {
    description: "",
    printing: "",
    filmSize: "",
    org:"",
    canSize: "",
    type: "",
    wireLength: "",
    wireType: "",
  };

  const defaultValues = initialData ? {
    ...initialData
  } : {
    ...resetValues
  };


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  function convertProcess(processFlow: { name: string; }[]): { id: string; name: string; }[] {
    return processFlow.map(item => ({
        id: item.name,
        name: item.name
    }));
  }

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      data.user = useSession().data?.user.id || "";
      let response;
      if(initialData) response = await updateOrder(data,initialData.id)
      else response = await submitOrder(data);
      if (response.status == 200) {
        toast.success(initialData? "Order Updated" : "Order Created");
        router.refresh();
        router.push(`/orders`);
      } else {
        toast.error('Something went wrong.');
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
      if(initialData?.id){
        const user_delete = await deleteOrder(initialData?.id)
        if(user_delete.status === 200 ){ 
          toast.success('Order deleted.');
          router.refresh();
          router.push(`/orders`);
        }
        else {
          toast.error('Something went wrong.');
        }
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

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
              <h1 className="text-3xl font-bold">Order</h1>
              <p className="text-muted-foreground pt-1">{initialData? "Update order data here.":"Add new order here"}</p>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-red-600">*</span></FormLabel>
                <FormDescription>Describe the order eg: 25MFD 440V, PP Can</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="org"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Customer <span className="text-red-600">*</span></FormLabel>
                <FormDescription>
                  Select customer.
                </FormDescription>
                  <FormControl>
                    <MultiSelect
                      data={orgs}
                      onValueChange={field.onChange}
                      defaultValue={initialData? [initialData?.org]:[]}
                      placeholder="customer"
                      loading={loading}
                      setLoading={setLoading}
                      createValues={createCustomer}
                      updateValues={updateCustomer}
                      deleteValues={deleteCustomer}
                    />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="printing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Printing <span className="text-red-600">*</span></FormLabel>
                <FormDescription>Add printing name.</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="filmSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film Size <span className="text-red-600">*</span></FormLabel>
                <FormDescription>Select the film size in μm.</FormDescription>
                <FormControl>
                    <MultiSelect
                      data={flimSize}
                      onValueChange={field.onChange}
                      defaultValue={initialData? [initialData?.filmSize]:[]}
                      placeholder="flim"
                      loading={loading}
                      setLoading={setLoading}
                      createValues={createFlimsize}
                      updateValues={updateFlimsize}
                      deleteValues={deleteFlimsize}
                    />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="canSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Can Size <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <MultiSelect
                      data={canSize}
                      onValueChange={field.onChange}
                      defaultValue={initialData? [initialData?.canSize]:[]}
                      placeholder="can size"
                      loading={loading}
                      setLoading={setLoading}
                      createValues={createCansize}
                      updateValues={updateCansize}
                      deleteValues={deleteCansize}
                    />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type <span className="text-red-600">*</span></FormLabel>
                <FormDescription>Describe the type eg: wire, pin: dfo/sfo</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wireLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wire Length <span className="text-red-600">*</span></FormLabel>
                <FormDescription>length eg:210mm, 220mm</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wireType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wire Type <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <MultiSelect
                      data={wireType}
                      onValueChange={field.onChange}
                      defaultValue={initialData? [initialData?.wireType]:[]}
                      placeholder="wire type"
                      loading={loading}
                      setLoading={setLoading}
                      createValues={createWiretype}
                      updateValues={updateWiretype}
                      deleteValues={deleteWiretype}
                    />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity <span className="text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading} {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flowName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Process Flow <span className="text-red-600">*</span></FormLabel>
                <FormDescription>
                  Select production process flow.
                </FormDescription>
                  <FormControl>
                    <Combobox
                      data={convertProcess(processFlow)}
                      onValueChange={field.onChange}
                      defaultValue={initialData? [initialData?.flowName]:[]}
                      placeholder="process flow"
                      editableFields={false}
                      editRedirect="/production/process/new"
                      loading={loading}
                      setLoading={setLoading}
                    />
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
            <Button className="rounded-2xl" variant="ghost" type="reset" disabled={loading} onClick={()=>{form.reset(resetValues)}}>
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



const CommandItemCreate = ({
  inputValue,
  frameworks,
  onSelect,
}: {
  inputValue: string;
  frameworks: {id: string, name: string;}[];
  onSelect: () => void;
}) => {
  const hasNoFramework = !frameworks
    .map(({ name }) => name)
    .includes(`${inputValue.toLowerCase()}`);

  const render = inputValue !== "" && hasNoFramework;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new label &quot;{inputValue}&quot;
    </CommandItem>
  );
};

