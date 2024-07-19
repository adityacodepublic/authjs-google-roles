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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

type Filter = {
  id:string,
  feature:boolean,
  name:string,
  value:{id:string, value:number | undefined, unit:string}[],
};

type Data = {
  id: string, name: string;
};
interface MultiSelectProps{
  data: Data[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValues: Data[];
  setSelectedValues: React.Dispatch<React.SetStateAction<Data[]>>;
  limit?: number;
}

export const FancyBox: React.FC<MultiSelectProps> = ({data, loading, setLoading, selectedValues, setSelectedValues, limit}) => {
  const params = useParams();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [frameworks, setFrameworks] = useState<Data[]>(data);

  const createFramework = async (name: string) => {
    try {
      setLoading(true);
      const create =  await axios.post(`/api/${params.storeId}/filterGroup`, {name});
      toast.success('Filter Group Created');
      const newFramework = {
        id: create.data.id,
        name: name,
      };
      setFrameworks((prev) => [...prev, newFramework]);
      if(!(selectedValues.length>=(limit || Infinity))) {setSelectedValues((prev) => [...prev, newFramework])};
      setInputValue('');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFramework = (framework: Data) => {
    setSelectedValues((currentFrameworks) =>
      currentFrameworks.some((f) => f.id === framework.id)
        ? currentFrameworks.filter((f) => f.id !== framework.id)
        : [...currentFrameworks, framework]
    );
    inputRef?.current?.focus();
  };

  const updateFramework = async(framework: typeof data[0], newFramework: typeof data[0]) => {
    try {
      setLoading(true);
      const data = {
        id:framework.id,
        name:newFramework.name
      }
      await axios.patch(`/api/${params.storeId}/filterGroup/${framework.id}`, data);
      toast.success('Filter Group Updated');
      setFrameworks((prev) =>
        prev.map((f) => (f.id === framework.id ? newFramework : f))
      );
      setSelectedValues((prev) =>
        prev.map((f) => (f.id === framework.id ? newFramework : f))
      );
    } catch (error: any) {
      console.log(error.response.data);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const deleteFramework = async(framework: typeof data[0]) => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/filterGroup/${framework.id}`);
      setFrameworks((prev) => prev.filter((f) => f.id !== framework.id));
      setSelectedValues((prev) =>
        prev.filter((f) => f.id !== framework.id)
      );
      toast.success(`${framework.name} group Deleted`);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur();
    setOpenCombobox(value);
  };

  useEffect(() => {
    if (limit) {
      selectedValues.slice(0, limit + 1);
    }
  }, [selectedValues, limit]);  

  return (
  <>
    <div className="max-w-[300px] flex flex-row gap-4">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger disabled={loading} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[250px] justify-between text-foreground"
          >
              <span className="truncate">
                {selectedValues.length === 0 && "Select filter groups"}
                {selectedValues.length === 1 && selectedValues[0]?.name}
                {selectedValues.length === 2 &&
                  selectedValues.map(({ name }) => name).join(", ")}
                {selectedValues.length > 2 &&
                  `${selectedValues.length} filter groups selected`}
              </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Create Filter Group..."
              value={inputValue}
              disabled={loading}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {limit && selectedValues.length>=limit && <CommandItem> <div>Only {limit} groups allowed</div></CommandItem>}
                {frameworks.map((framework) => {
                  const isActive = selectedValues.some((f) => f.id === framework.id);
                  return (
                    <CommandItem
                      key={framework.id}
                      value={framework.id}
                      onSelect={() => toggleFramework(framework)}
                      disabled={(selectedValues.length>=(limit || Infinity) && !isActive ) || loading}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">{framework.name}</div>
                    </CommandItem>
                  );
                })}
                <CommandItemCreate
                  onSelect={() => createFramework(inputValue)}
                  {...{ inputValue, frameworks }}
                />
              </CommandGroup>
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
                  Edit Labels
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
    </div>     
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
    </div>
  </>
);
}


type DialogListItemProps = {
  data: {id: string, name: string;}
  loading: boolean;
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


  useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {/* REMINDER: size="xs" */}
                <Button variant="destructive" disabled={loading} size="xs">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete the label{" "}
                    <Badge variant="outline"className="bg-[#EBEBEB19]">
                      {data.name}
                    </Badge>{" "}
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
  );
};