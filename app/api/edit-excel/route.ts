// pages/api/editExcel.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

interface Product {
  productId: string;
  description: string;
  quantity: number | string;
  amount: number | string;
  unitRate: number | string;
  qtybox?: number;
  qtyPerBoxes?: number;
}
const headers = {
  'Content-Disposition': 'attachment; filename=updated_purchase_order.xlsx',
  'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const filePath = path.resolve('public/po.xlsx');

export async function POST(
  req: Request,
) {

  const body = await req.json();

  const { rowIndex, products }: { rowIndex: number; products: Product[] } = body;

  if (typeof rowIndex !== 'number' || !Array.isArray(products)) {
    return new NextResponse("Invalid Request Body", { status: 400 });
  }

  try {
    // Load the predefined Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('Table1');

    if (sheet) {
      products.forEach((product, index) => {
        sheet.insertRow(rowIndex + index, [
          product.productId,
          product.description,
          product.quantity,
          product.amount,
          product.unitRate,
          product.qtybox || '',
          product.qtyPerBoxes || '',
        ]);
      });

      const buffer = await workbook.xlsx.writeBuffer();

      return new NextResponse(buffer, { headers });
    } else {
      return new NextResponse("Internal error", { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


      // const response = await axios.post('/api/edit-excel', { rowIndex:36, products:prodData }, {
      //   responseType: 'blob',
      // });

              //const blob = await response.data;
