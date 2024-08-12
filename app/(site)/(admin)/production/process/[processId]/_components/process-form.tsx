"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Process, ProcessFlow, Supplier } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formSchema } from "@/lib/_schema/product-processSchema"
import { AlertModal } from "@/components/alert-modal";
import { Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { deleteProcess, submitProcess, updateProcess } from "@/actions/process-form-actions";


interface ProcessFormProps {
  initialData: (ProcessFlow & { process: Process[] }) | null;
}
export const ProcessForm:React.FC<ProcessFormProps> = ({
  initialData
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);


  const resetValues = {
    name: "",
    process: [{ name: "", position:1 }],
  };


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData? initialData : resetValues
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "process",
  });



  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      let response;
      if(initialData) response = await updateProcess(data,initialData.name)
      else response = await submitProcess(data);
      if (response.status == 200) {
        toast.success(initialData? "Process Updated" : "Process Created");
        router.refresh();
        router.back();
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
      if(initialData?.name){
        const user_delete = await deleteProcess(initialData.name) 
        if(user_delete.status === 200){
          toast.success('Process deleted.');
          router.refresh();
          router.push(`/orders`);
        }
        else toast.error('Something went wrong.');
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
              <h1 className="text-3xl font-bold">Process</h1>
              <p className="text-muted-foreground pt-1">{initialData? "Update process data here.":"Add new process here"}</p>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Name <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Process Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the production process.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`process.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Process {index + 1} <span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                  >
                    Move Up
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => move(index, index + 1)}
                    disabled={index === fields.length - 1}
                  >
                    Move Down
                  </Button>
                  <Button variant="destructive" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ name: "", position:fields.length + 1 })}
            >
              <Plus className="h-4 w-4" />Add Name
              {form.formState.errors && <span className="pl-4 text-red-500">{form.formState.errors.process?.message}</span>}
            </Button>

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
        </div>
        </form>
      </Form>
    </>
  );
}
