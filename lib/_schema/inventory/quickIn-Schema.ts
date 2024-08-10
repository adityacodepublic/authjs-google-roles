import { z } from "zod";

export const extraData = z.object({
  boxes: z.boolean(),
  igst:  z.coerce.number().min(0, {message:"IGST must be at least one chracter"}),
  sgst:  z.coerce.number().min(0, {message:"SGST must be at least one chracter"}),
  cgst:  z.coerce.number().min(0, {message:"CGST must be at least one chracter"}),
})
export const formSchema = z.object({
  id: z.string().optional(),
  user: z.string().min(1, { message: "User is required" }),
  supplierId: z.string().min(1, { message: "Supplier is required" }),
  products: z.array(
    z.object({
      index: z.string().min(1),
      productId: z.string().min(2, {
        message: "Product Id must be at least 2 characters.",
      }),
      description: z.string().min(5, {
        message: "Description must be at least 5 characters.",
      }),
      quantity: z.coerce.number().int().min(1, {
        message: "Quantity must be at least 1 characters.",
      }).or(z.literal('')),
      amount: z.coerce.number().min(1, {message:"Amount must be at least one chracter"}).or(z.literal('')),
      unitRate: z.coerce.number().min(0,{message:"Unit Rate must be a valid number."}).or(z.literal('')),
      qtybox: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
      qtyPerBoxes: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
    })
  ).min(1, { message: "At least one product entry is required." }),
  totalPrice: z.coerce.number().min(1, {message:"Total amount must be at least one chracter"}),
  payment: z.boolean({message:"Select payment status"}),
  paymentDays: z.coerce.number().min(1, {message:"Payment pending days should be a valid number"}).optional().or(z.literal('')),
  delivery: z.boolean({message:"Select delivery status"}),
  deliveryDays: z.coerce.number().min(1, {message:"Delivery pending days should be a valid number"}).optional().or(z.literal('')),
  updated: z.boolean().default(false),// in normal in 
  confirmed: z.boolean().default(false),// in confirmed click by admin
  po: z.boolean().default(false),
  
  boxes: z.boolean(),
  igst:  z.coerce.number().min(0, {message:"IGST must be at least one chracter"}),
  sgst:  z.coerce.number().min(0, {message:"SGST must be at least one chracter"}),
  cgst:  z.coerce.number().min(0, {message:"CGST must be at least one chracter"}),
}).superRefine((data, ctx) => {
  if(data.payment == false && (data.paymentDays === undefined || data.paymentDays === null || data.paymentDays === '')){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "If Payment is not completed then pending days required",
      path: ['payment'],
    })
  };
  if(data.delivery == false && (data.deliveryDays === undefined || data.deliveryDays === null || data.deliveryDays === '')){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "If Delivery is not completed then pending days required",
      path: ['delivery'],
    })
  };
  if (data.boxes) {
    data.products.forEach((e, index) => {
      if (!e.qtyPerBoxes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Qty per box",
          path: [`products`, index, `qtyPerBoxes`],
        });
      }
      if (!e.qtybox) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity in box required",
          path: [`products`, index, `qtybox`],
        });
      }
    });
  };
  data.products.forEach((d, index) => {
    if (!d.productId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product ID is required",
        path: [`products`, index, `productId`],
      });
    }
    if (!d.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantity is required",
        path: [`products`, index, `quantity`],
      });
    }
    if (!d.unitRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Unit rate is required",
        path: [`products`, index, `unitRate`],
      });
    }
    if (!d.amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount is required",
        path: [`products`, index, `amount`],
      });
    }
    if (!d.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required",
        path: [`products`, index, `description`],
      });
    }
  });
  return true;
});


export const products = z.object({
  index: z.string(),
  productId: z.string(),
  description: z.string(),
  quantity: z.number().int(),
  unitRate: z.number().int(),
  boxes: z.string(),
  amount: z.number().int()
});
export const InStockSchema = z.object({
  user: z.string(), 
  supplierId: z.string(),
  products: z.array(products),
  totalPrice: z.number(),
  payment: z.boolean().default(true),
  paymentDays: z.number().default(0),
  delivery: z.boolean().default(true),
  deliveryDays: z.number().default(0),
  updated: z.boolean().default(false),
  confirmed: z.boolean().default(true), 
  po: z.boolean().default(false),
  poData: z.string().nullable(),
});


export const formSchemaProduct = z.object({
  index: z.string().min(1),
  productId: z.string().min(2, {
    message: "Product Id must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  quantity: z.coerce.number().int().min(1, {
    message: "Quantity must be at least 1 characters.",
  }).or(z.literal('')),
  amount: z.coerce.number().min(1, {message:"Amount must be at least one chracter"}).or(z.literal('')),
  unitRate: z.coerce.number().min(0,{message:"Unit Rate must be a valid number."}).or(z.literal('')),
  qtybox: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
  qtyPerBoxes: z.coerce.number().min(1, {message:"Quatation number must be at least one chracter"}).optional(),
});