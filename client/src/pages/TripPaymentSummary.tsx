import { Calculator, CreditCard, Plane, Building, MapPin, Receipt, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const TripPaymentSummary = () => {
  const [, setLocation] = useLocation();
  const [totalBudget] = useState(3500); // Mock total budget
  const [transportationCost] = useState(1200);
  const [hotelCost] = useState(950);
  const [activitiesCost] = useState(450);
  const [taxesAndFees] = useState(280);
  const [serviceCharges] = useState(120);

  const totalPaid = transportationCost + hotelCost;
  const remainingAmount = activitiesCost + taxesAndFees + serviceCharges;
  const grandTotal = totalPaid + remainingAmount;

  const handleMakePayment = () => {
    // Store payment summary data
    const paymentData = {
      totalBudget,
      transportationCost,
      hotelCost,
      activitiesCost,
      taxesAndFees,
      serviceCharges,
      totalPaid,
      remainingAmount,
      grandTotal
    };
    localStorage.setItem('tripPaymentData', JSON.stringify(paymentData));
    setLocation('/trip-payment-methods');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Trip Payment Summary</h1>
          <p className="text-gray-600">Complete breakdown of your travel expenses</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Total Budget</span>
                    <span className="text-2xl font-bold text-blue-800">${totalBudget.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Amount Paid</span>
                    <span className="text-xl font-bold text-green-800">${totalPaid.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700 font-medium">Remaining to Pay</span>
                    <span className="text-xl font-bold text-orange-800">${remainingAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Transportation</span>
                  </div>
                  <span className="font-semibold text-green-800">${transportationCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Hotels</span>
                  </div>
                  <span className="font-semibold text-green-800">${hotelCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-700">Activities & Itineraries</span>
                  </div>
                  <span className="font-semibold text-orange-800">${activitiesCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-700">Taxes & Fees</span>
                  </div>
                  <span className="font-semibold text-orange-800">${taxesAndFees.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-700">Service Charges</span>
                  </div>
                  <span className="font-semibold text-orange-800">${serviceCharges.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Grand Total</h3>
                  <p className="text-gray-600">Complete trip cost breakdown</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-800">${grandTotal.toFixed(2)}</div>
                  <div className="text-sm text-purple-600">
                    Remaining: ${remainingAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Action */}
        <div className="text-center">
          <Button 
            onClick={handleMakePayment}
            className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Make Payment (${remainingAmount.toFixed(2)})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripPaymentSummary;