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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { Report } from "@prisma/client";
import { deleteReport, submitReport, updateReport } from "@/actions/form-actions/report-actions";
import { formSchema } from "@/lib/_schema/reports/reports-schema";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { AlertModal } from "@/components/alert-modal";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/location-select";
import { Checkbox } from "@/components/ui/checkbox";

interface TextareaProps {
  initialData: Report | null
}
export const ReportForm:React.FC<TextareaProps> = ({
 initialData
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const resetValues = {
    name:"",
    phoneno:"",
    title:"",
    description:"",
    address:"",
    type:"",
    latitude:0,
    longitude:0,
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : resetValues
  });

  const handleValueChange = (location: { lat: number; lng: number }) => {
    form.setValue("latitude", location.lat);
    form.setValue("longitude", location.lng);
  };

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      let response;
      if(initialData) response = await updateReport(data,initialData.id)
      else response = await submitReport(data);
      console.log(response);
      if (response.status === 200) {
        toast.success(initialData? "Report Updated" : "Report Created");
        // router.refresh();
        // router.push(`/orders`);
      } else if(response.status === 401) {
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
        const user_delete = await deleteReport(initialData?.id) 
        toast.success('Report deleted.');
        router.refresh();
        // router.push(`/orders`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:max-w-2xl mx-auto mt-14 bg-white border rounded-xl shadow-md ">
        <div className="bg-[#fffece] h-2 rounded-t-xl mx-[0.105rem]"></div>
        <div className="p-6 space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground pt-1">{initialData? "Update report data here.":"Add new report here"}</p>
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
        <div className=" space-y-10 *:">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name<span className="text-red-600">*</span></FormLabel>
                <FormDescription>Enter reporters name</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone No.<span className="text-red-600">*</span></FormLabel>
                <FormDescription>Enter reporters phone no</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title of the incident<span className="text-red-600">*</span></FormLabel>
                <FormDescription>Enter the title of the incident</FormDescription>
                <FormControl>
                  <Input placeholder="Your answer" disabled={loading } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Description<span className="text-red-600">*</span></FormLabel>
                <FormDescription>
                  describe the incident in detail.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="description"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Address<span className="text-red-600">*</span></FormLabel>
                <FormDescription>
                  address of the incident.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="incident address"
                    disabled={loading}
                    {...field}
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
                <FormLabel>Select the type of incident<span className="text-red-600">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <LocationPicker onValueChange={handleValueChange} />
          <FormField
            control={form.control}
            name="valid"
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
                    Report Verified ?
                  </FormLabel>
                  <FormMessage/>
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <Button className="rounded-2xl bg-[#46646a] hover:bg-[#3281a6] font-semibold " variant="default" type="submit" disabled={loading} >
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
        </div>
      </form>
    </Form>
    </>
  );
};
