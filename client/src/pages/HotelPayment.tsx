import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Smartphone, Building, ArrowLeft, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const HotelPayment = () => {
  const [, setLocation] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit_card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay securely with your credit or debit card"
    },
    {
      id: "digital_wallet",
      name: "Digital Wallet",
      icon: Smartphone,
      description: "Pay with PayPal, Apple Pay, or Google Pay"
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct transfer from your bank account"
    }
  ];

  useEffect(() => {
    const data = localStorage.getItem('hotelBookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      setLocation('/hotel-booking');
    }
  }, [setLocation]);

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowPaymentForm(true);
  };

  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
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
                placeholder="987654321"
                value={paymentDetails.routingNumber || ""}
                onChange={(e) => handlePaymentDetailChange("routingNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                placeholder="John Doe"
                value={paymentDetails.accountHolderName || ""}
                onChange={(e) => handlePaymentDetailChange("accountHolderName", e.target.value)}
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
      
      // Create transaction record with proper schema
      const transactionData = {
        userId: 1, // Mock user ID
        transactionId: `TXN-${Date.now()}`,
        amount: (bookingData.totalAmount / 100).toFixed(2), // Convert to decimal string with 2 decimals
        paymentMethod: selectedPaymentMethod,
        paymentStatus: randomOutcome === 'successful' ? 'completed' : randomOutcome,
        bookingType: 'hotel',
        bookingDetails: JSON.stringify({
          hotelName: bookingData.hotel.name,
          roomType: bookingData.roomType,
          numberOfRooms: bookingData.numberOfRooms,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate
        })
      };

      const transaction = await apiRequest('POST', '/api/transactions', transactionData);
      
      // Store payment result for status page
      localStorage.setItem('paymentResult', JSON.stringify({
        status: randomOutcome,
        transactionId: transaction.id,
        amount: bookingData.totalAmount,
        paymentMethod: selectedPaymentMethod,
        bookingType: 'hotel',
        bookingDetails: bookingData
      }));
      
      setLocation('/payment-status');
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPaymentDetailsComplete = () => {
    switch (selectedPaymentMethod) {
      case "credit_card":
        return paymentDetails.cardNumber && paymentDetails.expiryDate && 
               paymentDetails.cvv && paymentDetails.cardholderName;
      case "digital_wallet":
        return paymentDetails.walletEmail && paymentDetails.walletProvider;
      case "bank_transfer":
        return paymentDetails.bankAccount && paymentDetails.routingNumber && 
               paymentDetails.accountHolderName;
      default:
        return false;
    }
  };

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/hotel-booking")}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Hotel Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Hotel</span>
                <span className="font-medium">{bookingData.hotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Type</span>
                <span>{bookingData.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Rooms</span>
                <span>{bookingData.numberOfRooms}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in</span>
                <span>{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span>{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span>{bookingData.groupMembers}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>${(bookingData.totalAmount / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={handlePaymentMethodSelect}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            {showPaymentForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderPaymentForm()}
                </CardContent>
              </Card>
            )}

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || !isPaymentDetailsComplete() || isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              size="lg"
            >
              {isProcessing ? 'Processing Payment...' : `Pay $${(bookingData.totalAmount / 100).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPayment;