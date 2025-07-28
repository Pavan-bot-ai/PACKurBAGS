
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from "lucide-react";

interface TransactionStatusProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: any;
  onTransactionSaved: (transaction: any) => void;
}

const TransactionStatus = ({ isOpen, onClose, paymentData, onTransactionSaved }: TransactionStatusProps) => {
  const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'pending'>('processing');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (isOpen && paymentData) {
      // Simulate payment processing
      const timer = setTimeout(() => {
        const outcomes = ['success', 'failed', 'pending'];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] as any;
        setStatus(randomOutcome);
        
        const txnId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
        setTransactionId(txnId);
        
        // Save transaction to localStorage (simulating database)
        const transaction = {
          id: txnId,
          amount: paymentData.amount,
          method: paymentData.method,
          status: randomOutcome,
          timestamp: new Date().toISOString(),
          bookingId: paymentData.bookingId,
          type: 'Transportation'
        };
        
        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        existingTransactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(existingTransactions));
        
        onTransactionSaved(transaction);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, paymentData, onTransactionSaved]);

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: RefreshCw,
          title: 'Processing Payment',
          message: 'Please wait while we process your payment...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          iconClass: 'animate-spin'
        };
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          message: 'Your transportation has been booked successfully.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          iconClass: ''
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          message: 'There was an issue processing your payment. Please try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          iconClass: ''
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Payment Pending',
          message: 'Your payment is being verified. You will receive a confirmation shortly.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          iconClass: ''
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleClose = () => {
    setStatus('processing');
    setTransactionId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Status</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <Card className={statusConfig.bgColor}>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}>
                  <StatusIcon className={`w-8 h-8 ${statusConfig.color} ${statusConfig.iconClass}`} />
                </div>
                
                <div>
                  <h3 className={`text-xl font-semibold ${statusConfig.color}`}>
                    {statusConfig.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{statusConfig.message}</p>
                </div>

                {transactionId && (
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-mono text-sm font-medium">{transactionId}</p>
                  </div>
                )}

                {paymentData && (
                  <div className="bg-white p-3 rounded-lg border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${paymentData.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">{paymentData.method}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {status !== 'processing' && (
          <Button onClick={handleClose} className="w-full">
            {status === 'success' ? 'Continue' : 'Close'}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionStatus;
