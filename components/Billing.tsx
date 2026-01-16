import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  CreditCard, 
  Download, 
  Eye, 
  FileText, 
  IndianRupee, 
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Printer
} from "lucide-react";

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  services: Array<{
    name: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
  hospital: string;
  doctor: string;
  paymentMethod?: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
  transactionId: string;
}

export function Billing() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Sample data with Indian names and medical centers
  const invoices: Invoice[] = [
    {
      id: "INV-2024-001",
      patientName: "Rajesh Kumar",
      patientId: "PAT-001",
      date: "2024-01-15",
      amount: 5500,
      status: "paid",
      services: [
        { name: "General Consultation", quantity: 1, rate: 800, total: 800 },
        { name: "Blood Test (Complete Blood Count)", quantity: 1, rate: 450, total: 450 },
        { name: "ECG", quantity: 1, rate: 300, total: 300 },
        { name: "Chest X-Ray", quantity: 1, rate: 600, total: 600 },
        { name: "Medicines", quantity: 1, rate: 3350, total: 3350 }
      ],
      hospital: "Apollo Hospital, Delhi",
      doctor: "Dr. Priya Sharma",
      paymentMethod: "UPI"
    },
    {
      id: "INV-2024-002",
      patientName: "Sunita Devi",
      patientId: "PAT-002",
      date: "2024-01-18",
      amount: 12800,
      status: "pending",
      services: [
        { name: "Specialist Consultation (Cardiologist)", quantity: 1, rate: 1500, total: 1500 },
        { name: "2D Echo", quantity: 1, rate: 2200, total: 2200 },
        { name: "Stress Test", quantity: 1, rate: 3500, total: 3500 },
        { name: "Lipid Profile", quantity: 1, rate: 800, total: 800 },
        { name: "Cardiac Medications", quantity: 1, rate: 4800, total: 4800 }
      ],
      hospital: "Fortis Hospital, Mumbai",
      doctor: "Dr. Arjun Patel"
    },
    {
      id: "INV-2024-003",
      patientName: "Mohammed Ali",
      patientId: "PAT-003",
      date: "2024-01-20",
      amount: 8900,
      status: "overdue",
      services: [
        { name: "Orthopedic Consultation", quantity: 1, rate: 1200, total: 1200 },
        { name: "MRI Scan (Knee)", quantity: 1, rate: 4500, total: 4500 },
        { name: "Physiotherapy (5 sessions)", quantity: 5, rate: 400, total: 2000 },
        { name: "Pain Relief Injections", quantity: 2, rate: 600, total: 1200 }
      ],
      hospital: "AIIMS, New Delhi",
      doctor: "Dr. Vikram Singh"
    },
    {
      id: "INV-2024-004",
      patientName: "Lakshmi Iyer",
      patientId: "PAT-004",
      date: "2024-01-22",
      amount: 6700,
      status: "paid",
      services: [
        { name: "Gynecology Consultation", quantity: 1, rate: 1000, total: 1000 },
        { name: "Ultrasound", quantity: 1, rate: 1200, total: 1200 },
        { name: "Blood Tests (Hormonal)", quantity: 1, rate: 2500, total: 2500 },
        { name: "Prenatal Vitamins", quantity: 1, rate: 2000, total: 2000 }
      ],
      hospital: "Manipal Hospital, Bangalore",
      doctor: "Dr. Kavita Reddy",
      paymentMethod: "Credit Card"
    },
    {
      id: "INV-2024-005",
      patientName: "Amit Gupta",
      patientId: "PAT-005",
      date: "2024-01-25",
      amount: 15600,
      status: "pending",
      services: [
        { name: "Emergency Consultation", quantity: 1, rate: 2000, total: 2000 },
        { name: "CT Scan (Head)", quantity: 1, rate: 3500, total: 3500 },
        { name: "Blood Tests (Complete Panel)", quantity: 1, rate: 1800, total: 1800 },
        { name: "ICU Charges (2 days)", quantity: 2, rate: 4000, total: 8000 },
        { name: "Emergency Medications", quantity: 1, rate: 300, total: 300 }
      ],
      hospital: "Max Hospital, Gurgaon",
      doctor: "Dr. Sanjay Mehta"
    }
  ];

  const payments: Payment[] = [
    {
      id: "PAY-001",
      invoiceId: "INV-2024-001",
      amount: 5500,
      date: "2024-01-16",
      method: "UPI (PhonePe)",
      status: "completed",
      transactionId: "TXN123456789"
    },
    {
      id: "PAY-002",
      invoiceId: "INV-2024-004",
      amount: 6700,
      date: "2024-01-23",
      method: "Credit Card (HDFC)",
      status: "completed",
      transactionId: "TXN987654321"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    // Create a simple invoice document
    const invoiceContent = `
      MEDICAL INVOICE
      
      Invoice ID: ${invoice.id}
      Date: ${invoice.date}
      
      Hospital: ${invoice.hospital}
      Doctor: ${invoice.doctor}
      
      Patient: ${invoice.patientName}
      Patient ID: ${invoice.patientId}
      
      SERVICES:
      ${invoice.services.map(service => 
        `${service.name} - Qty: ${service.quantity} - Rate: ₹${service.rate} - Total: ₹${service.total}`
      ).join('\n')}
      
      TOTAL AMOUNT: ₹${invoice.amount}
      Status: ${invoice.status.toUpperCase()}
      ${invoice.paymentMethod ? `Payment Method: ${invoice.paymentMethod}` : ''}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadReceipt = (payment: Payment) => {
    const invoice = invoices.find(inv => inv.id === payment.invoiceId);
    const receiptContent = `
      PAYMENT RECEIPT
      
      Receipt ID: ${payment.id}
      Date: ${payment.date}
      
      Invoice ID: ${payment.invoiceId}
      Patient: ${invoice?.patientName}
      
      Amount Paid: ₹${payment.amount}
      Payment Method: ${payment.method}
      Transaction ID: ${payment.transactionId}
      Status: ${payment.status.toUpperCase()}
      
      Thank you for your payment!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const makePayment = (invoice: Invoice) => {
    if (!paymentMethod) return;
    
    // Simulate payment processing
    alert(`Payment of ₹${invoice.amount} processed successfully via ${paymentMethod} for ${invoice.patientName}`);
    setPaymentMethod("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Billing & Payments</h2>
          <p className="text-muted-foreground">
            Manage invoices, payments, and download medical documents
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹48,500</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹28,400</div>
            <p className="text-xs text-muted-foreground">
              3 invoices pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overdue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹8,900</div>
            <p className="text-xs text-muted-foreground">
              1 invoice overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">This Month</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹37,600</div>
            <p className="text-xs text-muted-foreground">
              8 transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Manage and track all medical billing invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>{invoice.hospital.split(',')[0]}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Invoice Details - {invoice.id}</DialogTitle>
                                <DialogDescription>
                                  Complete invoice breakdown and payment options
                                </DialogDescription>
                              </DialogHeader>
                              {selectedInvoice && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Patient Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <User className="h-4 w-4" />
                                          <span>{selectedInvoice.patientName}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <FileText className="h-4 w-4" />
                                          <span>ID: {selectedInvoice.patientId}</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Hospital Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Building className="h-4 w-4" />
                                          <span>{selectedInvoice.hospital}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <User className="h-4 w-4" />
                                          <span>{selectedInvoice.doctor}</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Services & Charges</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Rate</TableHead>
                                            <TableHead>Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedInvoice.services.map((service, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{service.name}</TableCell>
                                              <TableCell>{service.quantity}</TableCell>
                                              <TableCell>₹{service.rate}</TableCell>
                                              <TableCell>₹{service.total}</TableCell>
                                            </TableRow>
                                          ))}
                                          <TableRow className="font-semibold">
                                            <TableCell colSpan={3}>Total Amount</TableCell>
                                            <TableCell>₹{selectedInvoice.amount}</TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>

                                  {selectedInvoice.status !== "paid" && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Make Payment</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex space-x-4 items-end">
                                          <div className="flex-1">
                                            <Label htmlFor="payment-method">Payment Method</Label>
                                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="upi">UPI</SelectItem>
                                                <SelectItem value="credit-card">Credit Card</SelectItem>
                                                <SelectItem value="debit-card">Debit Card</SelectItem>
                                                <SelectItem value="net-banking">Net Banking</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <Button onClick={() => makePayment(selectedInvoice)}>
                                            Pay ₹{selectedInvoice.amount}
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  <div className="flex space-x-2">
                                    <Button onClick={() => downloadInvoice(selectedInvoice)}>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download Invoice
                                    </Button>
                                    <Button variant="outline">
                                      <Printer className="mr-2 h-4 w-4" />
                                      Print
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadInvoice(invoice)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Track all completed and pending payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReceipt(payment)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Report</CardTitle>
                <CardDescription>
                  Download detailed financial reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Select Month</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan-2024">January 2024</SelectItem>
                      <SelectItem value="dec-2023">December 2023</SelectItem>
                      <SelectItem value="nov-2023">November 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
                <CardDescription>
                  Generate GST and tax documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quarter">Select Quarter</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q4-2023">Q4 2023</SelectItem>
                      <SelectItem value="q3-2023">Q3 2023</SelectItem>
                      <SelectItem value="q2-2023">Q2 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download GST Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}