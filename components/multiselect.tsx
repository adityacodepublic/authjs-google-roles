"use client";

import { Check, ChevronsUpDown, Edit2, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertModal } from "@/components/alert-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, forwardRef, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";
import { createProductCategory, deleteProductCategory, updateProductCategory } from "@/actions/product-form-action";

type Data = {
  id: string, name: string; icon?: React.ComponentType<{ className?: string }>;
};

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  data: {
    /** The text to display for the option. */
    id: string;
    /** The unique value associated with the option. */
    name: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string | string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
  
  /**
   * Limit to Number of selections.
   * Optional
   */
  multiselectlimit?: number;
  
  /**
   * multiselect or singleSelect.
   */
  multiselect?: boolean;
  
  /**
   * Option to edit the fields, options.
   */
  editableFields?: boolean;

  /**
   * Allow adding new fields by the user.
   * Requires custom submit logic to be setup in the component.  
   */
  addNewFields?: boolean
  
  /**
   * Pass in the loading state
   * Optional, can be used to add custom styles.
   */
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MultiSelect = forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      data,
      onValueChange,
      defaultValue = [],
      placeholder = "Select options",
      asChild = false,
      className,
      multiselect = false,
      multiselectlimit,
      addNewFields = true,
      editableFields = true,
      loading,
      setLoading,
      ...props
    },
    ref
  ) => {  
    
    const params = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const [frameworks, setFrameworks] = useState<Data[]>(data);
    const [selectedValues, setSelectedValues] = useState<Data[]>(frameworks.filter(item => defaultValue.includes(item.id)));
    const [openCombobox, setOpenCombobox] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const transformMultiselect = () =>{if(multiselect){if(multiselectlimit){selectedValues.slice(0, multiselectlimit + 1)}; return selectedValues.map((item)=>(item.id));} else return selectedValues.map((item)=>(item.id))[0];}
    
    const createFramework = async (name: string) => {
    try {
      setLoading(true);
      const create =  await createProductCategory(name);
      if('id' in create){
        toast.success('Filter Group Created');
        const newFramework = {
          id: create.id,
          name: name,
        };
        setFrameworks((prev) => [...prev, newFramework]);
        if(!(selectedValues.length>=(multiselectlimit || Infinity))) {
          setSelectedValues((prev) => [...prev, newFramework])
        };
        setInputValue('');
      }
      else toast.error('Something went wrong.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const updateFramework = async(framework: typeof data[0], newFramework: typeof data[0]) => {
    try {
      setLoading(true);
      const update = await updateProductCategory(framework.id, newFramework.name);
      if(update.status === 200){
        toast.success('Product Category Updated');
        setFrameworks((prev) =>
          prev.map((f) => (f.id === framework.id ? newFramework : f))
        );
        setSelectedValues((prev) =>
          prev.map((f) => (f.id === framework.id ? newFramework : f))
        );
        
      }
      else toast.error('Something went wrong.');
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const deleteFramework = async(framework: typeof data[0]) => {
    try {
      setLoading(true);
      const deleteCategory = await deleteProductCategory(framework.id);
      if(deleteCategory.status === 200){
        setFrameworks((prev) => prev.filter((f) => f.id !== framework.id));
        setSelectedValues((prev) =>
          prev.filter((f) => f.id !== framework.id)
        );
        toast.success(`${framework.name} group Deleted`);
      }
      else toast.error('Something went wrong.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFramework = (framework: Data) => {
    if(multiselect){
      setSelectedValues((currentFrameworks) =>
        currentFrameworks.some((f) => f.id === framework.id)
          ? currentFrameworks.filter((f) => f.id !== framework.id)
          : [...currentFrameworks, framework]
      );
      inputRef?.current?.focus();
    }
    else{
      setSelectedValues([framework]);
      
    }
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur();
    setOpenCombobox(value);
  };

  useEffect(() => {
    onValueChange(transformMultiselect());
  }, [selectedValues]);  

  return (
  <>
    <div className="max-w-[400px] flex flex-row gap-4">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger disabled={loading} asChild>
          <Button
            variant="outline"
            ref={ref}
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[300px] justify-between text-foreground"
          >
              <span className="truncate">
                {selectedValues.length === 0 && placeholder}
                {selectedValues.length === 1 && selectedValues[0]?.name}
                {selectedValues.length === 2 &&
                  selectedValues.map(({ name }) => name).join(", ")}
                {selectedValues.length > 2 &&
                  `${selectedValues.length} groups selected`}
              </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" onEscapeKeyDown={() => setOpenCombobox(false)}>
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search..."
              value={inputValue}
              disabled={loading}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {multiselectlimit && selectedValues.length>=multiselectlimit && <CommandItem> <div>Only {multiselectlimit} groups allowed</div></CommandItem>}
                {frameworks.map((framework) => {
                  const isActive = selectedValues.some((f) => f.id === framework.id);
                  return (
                    <CommandItem
                      key={framework.id}
                      value={framework.id}
                      onSelect={() => toggleFramework(framework)}
                      disabled={(selectedValues.length>=(multiselectlimit || Infinity) && !isActive && multiselect ) || loading}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">{framework.icon && (<framework.icon className="mr-2 h-4 w-4 text-muted-foreground" />)}{framework.name}</div>
                    </CommandItem>
                  );
                })}
                { addNewFields &&
                  <CommandItemCreate
                    onSelect={() => createFramework(inputValue)}
                    {...{ inputValue, frameworks, loading }}
                  />
                }
              </CommandGroup>
              { editableFields && 
                <>
                <CommandSeparator alwaysRender/>
                <CommandGroup>
                  <CommandItem
                    value={`:${inputValue}:`} // HACK: that way, the edit button will always be shown
                    className="text-xs text-muted-foreground"
                    onSelect={() => setOpenDialog(true)}
                    disabled={loading}
                  >
                    <div className={cn("mr-2 h-4 w-4")} />
                    <Edit2 className="mr-2 h-2.5 w-2.5" />
                    Edit Categories
                  </CommandItem>
                </CommandGroup>
                </>
              }
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      { editableFields &&   
        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenCombobox(true);
            }
            setOpenDialog(open);
          }}
        >
          <DialogContent className="flex max-h-[90vh] flex-col">
            <DialogHeader>
              <DialogTitle>Edit Labels</DialogTitle>
              <DialogDescription>
                Change the label names or delete the labels. Create a label
                through the combobox though.
              </DialogDescription>
            </DialogHeader>
            <div className="-mx-6 flex-1 overflow-scroll px-6 py-2">
              {frameworks.map((framework) => {
                return (
                  <DialogListItem
                    data={framework}
                    key={framework.id}
                    loading={loading}
                    onDelete={() => deleteFramework(framework)}
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const target = e.target as typeof e.target &
                        Record<"name", {value:string} >;
                      const newFramework = {
                        id: framework.id,
                        name: target.name.value,
                      };
                      updateFramework(framework, newFramework);
                    }}
                    {...framework}
                  />
                );
              })}
            </div>
            <DialogFooter className="bg-opacity-40">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </div>     
  { multiselect && 
    <div className="mb-24 mt-12 overflow-y-auto">
      {selectedValues.length > 0 && 
        selectedValues.map((data, index) => (
          <Badge
            key={data.id + index}
            variant="outline"
            className="mb-2 mr-2 bg-[#ebebeb1919]"
          >
            {data.name}
          </Badge>
        ))
      }
    </div>}
  </>
);
}
);


const CommandItemCreate = ({
  inputValue,
  frameworks,
  onSelect,
  loading,
}: {
  inputValue: string;
  frameworks: {id: string, name: string;}[];
  onSelect: () => void;
  loading: boolean;
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
      disabled={loading}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new label &quot;{inputValue}&quot;
    </CommandItem>
  );
};


type DialogListItemProps = {
  data: {id: string, name: string;}
  loading: boolean;
}
const DialogListItem = ({
  data,
  onSubmit,
  onDelete,
  loading,
}: DialogListItemProps & {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(data.name);
  const disabled = data.name === inputValue;
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
    <>
    <AlertModal 
    isOpen={open} 
    onClose={() => setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />
    <Accordion
      key={data.id}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={data.id}>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-[#EBEBEB19]">
              {data.name}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <AccordionTrigger disabled={loading}>Edit</AccordionTrigger>
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
          </div>
        </div>
        <AccordionContent>
          <form
            className="flex items-end gap-4"
            onSubmit={(e) => {
              onSubmit(e);
              e.preventDefault();
              setAccordionValue("");
            }}
          >
            <div className="grid w-full gap-3">
              <Label htmlFor="name">Group name</Label>
              <Input
                ref={inputRef}
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={disabled || loading} size="xs">
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </>
  );
};

MultiSelect.displayName = "Multiselect";