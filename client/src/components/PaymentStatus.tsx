import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Receipt, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PaymentStatusProps {
  paymentResult: any;
  onContinue: () => void;
}

const PaymentStatus = ({ paymentResult, onContinue }: PaymentStatusProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveTransactionMutation = useMutation({
    mutationFn: async (transactionData: any) => {
      return apiRequest("POST", "/api/transactions", transactionData);
    },
    onSuccess: () => {
      toast({
        title: "Transaction Saved",
        description: "Your transaction has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save transaction details.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Save transaction to database
    if (paymentResult && !isSaving && paymentResult.transactionId && paymentResult.amount) {
      setIsSaving(true);
      
      const transactionData = {
        transactionId: paymentResult.transactionId,
        amount: (paymentResult.amount || 0).toString(),
        paymentMethod: paymentResult.paymentMethod || "unknown",
        paymentStatus: paymentResult.status || "pending",
        bookingType: "transport",
        bookingDetails: JSON.stringify(paymentResult.bookingDetails || {}),
        userId: 1 // In a real app, this would come from the authenticated user
      };

      saveTransactionMutation.mutate(transactionData);
    }
  }, [paymentResult]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case "failed":
        return <XCircle className="h-16 w-16 text-red-600" />;
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-600" />;
      default:
        return <Clock className="h-16 w-16 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return {
          title: "Payment Successful!",
          description: "Your transportation booking has been confirmed.",
          color: "text-green-600"
        };
      case "failed":
        return {
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          color: "text-red-600"
        };
      case "pending":
        return {
          title: "Payment Pending",
          description: "Your payment is being processed. You will receive a confirmation soon.",
          color: "text-yellow-600"
        };
      default:
        return {
          title: "Processing...",
          description: "Please wait while we process your payment.",
          color: "text-gray-600"
        };
    }
  };

  const statusInfo = getStatusText(paymentResult?.status || "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {getStatusIcon(paymentResult?.status || "pending")}
            <div>
              <h2 className={`text-2xl font-bold ${statusInfo.color}`}>
                {statusInfo.title}
              </h2>
              <p className="text-gray-600 mt-2">{statusInfo.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono font-medium">{paymentResult?.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">${paymentResult?.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="capitalize">{paymentResult?.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge 
                variant={paymentResult?.status === "success" ? "default" : 
                        paymentResult?.status === "failed" ? "destructive" : "secondary"}
              >
                {paymentResult?.status || "pending"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {paymentResult?.bookingDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span>{paymentResult.bookingDetails.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span>{paymentResult.bookingDetails.seatClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{paymentResult.bookingDetails.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span>{paymentResult.bookingDetails.departureTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={onContinue}
          disabled={paymentResult?.status === "pending"}
          className="flex items-center gap-2"
          size="lg"
        >
          {paymentResult?.status === "success" ? "Continue to Next Step" : "Back to Booking"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatus;