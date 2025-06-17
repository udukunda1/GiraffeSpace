"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const PaymentCheckout = () => {
  const [method, setMethod] = useState("credit");

  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Payment Method Form */}
      <div className="border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Complete Your Booking</h2>
        <p className="text-sm text-gray-500 mb-4">Select your preferred payment method</p>

        {/* Tabs */}
        <div className="flex space-x-3 mb-6">
          {["credit", "paypal", "momo"].map((m) => (
            <button
              key={m}
              className={`px-4 py-2 rounded-md border ${
                method === m
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setMethod(m)}
            >
              {m === "credit"
                ? "Credit Card"
                : m === "paypal"
                ? "PayPal"
                : "Mobile Money"}
            </button>
          ))}
        </div>

        {/* Dynamic Form */}
        {method === "credit" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border p-3 rounded-lg"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 border p-3 rounded-lg"
              />
              <input
                type="number"
                placeholder="CVV"
                className="w-1/2 border p-3 rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
              />
            </div>
            <input
              type="text"
              placeholder="Name on Card"
              className="w-full border p-3 rounded-lg"
            />
          </div>
        )}

        {method === "paypal" && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="PayPal Email"
              className="w-full border p-3 rounded-lg"
            />
          </div>
        )}

        {method === "momo" && (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Mobile Money Number"
              className="w-full border p-3 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Right: Booking Summary & Help Section */}
      <div className="border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        {/* Booking Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-2 mb-4">
            <Calendar className="text-blue-600 w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">Annual Conference</p>
              <p className="text-sm text-gray-500">
                April 15, 2025 · 9:00 AM – 5:00 PM
              </p>
              <p className="text-sm text-gray-500">Main Conference Hall</p>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Ticket Price</span>
              <span>$99.00</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>$4.95</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>$103.95</span>
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            🧾 Complete Payment
          </button>
        </div>

        {/* Need Help Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <h4 className="font-semibold text-lg mb-1">Need Help?</h4>
          <p className="text-sm text-gray-500 mb-3">
            If you have any questions about your booking or payment, please
            contact our support team.
          </p>
          <p className="text-sm font-medium">support@eventsmanagementsystem.com</p>
          <p className="text-sm text-gray-800">+25 078 243-3539</p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default PaymentCheckout;
