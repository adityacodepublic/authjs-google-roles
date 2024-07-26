"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Product, ProductCategory, Supplier } from "@prisma/client";
import { deleteProduct, submitProduct, updateProduct } from "@/actions/product-form-action";
import { formSchema }  from "@/lib/_schema/inventory/purchaseSchema"
import useFormState from "@/hooks/use-form-state";
import { MultiSelect } from "@/components/multiselect";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";

type supplierData = {
  id: string;
  name: string;
};

interface PurchaseFormProps {
  initialData: z.infer<typeof formSchema> | null,
  suppliers:supplierData[],
  prodCategories: ProductCategory[]
  po:boolean;
}
export const PurchaseForm:React.FC<PurchaseFormProps> = ({
  initialData, suppliers, prodCategories, po
}) => {
  const router = useRouter();
  const [boxes, setBoxes] = useState(false);
  const [qtn, setQtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isDone, setIsDone] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false); 
  const {data, setData, clearData} = useFormState();
  
  const handleCheckboxChange = (name:string) => {
    if(name === "boxes"){
      if(boxes)setBoxes(false);
      else setBoxes(true);
    }
    if(name === "qtn"){
      if(qtn)setQtn(false);
      else setQtn(true)
    }
  };
  const resetValues = {
    code: "",
    suppliers: [],
    productCategory: "",
    valueUnit:"",
    quantity: 0,
  };

  const transformData = (data: any) => {
    if (!data) {
      return resetValues;
    }
    return {
      code: data.code ?? "",
      suppliers: data.suppliers?.map((supplierItem: any) => supplierItem?.supplier?.name) || [],
      productCategory: data.productCategoryId ?? "",
      valueUnit: data.valueUnit ?? "",
      quantity: data.quantity ?? 0,
    };
  };
  
  const defaultValues = initialData ? {
    ...initialData
  } : transformData(data) 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const createSupplier = () => {
    setData(form.getValues);
    toast.success("called")
    router.push('/inventory/supplier/new');
    // route to list to edit or create new
  }
  
  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    toast(
<>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white" lang="JSON">{JSON.stringify(data, null, 2)}</code>
        </pre>
        </>
    );
    // try {
    //   setLoading(true);
    //   let response;
    //   if(initialData) response = await updateProduct(data,initialData.code)
    //   else response = await submitProduct(data);
    //   console.log(response);
    //   if (response.status === 200) {
    //     toast.success(initialData? "Product Updated" : "Product Created");
    //     router.refresh();
    //     clearData();
    //     router.push(`/orders`);
    //   } else if(response.status === 400) {
    //     toast.error(response.message);
    //   }
    // } catch (error: any) {
    //   toast.error('Something went wrong.');
    // } finally {
    //   setLoading(false);
    // }
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

  useEffect(()=>{
    const delivery = form.watch("delivery");
    if(delivery) form.resetField("deliveryDays");
    setIsDelivered(delivery);
    const payment = form.watch("payment");
    if(payment) form.resetField("paymentDays");
    setIsDone(payment)

  },[form.watch("delivery"),form.watch("payment")])
  return (
    <>
      <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 w-full md:max-w-2xl mx-auto mt-11 bg-white border rounded-xl shadow-md ">
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>PO. No.<span className="text-red-600">*</span></FormLabel>
                  <FormDescription>Purchase Order code eg: PO2406-27</FormDescription>
                  <FormControl>
                    <Input placeholder="Your answer" disabled={loading || !!initialData} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Supplier<span className="text-red-600">*</span></FormLabel>
                  <FormDescription>
                    Select supplier.
                  </FormDescription>
                  <Popover>
                    <div className="max-w-[400px] ">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between w-[300px]",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={loading}
                          >
                          {field.value
                            ? suppliers.find(
                                (language) => language.id === field.value
                              )?.name
                            : "Select Supplier"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput className="h-[2.4rem]" placeholder="Search customer..." value={inputValue} onValueChange={setInputValue}/>
                          <CommandEmpty>No supplier found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {suppliers.map((language) => (
                                <CommandItem
                                  value={language.name}
                                  key={language.id}
                                  onSelect={() => { form.setValue("supplierId", language.id)}}
                                  disabled={loading}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                        field.value === language.id
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
                                {"Create or edit supplier"}
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
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="qtn" checked={qtn} onCheckedChange={()=>{handleCheckboxChange("qtn")}}/>
            <label
              htmlFor="qtn"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Quotation
            </label>
          </div>
          { qtn &&  <div className="animate-ease-in grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="qtnNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="quotation-number">Qtn. No.</FormLabel>
                  <FormDescription>Enter the quotation number.</FormDescription>
                  <FormControl>
                    <Input placeholder="Enter quotation number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qtnDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="date">Date</FormLabel>
                  <FormDescription>Select date of the quotation.</FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          }
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><h4>S.No.</h4></div>
            <div className="space-y-2"><h4>Product Code</h4></div>
            <div className="space-y-2"><h4>Description</h4></div>
            {qtn && <><div className="space-y-2"><h4>No of Boxes</h4></div>
            <div className="space-y-2"><h4>Qty. Per Boxes</h4></div></>}
            <div className="space-y-2"><h4>Qty.</h4></div>
            <div className="space-y-2"><h4>Unit</h4></div>            
            <div className="space-y-2"><h4>Unit Rate</h4><span className="font-semibold text-popover-foreground">&#40;Rs&#93;</span></div>
            <div className="space-y-2"><h4>Amount</h4></div>

          </div>
          <FormField
            control={form.control}
            name="boxes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Boxes
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cgst"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>CGST<span className="text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="% or Rs" disabled={loading || !!initialData} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sgst"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>SGST<span className="text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="% or Rs" disabled={loading || !!initialData} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="igst"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>IGST<span className="text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="% or Rs" disabled={loading || !!initialData} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Total Amount<span className="text-red-600">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="% or Rs" disabled={loading || !!initialData} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator/>
          <div className="w-full flex items-center justify-center">
            <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem className="pt-1 px-5 -mr-5">
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="size-5 rounded-lg"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />  
                    </FormControl>
                    <FormLabel className="text-lg">Payment</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isDone ? (
              <FormField
                control={form.control}
                name="paymentDays"
                render={({ field }) => (
                  <FormItem className="animate-ease-in flex  items-center">
                    <div className="flex-col space-y-2">
                    <FormLabel className="ml-1">Pending Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="days pending for payment" {...field} />
                    </FormControl>
                    <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ):(<div className="w-full"></div>)}
            <FormField
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem className="-mr-5 pt-1 px-5">
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="size-5 rounded-lg"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <FormLabel className="text-lg">Delivery</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isDelivered ? (
              <FormField
                control={form.control}
                name="deliveryDays"
                render={({ field }) => (
                  <FormItem className="animate-ease-in">
                    <FormLabel>Pending Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="days pending for delivery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ):(<div className="w-full"></div>)}
          </div>
          <FormField
            control={form.control}
            name="transportSelf"
            render={({ field }) => (
              <FormItem className="pt-1">
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      className="rounded-lg"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      />
                  </FormControl>
                  <FormLabel>Freight / Transportation on our side.</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transporter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transporter<span className="text-red-600">*</span></FormLabel>
                <FormDescription>transporter details.</FormDescription>
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