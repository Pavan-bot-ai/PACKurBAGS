import { CreditCard, Smartphone, Building, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const TripPaymentMethods = () => {
  const [, setLocation] = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

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
      description: "PayPal, Apple Pay, Google Pay, or other digital wallets"
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct transfer from your bank account"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: DollarSign,
      description: "Pay instantly using UPI (India)"
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('tripPaymentData');
    if (stored) {
      setPaymentData(JSON.parse(stored));
    }
  }, []);

  const handlePayNow = () => {
    if (selectedPaymentMethod) {
      // Store selected payment method
      localStorage.setItem('selectedTripPaymentMethod', selectedPaymentMethod);
      setLocation('/trip-payment-details');
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Payment Method</h1>
          <p className="text-gray-600">Select your preferred payment option</p>
        </div>

        {/* Payment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">Amount to Pay</h3>
                  <p className="text-sm text-gray-600">Activities, taxes, and service charges</p>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  ${paymentData.remainingAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <method.icon className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                    </Label>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Pay Now Button */}
        <div className="text-center">
          <Button 
            onClick={handlePayNow}
            disabled={!selectedPaymentMethod}
            className="w-full max-w-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
            size="lg"
          >
            {selectedPaymentMethod ? `Pay Now - $${paymentData.remainingAmount.toFixed(2)}` : 'Select Payment Method'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripPaymentMethods;