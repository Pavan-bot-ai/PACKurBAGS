import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Car, 
  Plane, 
  Train, 
  MapPin, 
  Calendar,
  Clock,
  ChevronRight,
  Receipt
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TransportBooking {
  id: number;
  bookingType: string;
  serviceDetails: string;
  amount: string;
  paymentMethod: string;
  paymentDetails: string;
  transactionId: string;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

interface TransactionTabProps {
  onClose?: () => void;
}

const TransactionsTab = ({ onClose }: TransactionTabProps) => {
  // Fetch transport bookings/transactions
  const { data: bookings = [], isLoading } = useQuery<TransportBooking[]>({
    queryKey: ['/api/transport-bookings'],
  });

  const getBookingIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'taxi':
        return <Car className="h-5 w-5 text-yellow-600" />;
      case 'ticket':
        return <Plane className="h-5 w-5 text-blue-600" />;
      case 'service':
        return <MapPin className="h-5 w-5 text-green-600" />;
      default:
        return <Receipt className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <span className="text-xs font-bold">UPI</span>;
      case 'net_banking':
        return <span className="text-xs font-bold">NET</span>;
      case 'digital_wallet':
        return <span className="text-xs font-bold">WALLET</span>;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const parseServiceDetails = (details: string) => {
    try {
      return JSON.parse(details);
    } catch {
      return { serviceName: details };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
            <Badge variant="secondary" className="ml-2">
              {bookings.length}
            </Badge>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {bookings.length === 0 ? (
            <div className="text-center py-8 px-6">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-sm text-gray-600">
                Your booking transactions will appear here once you make a purchase.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {bookings.map((booking, index) => {
                const serviceDetails = parseServiceDetails(booking.serviceDetails);
                
                return (
                  <div key={booking.id}>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {getBookingIcon(booking.bookingType)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {serviceDetails.serviceName || `${booking.bookingType} Booking`}
                              </p>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(booking.paymentStatus)}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              Transaction ID: <span className="font-mono text-xs">{booking.transactionId}</span>
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  {getPaymentMethodIcon(booking.paymentMethod)}
                                  <span className="capitalize">
                                    {booking.paymentMethod.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{Number(booking.amount).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            {/* Service specific details */}
                            {booking.bookingType === 'taxi' && serviceDetails.pickup && (
                              <div className="mt-2 text-xs text-gray-500">
                                <span>{serviceDetails.pickup}</span>
                                <ChevronRight className="h-3 w-3 inline mx-1" />
                                <span>{serviceDetails.dropoff || 'Destination'}</span>
                              </div>
                            )}
                            
                            {booking.bookingType === 'ticket' && serviceDetails.destination && (
                              <div className="mt-2 text-xs text-gray-500">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                <span>{serviceDetails.destination}</span>
                                {serviceDetails.quantity && (
                                  <span className="ml-2">({serviceDetails.quantity} tickets)</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < bookings.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;