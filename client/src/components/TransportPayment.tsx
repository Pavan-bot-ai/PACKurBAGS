import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  ArrowLeft,
  CheckCircle,
  Lock
} from "lucide-react";

interface TransportPaymentProps {
  amount: number;
  onPaymentComplete: (paymentDetails: any) => void;
  bookingDetails: any;
}

interface PaymentDetails {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  walletProvider?: string;
  walletNumber?: string;
}

const TransportPayment = ({ amount, onPaymentComplete, bookingDetails }: TransportPaymentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'status'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [transactionId, setTransactionId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      icon: CreditCard,
      description: 'All major debit cards accepted'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using any UPI app'
    },
    {
      id: 'net_banking',
      name: 'Net Banking',
      icon: Building2,
      description: 'Online banking from all major banks'
    },
    {
      id: 'digital_wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'PayTM, PhonePe, Google Pay'
    }
  ];

  const createBookingMutation = useMutation({
    mutationFn: (bookingData: any) => 
      apiRequest('POST', '/api/transport-bookings', bookingData),
    onSuccess: (data) => {
      setTransactionId(data.transactionId);
      setCurrentStep('status');
      
      // Structure the payment result correctly for PaymentStatus component
      const paymentResult = {
        transactionId: data.transactionId,
        amount: amount,
        paymentMethod: selectedMethod,
        status: 'success',
        bookingDetails: {
          serviceName: bookingDetails.name || bookingDetails.serviceName,
          description: bookingDetails.description,
          ...bookingDetails
        }
      };
      
      onPaymentComplete(paymentResult);
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transport-bookings'] });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  });

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleProceedToPayment = () => {
    if (!selectedMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('details');
  };

  const handlePaymentSubmit = () => {
    if (!validatePaymentDetails()) {
      return;
    }

    setIsProcessing(true);
    
    const bookingData = {
      bookingType: bookingDetails.type || 'transport',
      serviceDetails: JSON.stringify({
        serviceName: bookingDetails.name || bookingDetails.serviceName,
        description: bookingDetails.description,
        ...bookingDetails
      }),
      amount: amount,
      paymentMethod: selectedMethod,
      paymentDetails: JSON.stringify(paymentDetails)
    };

    createBookingMutation.mutate(bookingData);
  };

  const validatePaymentDetails = () => {
    if (selectedMethod === 'credit_card' || selectedMethod === 'debit_card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || 
          !paymentDetails.cvv || !paymentDetails.cardholderName) {
        toast({
          title: "Incomplete Details",
          description: "Please fill all card details.",
          variant: "destructive"
        });
        return false;
      }
    } else if (selectedMethod === 'upi') {
      if (!paymentDetails.upiId) {
        toast({
          title: "Incomplete Details",
          description: "Please enter your UPI ID.",
          variant: "destructive"
        });
        return false;
      }
    } else if (selectedMethod === 'net_banking') {
      if (!paymentDetails.accountNumber || !paymentDetails.ifscCode || !paymentDetails.accountHolderName) {
        toast({
          title: "Incomplete Details",
          description: "Please fill all banking details.",
          variant: "destructive"
        });
        return false;
      }
    } else if (selectedMethod === 'digital_wallet') {
      if (!paymentDetails.walletProvider || !paymentDetails.walletNumber) {
        toast({
          title: "Incomplete Details",
          description: "Please fill all wallet details.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const updatePaymentDetails = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setCurrentStep('method');
    setSelectedMethod('');
    setPaymentDetails({});
    setTransactionId('');
    setIsProcessing(false);
  };

  const renderPaymentMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <p className="text-gray-600">Select your preferred payment option</p>
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{bookingDetails.name || bookingDetails.serviceName}</h4>
              <p className="text-sm text-gray-600">{bookingDetails.description || 'Transport booking'}</p>
            </div>
            <Badge variant="secondary" className="text-lg font-bold">
              ${amount}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedMethod === method.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    selectedMethod === method.id ? 'bg-orange-500 text-white' : 'bg-gray-100'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        onClick={handleProceedToPayment}
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={!selectedMethod}
      >
        Proceed to Payment
      </Button>
    </div>
  );

  const renderPaymentDetails = () => {
    const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep('method')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Payment Details</h3>
            <p className="text-sm text-gray-600">Enter your {selectedMethodData?.name} details</p>
          </div>
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{bookingDetails.name || bookingDetails.serviceName}</h4>
                <p className="text-sm text-gray-600">Payment Method: {selectedMethodData?.name}</p>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                ${amount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Secure Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber || ''}
                    onChange={(e) => updatePaymentDetails('cardNumber', e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate || ''}
                      onChange={(e) => updatePaymentDetails('expiryDate', e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv || ''}
                      onChange={(e) => updatePaymentDetails('cvv', e.target.value)}
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={paymentDetails.cardholderName || ''}
                    onChange={(e) => updatePaymentDetails('cardholderName', e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedMethod === 'upi' && (
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={paymentDetails.upiId || ''}
                  onChange={(e) => updatePaymentDetails('upiId', e.target.value)}
                />
              </div>
            )}

            {selectedMethod === 'net_banking' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="123456789012"
                    value={paymentDetails.accountNumber || ''}
                    onChange={(e) => updatePaymentDetails('accountNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    placeholder="HDFC0001234"
                    value={paymentDetails.ifscCode || ''}
                    onChange={(e) => updatePaymentDetails('ifscCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    placeholder="John Doe"
                    value={paymentDetails.accountHolderName || ''}
                    onChange={(e) => updatePaymentDetails('accountHolderName', e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedMethod === 'digital_wallet' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="walletProvider">Wallet Provider</Label>
                  <Select onValueChange={(value) => updatePaymentDetails('walletProvider', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paytm">PayTM</SelectItem>
                      <SelectItem value="phonepe">PhonePe</SelectItem>
                      <SelectItem value="googlepay">Google Pay</SelectItem>
                      <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletNumber">Wallet Number/UPI ID</Label>
                  <Input
                    id="walletNumber"
                    placeholder="9876543210 or yourname@paytm"
                    value={paymentDetails.walletNumber || ''}
                    onChange={(e) => updatePaymentDetails('walletNumber', e.target.value)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={handlePaymentSubmit}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </Button>
      </div>
    );
  };

  const renderPaymentStatus = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
        <p className="text-gray-600">Your booking has been confirmed</p>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Transaction ID:</span>
            <span className="font-mono text-sm">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Service:</span>
            <span>{bookingDetails.serviceName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Amount:</span>
            <span className="font-bold">${amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Payment Method:</span>
            <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          You can view this transaction in your Transactions history.
        </p>
        <Button onClick={resetForm} className="w-full">
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {currentStep === 'method' && renderPaymentMethodSelection()}
      {currentStep === 'details' && renderPaymentDetails()}
      {currentStep === 'status' && renderPaymentStatus()}
    </div>
  );
};

export default TransportPayment;