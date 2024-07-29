import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Purchase Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Enter company name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-number">PO No.</Label>
              <Input id="po-number" placeholder="Enter PO number" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotation-number">Qtn. No.</Label>
              <Input id="quotation-number" placeholder="Enter quotation number" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotation-date">Qtn. Date</Label>
              <Input id="quotation-date" type="date" />
            </div>
          </div>
          <div className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No.</TableHead>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Material Description</TableHead>
                  <TableHead>Qty. Unit</TableHead>
                  <TableHead>Unit Rate (Rs.)</TableHead>
                  <TableHead>Amount (Rs.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>PRD001</TableCell>
                  <TableCell>Acme Prism Tee</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>299.00</TableCell>
                  <TableCell>2,990.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>PRD002</TableCell>
                  <TableCell>Aqua Filters</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>49.00</TableCell>
                  <TableCell>245.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Amount Without Tax</Label>
              <div className="font-medium">Rs. 3,235.00</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>CGST</Label>
              <div className="font-medium">Rs. 290.15</div>
            </div>
            <div className="space-y-2">
              <Label>SGST</Label>
              <div className="font-medium">Rs. 290.15</div>
            </div>
            <div className="space-y-2">
              <Label>IGST</Label>
              <div className="font-medium">Rs. 0.00</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Grand Total Amount</Label>
              <div className="font-medium text-2xl">Rs. 3,815.30</div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Generate PO</Button>
      </CardFooter>
    </Card>
  )
}