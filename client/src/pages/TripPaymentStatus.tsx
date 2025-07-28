import { CheckCircle, Clock, XCircle, Home, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const TripPaymentStatus = () => {
  const [, setLocation] = useLocation();
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tripPaymentResult');
    if (stored) {
      const result = JSON.parse(stored);
      // Ensure all payments are successful
      result.status = 'successful';
      setPaymentResult(result);
    }
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'successful':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          message: 'Your trip payment has been processed successfully',
          bgColor: 'from-green-50 to-emerald-50',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800'
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Payment Pending',
          message: 'Your payment is being processed. You will receive confirmation shortly',
          bgColor: 'from-yellow-50 to-orange-50',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800'
        };
      case 'unsuccessful':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          message: 'There was an issue processing your payment. Please try again',
          bgColor: 'from-red-50 to-pink-50',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800'
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Payment Status Unknown',
          message: 'Please check your transaction history',
          bgColor: 'from-gray-50 to-slate-50',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800'
        };
    }
  };

  const handleGoHome = () => {
    // Clear temporary payment data
    localStorage.removeItem('tripPaymentResult');
    localStorage.removeItem('tripPaymentData');
    localStorage.removeItem('selectedTripPaymentMethod');
    setLocation('/');
  };

  const handleViewTransactions = () => {
    setLocation('/');
    // Simulate opening hamburger menu transactions
    setTimeout(() => {
      const hamburgerButton = document.querySelector('[aria-label="Open menu"]');
      if (hamburgerButton) {
        (hamburgerButton as HTMLElement).click();
      }
    }, 500);
  };

  const handleViewFinalPlan = () => {
    // Store flag to trigger final plan view
    localStorage.setItem('showFinalPlanFromPayment', 'true');
    
    // Redirect to booking flow - it will detect the flag and show final plan
    setLocation('/booking-flow');
  };

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(paymentResult.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Status</h1>
          <p className="text-gray-600">Trip payment transaction details</p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className={`bg-gradient-to-r ${statusInfo.bgColor} p-6 rounded-lg text-center`}>
              <StatusIcon className={`h-20 w-20 ${statusInfo.iconColor} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${statusInfo.titleColor} mb-2`}>
                {statusInfo.title}
              </h2>
              <p className={`${statusInfo.titleColor} opacity-80`}>
                {statusInfo.message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">${paymentResult.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">{paymentResult.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium capitalize ${
                  paymentResult.status === 'successful' ? 'text-green-600' :
                  paymentResult.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {paymentResult.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          {paymentResult?.status === 'successful' && (
            <Button 
              onClick={handleViewFinalPlan}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              View Final Plan
            </Button>
          )}
          
          <Button 
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            size="lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          
          <Button 
            onClick={handleViewTransactions}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Receipt className="h-5 w-5 mr-2" />
            View All Transactions
          </Button>
        </div>

        {/* Additional Info */}
        {paymentResult.status === 'successful' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm text-center">
              🎉 Your trip is now fully booked! Check your email for confirmation details.
            </p>
          </div>
        )}

        {paymentResult.status === 'unsuccessful' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800 text-sm text-center">
              Need help? Contact our support team at support@packyourbags.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPaymentStatus;