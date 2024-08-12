"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/actions/user-actions";
import toast from "react-hot-toast";
import { z } from "zod";
import { userSchema } from "@/lib/_schema/settings/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";



type user = {
  id:    string,
  name:  string,
  email: string,
  image: string,
  role:  string,  
} 
type UserFormProps = {
  data: user
}
export const UserForm:React.FC<UserFormProps> = ({
  data,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(data.role);
  const disabled = data.role === inputValue;
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {id:data.id, role:data.role} 
  });

  const onSubmit = async(data: z.infer<typeof userSchema>) => {
    setAccordionValue("");
    try {
      setLoading(true);
      const update = await updateUser({id:data.id, role:data.role});
      if(update.status === 200){
        toast.success('Role Updated');        
      }
      else toast.error('Something went wrong.');
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);


  return (
    <>
    <Accordion
      key={data.email.slice(2,11)}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={data.email.slice(2,11)}>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-[#EBEBEB19]">
              {data.name}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <AccordionTrigger disabled={loading}>Edit</AccordionTrigger>
          </div>
        </div>
        <AccordionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 p-5 w-full md:max-w-[85%] mx-auto mt-11 bg-white border rounded-xl shadow-md ">
            <div className="grid w-full gap-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2 col-span-2">
                    <FormLabel>Role<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user role" disabled={loading} {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setInputValue(e.target.value);                      
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={disabled || loading} size="xs">
              Save
            </Button>
          </form>
        </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </>
  );
};