
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard,
  Smartphone,
  Building2,
  Wallet
} from "lucide-react";

interface PaymentPageProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: any;
  onPaymentComplete: (paymentDetails: any) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay with Visa, Mastercard, or other cards'
  },
  {
    id: 'upi',
    name: 'UPI Payment',
    icon: Smartphone,
    description: 'Pay using UPI apps like GPay, PhonePe'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'Pay directly from your bank account'
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: Wallet,
    description: 'Pay using Paytm, Amazon Pay, etc.'
  }
];

const PaymentPage = ({ isOpen, onClose, bookingDetails, onPaymentComplete }: PaymentPageProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    upiId: '',
    bankAccount: '',
    walletNumber: ''
  });

  const handlePaymentDetailsChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayNow = () => {
    const paymentData = {
      method: selectedMethod,
      amount: bookingDetails?.price || 299,
      details: paymentDetails,
      bookingId: bookingDetails?.id,
      timestamp: new Date().toISOString(),
      status: "success", // Always successful
      transactionId: `TXN-${Date.now()}`
    };
    onPaymentComplete(paymentData);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                value={paymentDetails.cardHolder}
                onChange={(e) => handlePaymentDetailsChange('cardHolder', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'upi':
        return (
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="yourname@paytm"
              value={paymentDetails.upiId}
              onChange={(e) => handlePaymentDetailsChange('upiId', e.target.value)}
            />
          </div>
        );
      
      case 'netbanking':
        return (
          <div>
            <Label htmlFor="bankAccount">Bank Account Number</Label>
            <Input
              id="bankAccount"
              placeholder="Enter your account number"
              value={paymentDetails.bankAccount}
              onChange={(e) => handlePaymentDetailsChange('bankAccount', e.target.value)}
            />
          </div>
        );
      
      case 'wallet':
        return (
          <div>
            <Label htmlFor="walletNumber">Wallet Phone Number</Label>
            <Input
              id="walletNumber"
              placeholder="Enter registered mobile number"
              value={paymentDetails.walletNumber}
              onChange={(e) => handlePaymentDetailsChange('walletNumber', e.target.value)}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const isFormComplete = () => {
    if (!selectedMethod) return false;
    
    switch (selectedMethod) {
      case 'card':
        return paymentDetails.cardNumber && paymentDetails.expiryDate && 
               paymentDetails.cvv && paymentDetails.cardHolder;
      case 'upi':
        return paymentDetails.upiId;
      case 'netbanking':
        return paymentDetails.bankAccount;
      case 'wallet':
        return paymentDetails.walletNumber;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{bookingDetails?.provider}</p>
                  <p className="text-sm text-gray-600">{bookingDetails?.seatType} Class</p>
                </div>
                <div className="text-xl font-bold">${bookingDetails?.price}</div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Select Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="mt-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Payment Form */}
          {selectedMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPaymentForm()}
              </CardContent>
            </Card>
          )}

          {/* Pay Button */}
          <Button 
            onClick={handlePayNow}
            disabled={!isFormComplete()}
            className="w-full"
            size="lg"
          >
            Pay Now - ${bookingDetails?.price}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPage;
