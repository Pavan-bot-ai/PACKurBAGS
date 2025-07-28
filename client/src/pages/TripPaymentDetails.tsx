import { CreditCard, Smartphone, Building, DollarSign, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

const TripPaymentDetails = () => {
  const [, setLocation] = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedMethod = localStorage.getItem('selectedTripPaymentMethod');
    const storedData = localStorage.getItem('tripPaymentData');
    
    if (storedMethod) setSelectedPaymentMethod(storedMethod);
    if (storedData) setPaymentData(JSON.parse(storedData));
  }, []);

  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const isPaymentDetailsComplete = () => {
    switch (selectedPaymentMethod) {
      case "credit_card":
        return paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv && paymentDetails.cardholderName;
      case "digital_wallet":
        return paymentDetails.walletEmail && paymentDetails.walletProvider;
      case "bank_transfer":
        return paymentDetails.bankAccount && paymentDetails.routingNumber && paymentDetails.accountHolder;
      case "upi":
        return paymentDetails.upiId;
      default:
        return false;
    }
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case "credit_card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber || ""}
                onChange={(e) => handlePaymentDetailChange("cardNumber", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate || ""}
                  onChange={(e) => handlePaymentDetailChange("expiryDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv || ""}
                  onChange={(e) => handlePaymentDetailChange("cvv", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentDetails.cardholderName || ""}
                onChange={(e) => handlePaymentDetailChange("cardholderName", e.target.value)}
              />
            </div>
          </div>
        );

      case "digital_wallet":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="walletEmail">Email Address</Label>
              <Input
                id="walletEmail"
                type="email"
                placeholder="john@example.com"
                value={paymentDetails.walletEmail || ""}
                onChange={(e) => handlePaymentDetailChange("walletEmail", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="walletProvider">Wallet Provider</Label>
              <RadioGroup
                value={paymentDetails.walletProvider || ""}
                onValueChange={(value) => handlePaymentDetailChange("walletProvider", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple_pay" id="apple_pay" />
                  <Label htmlFor="apple_pay">Apple Pay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google_pay" id="google_pay" />
                  <Label htmlFor="google_pay">Google Pay</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "bank_transfer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                placeholder="1234567890"
                value={paymentDetails.bankAccount || ""}
                onChange={(e) => handlePaymentDetailChange("bankAccount", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                placeholder="123456789"
                value={paymentDetails.routingNumber || ""}
                onChange={(e) => handlePaymentDetailChange("routingNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input
                id="accountHolder"
                placeholder="John Doe"
                value={paymentDetails.accountHolder || ""}
                onChange={(e) => handlePaymentDetailChange("accountHolder", e.target.value)}
              />
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="user@paytm"
                value={paymentDetails.upiId || ""}
                onChange={(e) => handlePaymentDetailChange("upiId", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Always successful payment outcome
      const randomOutcome = 'successful';
      
      // Create transaction record
      const transactionData = {
        userId: 1, // Mock user ID
        transactionId: `TXN-${Date.now()}`,
        amount: paymentData.remainingAmount.toFixed(2),
        paymentMethod: selectedPaymentMethod,
        paymentStatus: randomOutcome === 'successful' ? 'completed' : randomOutcome,
        bookingType: 'trip',
        bookingDetails: JSON.stringify({
          activitiesCost: paymentData.activitiesCost,
          taxesAndFees: paymentData.taxesAndFees,
          serviceCharges: paymentData.serviceCharges,
          totalAmount: paymentData.remainingAmount,
          paymentDetails: paymentDetails
        })
      };

      const transaction = await apiRequest('POST', '/api/transactions', transactionData);
      
      // Store payment result for status page
      localStorage.setItem('tripPaymentResult', JSON.stringify({
        status: randomOutcome,
        transactionId: transaction.id,
        amount: paymentData.remainingAmount,
        paymentMethod: selectedPaymentMethod,
        bookingType: 'trip',
        paymentDetails: paymentDetails
      }));
      
      setLocation('/trip-payment-status');
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData || !selectedPaymentMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const getPaymentMethodIcon = () => {
    switch (selectedPaymentMethod) {
      case "credit_card": return CreditCard;
      case "digital_wallet": return Smartphone;
      case "bank_transfer": return Building;
      case "upi": return DollarSign;
      default: return CreditCard;
    }
  };

  const PaymentIcon = getPaymentMethodIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Details</h1>
          <p className="text-gray-600">Enter your payment information securely</p>
        </div>

        {/* Payment Amount */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PaymentIcon className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-gray-800">Payment Amount</span>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  ${paymentData.remainingAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secure Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderPaymentForm()}
          </CardContent>
        </Card>

        {/* Pay Button */}
        <div className="text-center">
          <Button 
            onClick={handlePayment}
            disabled={!isPaymentDetailsComplete() || isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
            size="lg"
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${paymentData.remainingAmount.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripPaymentDetails;