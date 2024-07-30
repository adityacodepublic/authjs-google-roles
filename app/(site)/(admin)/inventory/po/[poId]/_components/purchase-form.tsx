"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
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
import { CalendarIcon, Check, ChevronsUpDown, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Product, Supplier } from "@prisma/client";
import { deleteProduct, submitProduct, updateProduct } from "@/actions/product-form-action";
import { formSchema }  from "@/lib/_schema/inventory/purchaseSchema"
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useCurrentId } from "@/hooks/use-current-id";

type supplierData = {
  id: string;
  name: string;
};

interface PurchaseFormProps {
  initialData: z.infer<typeof formSchema> | null,
  suppliers:supplierData[],
  products : Product[]
  po:boolean;
}
export const PurchaseForm:React.FC<PurchaseFormProps> = ({
  initialData, suppliers, products, po
}) => {
  //initialData
  const router = useRouter();
  const user = useCurrentId();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const [qtn, setQtn] = useState(initialData?.qtnNo? true:false);
  const [boxes, setBoxes] = useState(initialData?.boxes?true:false);
  const [isDone, setIsDone] = useState(initialData?.payment?true:false);
  const [isDelivered, setIsDelivered] = useState(initialData?.delivery? true:false); 
  const [unit, setUnit] = useState<string[]>([]);
  const [sum, setSum] = useState<number>(0);
  const [sgst, setSgst] = useState<number>(0);
  const [cgst, setCgst] = useState<number>(0);
  const [igst, setIgst] = useState<number>(0);

  const updateUnit = (index: number, newValue: string) => {
    setUnit(prevUnit => {
      const updatedUnit = [...prevUnit];
      updatedUnit[index] = newValue;
      return updatedUnit;
    });
  };
  
  const handleCheckboxChange = (name:string) => {
    if(name === "qtn"){
      if(qtn){setQtn(false); form.setValue('qtn',false)}
      else {setQtn(true); form.setValue('qtn',true)}
    };
    if(name === "boxes"){
      if(boxes){setBoxes(false); form.setValue('boxes',false)}
      else {setBoxes(true); form.setValue('boxes',true) };
    };
    if(name === "payment"){
      if(isDone){setIsDone(false); form.setValue('payment',false)}
      else {setIsDone(true); form.setValue('payment',true)}
    };
    if(name === "delivery"){
      if(isDelivered){setIsDelivered(false); form.setValue('delivery',false)}
      else {setIsDelivered(true); form.setValue('delivery',true)}
    };
  };

  const resetValues = {
    code: "",
    supplierId: "",
    products:[{productId:"", description:"", quantity:0  }],
    totalPrice:0,
    payment:false,
    delivery:false,
    qtn:false,
    boxes:false,
    transporterSelf:false,
    igst:0,
    po:true,
  };
  
  const defaultValues = initialData ? {
    ...initialData
  } : resetValues

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const createSupplier = () => {
    toast.success("called")
    router.push('/inventory/supplier/new');
    // route to list to edit or create new
  }
  

  function convertToNumber(input: string | number | undefined ): number | undefined {
    if(input){
      const trimmedInput = input.toString().trim();
      if (trimmedInput === '.' || trimmedInput === '') {
        return undefined;
      }
      const normalizedInput = trimmedInput.startsWith('.') ? '0' + trimmedInput : trimmedInput;
      const parsedNumber = parseFloat(normalizedInput);
      return isNaN(parsedNumber) ? undefined : parsedNumber;
    }
    else return undefined
  }

  function handleGst() {
    const Cgst = form.getValues('cgst');
    const Sgst = form.getValues('sgst');
    const Igst = form.getValues('igst');
    if (Cgst && !isNaN(Cgst)) {
      setCgst((sum * Cgst / 100));
    }        
    if (Sgst && !isNaN(Sgst)) {
      setSgst((sum * Sgst / 100));
    }        
    if (Igst && !isNaN(Igst)) {
      setIgst((sum * Igst / 100));
    }  
  }

  const handleAmount = ()=> {
    const prod = form.getValues('products');
    const totalAmount = prod.reduce((total, product) => total + (product.amount || 0), 0);
    setSum(totalAmount);
    handleGst();
  }
  // cannot do operations right after state changes 
  useEffect(() => {
    form.setValue(`totalPrice`, sum + (cgst + sgst + igst));
  }, [sum,cgst,igst,sgst]);


  const handleQuantity= (index:number) => {
    const qty = form.getValues(`products.${index}.quantity`);
    const unitRate = convertToNumber(form.getValues(`products.${index}.unitRate`));
    if (qty && unitRate) {
      form.setValue(`products.${index}.unitRate`, unitRate);
      form.setValue(`products.${index}.amount`, unitRate * qty);
      handleAmount();
    }
  };

  const handleBoxes= (index:number) => {
    const qtybox = form.getValues(`products.${index}.qtybox`);
    const qtyperBoxes = form.getValues(`products.${index}.qtyPerBoxes`);
    if (qtybox && qtyperBoxes) {
      form.setValue(`products.${index}.quantity`, qtyperBoxes * qtybox);
      handleQuantity(index);
    }
  };

  // box false clear
  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    if(!form.getValues('boxes')){
      const currentProducts = form.getValues('products');
      currentProducts.forEach((product, index) => {
        form.setValue(`products.${index}.qtybox`, undefined);
        form.setValue(`products.${index}.qtyPerBoxes`, undefined);
      });
    };
    toast(
        <>
          <pre className="mt-2 rounded-md bg-slate-950 p-4">
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
    form.setValue('user', user || "");
  })

  return (
    <>
      <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 w-full md:max-w-[85%] mx-auto mt-11 bg-white border rounded-xl shadow-md ">
          <div className="bg-[#fffece] h-2 rounded-t-xl mx-[0.105rem]"></div>
          <div className="p-6 space-y-7">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Purchase Order</h1>
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
          <FormField
            control={form.control}
            name="qtn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={()=>{field.onChange; handleCheckboxChange("qtn")}}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Quotation
                  </FormLabel>
                  <FormMessage/>
                </div>
              </FormItem>
            )}
          />
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
          <div className="h-3"></div>
          <div className={cn( boxes? "grid-cols-12":"grid-cols-10", "grid gap-4")}>
            <div className="space-y-2 col-span-1"><h4>S.No.</h4></div>
            <div className="space-y-2 col-span-2"><h4>Product Code</h4></div>
            <div className="space-y-2 col-span-3"><h4>Description</h4></div>
            {boxes && <><div className="space-y-2"><h4>No of Boxes</h4></div>
            <div className="space-y-2"><h4>Qty. per Box</h4></div></>}
            <div className="space-y-2"><h4>Total Qty.</h4></div>
            <div className="space-y-2"><h4>Unit</h4></div>            
            <div className="space-y-2"><h4>Unit Rate</h4><span className="font-semibold text-popover-foreground">&#40;Rs&#41;</span></div>
            <div className="space-y-2"><h4>Amount</h4></div>
          </div>
          {fields.map((item, index) => (
            <div key={'hello'+index} className={cn( boxes? "grid-cols-12":"grid-cols-10", "grid  gap-4")}>
              <div className="flex items-center justify-center border border-input rounded-lg h-10">
                <p className="ml-2 mt-[0.15rem]">{index + 1}</p>
                <Button className="rounded-xl ml-2 relative" type="button" size={"sm"} variant={"ghost"} onClick={() => remove(index)}><Trash className="opacity-60 h-4 w-4" /></Button>
              </div>
              <FormField
                control={form.control}
                name={`products.${index}.productId`}
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2 col-span-2">
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
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {products.map((language) => (
                                  <CommandItem
                                    value={language.code + language.name}
                                    key={language.code}
                                    onSelect={() => { form.setValue(`products.${index}.productId`, language.code); form.setValue(`products.${index}.description`, language.name); updateUnit(index, language.valueUnit) }}
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
                name={`products.${index}.description`}
                render={({ field }) => (
                  <FormItem className="space-y-2 col-span-3">
                    <FormControl>
                      <Input placeholder="Description" disabled={loading || !!initialData} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {boxes && <>
              <FormField
                control={form.control}
                name={`products.${index}.qtyPerBoxes`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input placeholder="Quantity Per Boxes" type="number" disabled={loading || !!initialData} {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleBoxes(index);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`products.${index}.qtybox`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input placeholder="Number of boxes" type="number" disabled={loading || !!initialData} {...field}
                      onChange={(e) => {
                          field.onChange(e);
                          handleBoxes(index);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </>}
              <FormField
                control={form.control}
                name={`products.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input placeholder="Total Quantity" type="number" disabled={loading || !!initialData} {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleQuantity(index);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="border border-input rounded-lg flex items-center justify-center text-sm p-2 h-10">
                <p>{unit[index]}</p>
              </div>
              <FormField
                control={form.control}
                name={`products.${index}.unitRate`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input placeholder="Unit Rate" type="number" disabled={loading || !!initialData} {...field}                 
                        onChange={(e) => {
                          field.onChange(e);
                          handleQuantity(index);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`products.${index}.amount`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input placeholder="Total amount" type="number" disabled={loading || !!initialData} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button className="rounded-2xl" variant={"secondary"} type="button" onClick={() => append({productId:"", description:"",amount:'', quantity:'', unitRate:''})}>
            <Plus className="h-5 w-5 mr-2" />Add Line
          </Button>
          <FormField
            control={form.control}
            name="boxes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={()=>{field.onChange; handleCheckboxChange("boxes")}}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Boxes
                  </FormLabel>
                  <FormMessage/>
                </div>
              </FormItem>
            )}
          />
          {/*////*/}
          <div className="grid grid-cols-2 gap-4">
            <p className="col-span-2">{sum}</p>
            <FormField
              control={form.control}
              name="cgst"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>CGST<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="%" disabled={loading || !!initialData} {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleGst();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="col-span-2">{cgst}</p>
            <FormField
              control={form.control}
              name="sgst"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>SGST<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="%" disabled={loading || !!initialData} {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleGst();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="col-span-2">{sgst}</p>
            <FormField
              control={form.control}
              name="igst"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>IGST<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="%" disabled={loading || !!initialData} {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleGst();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="col-span-2">{igst}</p>
            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-2">
                  <FormLabel>Total Amount<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Total" disabled={loading || !!initialData} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                        onCheckedChange={()=>{field.onChange; handleCheckboxChange("payment"); form.trigger('payment')}}
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
                        onCheckedChange={()=>{field.onChange; handleCheckboxChange("delivery"); form.trigger('delivery')}}
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
                  <FormItem className="animate-ease-in flex  items-center">
                    <div className="flex-col space-y-2">
                      <FormLabel>Pending Days</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="days pending for delivery" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
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