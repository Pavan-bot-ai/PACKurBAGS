import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Calendar, Download, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: number;
  transactionId: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: string;
  bookingType: string;
  bookingDetails: string;
  createdAt: string;
  userId: number | null;
}

const Transactions = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch both regular transactions and transport bookings
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ["/api/transactions?userId=1"],
  });

  const { data: transportBookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["/api/transport-bookings"],
  });

  const isLoading = transactionsLoading || bookingsLoading;
  const error = transactionsError || bookingsError;

  // Combine and normalize transaction data
  const allTransactions = [
    ...transactions.map((t: Transaction) => ({
      ...t,
      type: 'legacy',
      serviceName: (() => {
        try {
          const details = JSON.parse(t.bookingDetails);
          return details.provider || t.bookingType;
        } catch {
          return t.bookingType;
        }
      })(),
      amount: parseFloat(t.amount),
      createdAt: t.createdAt,
    })),
    ...transportBookings.map((b: any) => ({
      id: b.id,
      transactionId: b.transactionId,
      amount: parseFloat(b.amount),
      paymentMethod: b.paymentMethod,
      paymentStatus: b.paymentStatus,
      bookingType: b.bookingType,
      type: 'transport',
      serviceName: (() => {
        try {
          const details = JSON.parse(b.serviceDetails);
          return details.serviceName || b.bookingType;
        } catch {
          return b.bookingType;
        }
      })(),
      createdAt: b.createdAt,
      serviceDetails: b.serviceDetails,
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredTransactions = allTransactions.filter((transaction: any) => {
    const matchesSearch = 
      transaction.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || transaction.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalAmount = (status?: string) => {
    const relevantTransactions = status ? 
      filteredTransactions.filter((t: any) => t.paymentStatus === status) : 
      filteredTransactions;
    return relevantTransactions.reduce((sum: number, transaction: any) => 
      sum + transaction.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading transactions. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                ${getTotalAmount("success").toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                ${getTotalAmount("pending").toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Pending Amount</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                ${getTotalAmount("failed").toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Failed Transactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {filteredTransactions.length}
              </div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "success" ? "default" : "outline"}
              onClick={() => setFilterStatus("success")}
              size="sm"
            >
              Success
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "failed" ? "default" : "outline"}
              onClick={() => setFilterStatus("failed")}
              size="sm"
            >
              Failed
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions found matching your criteria.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction: any) => {
              let serviceDetails;
              try {
                if (transaction.type === 'transport') {
                  serviceDetails = JSON.parse(transaction.serviceDetails);
                } else {
                  serviceDetails = JSON.parse(transaction.bookingDetails || '{}');
                }
              } catch {
                serviceDetails = { serviceName: "Unknown Service", provider: "Unknown Service" };
              }

              const getTransactionIcon = () => {
                if (transaction.type === 'transport') {
                  switch (transaction.bookingType) {
                    case 'taxi': return '🚕';
                    case 'ticket': return '🎫';
                    case 'service': return '🛎️';
                    default: return '💳';
                  }
                }
                return '💳';
              };

              return (
                <Card key={`${transaction.type}-${transaction.id}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">{getTransactionIcon()}</span>
                          <h3 className="font-semibold">
                            {transaction.serviceName || serviceDetails.provider || "Transport Booking"}
                          </h3>
                          <Badge className={getStatusColor(transaction.paymentStatus)}>
                            {transaction.paymentStatus}
                          </Badge>
                          {transaction.type === 'transport' && (
                            <Badge variant="outline" className="text-xs">
                              New System
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>ID: {transaction.transactionId}</span>
                          <span>Date: {new Date(transaction.createdAt).toLocaleDateString()}</span>
                          <span>Payment: {transaction.paymentMethod.replace('_', ' ')}</span>
                          <span>Type: {transaction.bookingType}</span>
                        </div>
                        
                        {/* Enhanced details for transport bookings */}
                        {transaction.type === 'transport' && transaction.bookingType === 'taxi' && serviceDetails.pickup && (
                          <div className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                            <span>{serviceDetails.pickup}</span>
                            <span className="mx-2">→</span>
                            <span>{serviceDetails.dropoff || 'Destination'}</span>
                          </div>
                        )}
                        
                        {transaction.type === 'transport' && transaction.bookingType === 'ticket' && serviceDetails.destination && (
                          <div className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                            Destination: {serviceDetails.destination}
                            {serviceDetails.quantity && ` • ${serviceDetails.quantity} tickets`}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ₹{transaction.amount.toLocaleString()}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLocation(`/transaction-details/${transaction.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;