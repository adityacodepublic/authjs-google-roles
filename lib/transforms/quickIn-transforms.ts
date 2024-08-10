import { InStock, ProductIn } from "@prisma/client";
import { extraData, formSchema, InStockSchema } from "../_schema/inventory/quickIn-Schema";
import { z } from "zod";


interface UpdatedProduct extends ProductIn {
  qtybox?: number;
  qtyPerBoxes?: number;
};

function extractQuantities(boxes: string | null): { qtybox: number|undefined; qtyPerBoxes: number|undefined } {
  if (boxes === null) {
    return {
      qtybox: undefined,
      qtyPerBoxes: undefined
    };
  };
  const regex = /^\s*(\d+)\s*\*\s*(\d+)\s*$/;
  const match = boxes.match(regex);
  if (match) {
      const [qtybox, qtyPerBoxes] = match;
      return {
          qtybox: parseInt(qtybox, 10),
          qtyPerBoxes: parseInt(qtyPerBoxes, 10)
      };
  } else {
      console.error("Boxes string format is incorrect");
      return {
        qtybox: undefined,
        qtyPerBoxes: undefined
      };
  };
};

export function getInstock(InStock: InStock & {products:ProductIn[]}):z.infer<typeof formSchema> | null {
  const updatedProducts = InStock.products.map(product => {
      const quantities = extractQuantities(product.boxes); 
      const updatedProduct: UpdatedProduct = {
          ...product,
          ...quantities,
      }
      const { boxes, instockId, id,  ...productWithoutBoxes } = updatedProduct;
      return productWithoutBoxes;
  });

  const formData= () => {
    if(InStock && InStock.poData != null){
      return JSON.parse(InStock.poData);
    }
    else return null;
  };
  const parsed = extraData.safeParse(formData());
  const {products, poData, updatedAt,paymentDays, deliveryDays, ...otherData} = InStock; 
  const paymentd=()=>{
    if(paymentDays===0) return undefined;
    else return paymentDays
  };
  const deliveryd=()=>{
    if(deliveryDays===0) return undefined;
    else return deliveryDays
  }
  if(parsed.data){
    const finalInstock = {...otherData, products:updatedProducts, ...parsed.data, paymentDays:paymentd(), deliveryDays:deliveryd()};
    return finalInstock;
  }
  else return null;
};


export const transformPoData = (data: z.infer<typeof formSchema>):z.infer<typeof InStockSchema> =>{
  const removeFields = (obj:any, fields:string[]) => {
    const newObj = {...obj};
    fields.forEach(field => delete newObj[field]);
    return newObj;
  };
  const PoData = JSON.stringify(removeFields(data,["id","user","supplierId","products","totalPrice","payment","paymentDays","delivery","deliveryDays","updated","confirmed","po"]));
  const transformData = {
    user:data.user,
    supplierId:data.supplierId,
    products: data.products.map((item) => ({
      index: item.index,
      productId: item.productId,
      description: item.description,
      quantity: item.quantity !=="" ? item.quantity : 0,
      unitRate: item.unitRate !=="" ? item.unitRate : 0.0,
      amount: item.amount !=="" ? item.amount : 0.0,
      boxes: item.qtybox !== undefined && item.qtyPerBoxes !== undefined ? `${item.qtybox} * ${item.qtyPerBoxes}` : ""
    })),
    totalPrice:data.totalPrice,
    payment:data.payment,
    paymentDays:parseInt(data.paymentDays?.toString() || "0"),
    delivery:data.delivery,
    deliveryDays:parseInt(data.deliveryDays?.toString() || "0"),
    updated:data.updated,
    confirmed:data.confirmed,
    po:data?.po || false,
    poData:PoData

  };
  return transformData;
} 