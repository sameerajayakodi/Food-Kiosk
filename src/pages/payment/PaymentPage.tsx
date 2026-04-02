import { CheckCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { formatCurrency } from "../../utils/helpers";

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, markOrderPaid, addToast } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const order = getOrderById(orderId || "");

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-emerald-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            This order doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      markOrderPaid(order.id);
      addToast("Payment successful! 🎉", "success");
    }, 2000);
  };

  const alreadyPaid = order.paymentStatus === "paid" || isSuccess;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-6 text-4xl">🍽️</div>
            <div className="absolute bottom-2 left-8 text-3xl">💳</div>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              {alreadyPaid ? (
                <CheckCircle className="w-9 h-9 text-white" />
              ) : (
                <CreditCard className="w-9 h-9 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {alreadyPaid ? "Payment Complete!" : "Complete Payment"}
            </h1>
            <p className="text-emerald-100 text-sm mt-1">Order {order.id}</p>
          </div>
        </div>

        <div className="px-6 py-6">
          {alreadyPaid ? (
            /* Success State */
            <div className="text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-14 h-14 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-emerald-900 mb-1">
                Payment Successful!
              </h2>
              <p className="text-slate-600">
                Please collect your order when ready.
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 mt-6 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-emerald-900">
                      {item.quantity}× {item.product.name}
                    </span>
                    <span className="font-medium text-emerald-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="h-px bg-emerald-200 my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-900">Total Paid</span>
                  <span className="text-emerald-600 text-lg">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 text-emerald-600 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Transaction verified
              </div>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                Return to Home
              </button>
            </div>
          ) : (
            /* Payment Form */
            <>
              {/* Order Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-sm text-emerald-900 mb-3 uppercase tracking-wider">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-700">
                        {item.quantity}× {item.product.name}
                      </span>
                      <span className="font-medium text-emerald-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-emerald-200 my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-emerald-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-slate-50 rounded-2xl p-4 inline-block">
                  <QRCodeSVG
                    value={`foodkiosk-payment:${order.id}:${order.total}`}
                    size={140}
                    fgColor="#047857"
                    bgColor="#F8FAFC"
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Scan to pay with your mobile wallet
                </p>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2
                  ${
                    isProcessing
                      ? "bg-slate-400 text-white cursor-wait"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-xl"
                  }`}
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  `Pay ${formatCurrency(order.total)}`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-slate-600 text-xs">
                <Lock className="w-3.5 h-3.5" />
                Secure simulated payment
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
