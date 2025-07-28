import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Receipt, Home } from "lucide-react";
import { useLocation } from "wouter";

const PaymentStatus = () => {
  const [, setLocation] = useLocation();
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    const result = localStorage.getItem('paymentResult');
    if (result) {
      setPaymentResult(JSON.parse(result));
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case 'unsuccessful':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case 'successful':
        return 'Payment Successful!';
      case 'pending':
        return 'Payment Pending';
      case 'unsuccessful':
        return 'Payment Failed';
      default:
        return 'Payment Status';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'successful':
        return 'Your hotel booking has been confirmed. You will receive a confirmation email shortly.';
      case 'pending':
        return 'Your payment is being processed. You will be notified once the payment is complete.';
      case 'unsuccessful':
        return 'Your payment could not be processed. Please try again or use a different payment method.';
      default:
        return '';
    }
  };

  const handleReturnHome = () => {
    localStorage.removeItem('paymentResult');
    localStorage.removeItem('hotelBookingData');
    setLocation('/');
  };

  const handleContinueToBookingFlow = () => {
    // Set flag to indicate hotel booking is complete
    localStorage.setItem('hotelBookingComplete', 'true');
    localStorage.setItem('returnToBookingFlow', 'step4');
    localStorage.removeItem('paymentResult');
    localStorage.removeItem('hotelBookingData');
    setLocation('/booking-flow?step=4');
  };

  const handleViewTransactions = () => {
    setLocation('/transactions');
  };

  if (!paymentResult) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              {getStatusIcon(paymentResult.status)}
            </div>
            <CardTitle className="text-2xl mb-2">
              {getStatusTitle(paymentResult.status)}
            </CardTitle>
            <p className="text-gray-600">
              {getStatusMessage(paymentResult.status)}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="font-mono text-sm">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-medium">${(paymentResult.amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="capitalize">{paymentResult.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Type</span>
                <span className="capitalize">{paymentResult.bookingType}</span>
              </div>
              {paymentResult.bookingDetails && (
                <>
                  <div className="flex justify-between">
                    <span>Hotel</span>
                    <span>{paymentResult.bookingDetails.hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type</span>
                    <span>{paymentResult.bookingDetails.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in</span>
                    <span>{new Date(paymentResult.bookingDetails.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out</span>
                    <span>{new Date(paymentResult.bookingDetails.checkOutDate).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleReturnHome}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
              <Button
                onClick={handleViewTransactions}
                variant="outline"
                className="flex-1"
              >
                <Receipt className="h-4 w-4 mr-2" />
                View Transactions
              </Button>
            </div>

            {/* Additional Actions for Failed Payments */}
            {paymentResult.status === 'unsuccessful' && (
              <Button
                onClick={() => setLocation('/hotel-payment')}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStatus;