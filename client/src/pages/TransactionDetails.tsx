import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";

const TransactionDetails = () => {
  const [, setLocation] = useLocation();
  const params = useParams();
  const tripId = params.tripId;

  // Placeholder data - will be replaced with database fetch based on tripId
  const transactionDetails = {
    referenceId: "",
    paymentMethod: "",
    amountPaid: "",
    amountReceived: "",
    date: "",
    status: ""
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/transactions")}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
        </div>

        {/* Content */}
        {!transactionDetails.referenceId ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No transaction details found</div>
            <div className="text-gray-400">Trip ID: {tripId}</div>
          </div>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <p className="text-gray-600">Trip ID: {tripId}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reference ID</p>
                    <p className="font-medium">{transactionDetails.referenceId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{transactionDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">${transactionDetails.amountPaid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Received</p>
                    <p className="font-medium">${transactionDetails.amountReceived}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{transactionDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{transactionDetails.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;