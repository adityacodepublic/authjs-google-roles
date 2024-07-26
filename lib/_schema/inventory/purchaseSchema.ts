import { z } from "zod";

export const formSchema = z.object({
  code: z.string().min(1, { message: "In code is required." }).optional(),
  user: z.string().min(1, { message: "User is required" }),
  supplierId: z.string().min(1, { message: "Supplier is required" }),
  products: z.array(
    z.object({
      productId: z.string().min(2, {
        message: "Product Id must be at least 2 characters.",
      }),
      description: z.string().min(5, {
        message: "Description must be at least 5 characters.",
      }),
      quantity: z.coerce.number().int().min(1, {
        message: "Quantity must be at least 1 characters.",
      }),
      amount: z.coerce.number().min(1, {message:"Amount must be at least one chracter"})
    })
  ).min(1, { message: "At least one product entry is required." }),
  totalPrice: z.coerce.number().min(1, {message:"Total amount must be at least one chracter"}),
  payment: z.boolean().default(true),
  paymentDays: z.coerce.number().min(1, {message:"Payment pending days should be a valid number"}),
  delivery: z.boolean().default(true),
  deliveryDays: z.coerce.number().min(1, {message:"Delivery pending days should be a valid number"}),
  updated: z.boolean().default(false),
  confirmed: z.boolean().default(true),
  poData: z.string().min(5, {message: "PO data must be at least 5 characters.",}).optional(),
  po: z.boolean().default(false).optional(),

  qtnNo: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
  qtnDate: z.coerce.date().optional(),
  unitRate: z.coerce.number().min(1, {message:"Rate must be at least one chracter"}).optional(),
  boxes: z.boolean().default(false).optional(),
  qtybox: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
  qtyPerBoxes: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
  igst:  z.coerce.number().min(1, {message:"IGST must be at least one chracter"}).optional(),
  sgst:  z.coerce.number().min(1, {message:"SGST must be at least one chracter"}).optional(),
  cgst:  z.coerce.number().min(1, {message:"CGST must be at least one chracter"}).optional(),
  transporter: z.string().min(5, {message: "Description must be at least 5 characters.",}).optional(),
  transportSelf: z.boolean().default(false)
});


formSchema.superRefine((data, ctx) => {
  if(data.boxes && !data.qtybox && !data.qtyPerBoxes){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Boxes details necessary if boxes ticked",
      path: ['boxes'],
    })
  };
  if(data.po && !data.qtnNo && !data.qtnDate && data.unitRate &&data.igst && data.sgst && data.cgst && data.transporter){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Fill the complete purchase order details",
      path: ['final'],
    })
  };
  return true;
});
