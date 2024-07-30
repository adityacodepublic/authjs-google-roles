"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { ProductCategory } from "@prisma/client";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { submitProduct } from "./quick-product-add";

export const formSchema = z.object({
  productCategoryId: z.string().min(1, { message: "Please select the category of product." }),
  excelData: z.string().min(1, {
    message: "Please paste some Excel data.",
  }),

});
interface TextareaProps {
  prodCategories: ProductCategory[]
}
export const TextareaForm:React.FC<TextareaProps> = ({
 prodCategories
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const resetValues = {
    excelData: "",
    productCategoryId: "",
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: resetValues
  });

  const getRows = ():(string[][]) =>  {
    const rows = form.getValues('excelData').split('\n').map(row => row.split('\t'));
    return rows;
  };

  async function onSubmit(data:z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await submitProduct(data);
      if (response.status == 200) {
        toast.success("Products Created");
        setOpen(false);
        // router.refresh();
        // router.back();
      } 
      else {
        toast.error('Something went wrong.');
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const handleSubmit=()=>{
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 p-6 w-full md:max-w-[85%] mx-auto mt-11 bg-white border rounded-xl shadow-md ">
        <div>
          <h1 className="text-xl font-bold">Quick Add Product</h1>
          <p className="text-muted-foreground text-sm pt-1">{"Add product here from excel sheet"}</p>
        </div>
        <Separator/>
        <div className=" space-y-10 *:">
          <FormField
            control={form.control}
            name="productCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-disabled={loading}>Product Category</FormLabel>
                  <FormDescription>
                    Choose the category of the products.
                  </FormDescription>
                <FormControl>
                  <MultiSelect
                    data={prodCategories}
                    onValueChange={field.onChange}
                    defaultValue={[]}
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
            name="excelData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paste Excel Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your Excel data here"
                    className="resize-none"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Paste data from Excel. Data should be in ["name" "product Id" "unit"] format. Each row should be separated by a new line and columns by tabs(space).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <Button type="button" onClick={()=>{setOpen(true);}} className="rounded-2xl font-semibold" variant="default" disabled={loading}>Submit</Button>
            <Button disabled={loading} className="rounded-2xl" variant="ghost" type="reset" onClick={()=>{form.reset(resetValues)}}>
              Clear form
            </Button>
          </div>
        </div>
      </form>
    </Form>
    {open && <DataConfirmDialog open={open} setOpen={setOpen} rows={getRows()} loading={loading} onSubmit={handleSubmit}/>}
    </div>
  );
};

type DataConfirmDialogProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading:boolean;
  open: boolean;
  rows: string[][];
  onSubmit: () => void;
};
const DataConfirmDialog: React.FC<DataConfirmDialogProps> = ({ open, setOpen, rows, loading, onSubmit }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col">
        <DialogHeader>
          <DialogTitle>Confirm Data before submitting</DialogTitle>
          <DialogDescription>
            Check all the row values and if the columns are separated properly. If not, then separate each row with a new line and each column with a space between.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-6 flex-1 overflow-scroll px-6 py-2">
          <div className="mt-2 rounded-md bg-slate-950 p-4">
            <code lang="JSON" className="text-white">{(JSON.stringify(rows, null, 2)).slice(2, -2).trim()}</code>
          </div>
        </div>
        <DialogFooter className="bg-opacity-40">
          <Button type="submit" onClick={onSubmit} className="rounded-2xl font-semibold" variant="default" disabled={loading} >
            {loading? 
              <div role="status">
                  <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
              : "Submit"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
