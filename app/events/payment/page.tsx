"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const PaymentCheckout = () => {
  const [method, setMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);

    if (value.length < 13 || value.length > 19) {
      setCardError("Please use a valid card number.");
    } else {
      setCardError("");
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d]/g, "").slice(0, 6); // max MMYYYY
    let formatted = input;

    if (input.length >= 3) {
      formatted = `${input.slice(0, 2)}/${input.slice(2)}`;
    }

    setExpiry(formatted);

    if (input.length === 6) {
      const mm = parseInt(input.slice(0, 2));
      const yyyy = parseInt(input.slice(2));

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (
        mm < 1 || mm > 12 ||
        yyyy < currentYear ||
        (yyyy === currentYear && mm < currentMonth)
      ) {
        setExpiryError("Please enter a valid future expiry date (MM/YYYY).");
      } else {
        setExpiryError("");
      }
    } else {
      setExpiryError("Expiry must be in MM/YYYY format.");
    }
  };

  return (
    <>
    <Header  activePage="events"/>
    <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Side */}
      <div className="border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Complete Your Booking</h2>
        <p className="text-sm text-gray-500 mb-4">Select your preferred payment method</p>

        {/* Payment Method Tabs */}
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
              {m === "credit" ? "Credit Card" : m === "paypal" ? "PayPal" : "Mobile Money"}
            </button>
          ))}
        </div>

        {/* Dynamic Form */}
        {method === "credit" && (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full border p-3 rounded-lg"
              />
              {cardError && <p className="text-sm text-red-500 mt-1">{cardError}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={expiry}
                onChange={handleExpiryChange}
                className="w-full border p-3 rounded-lg"
              />
              {expiryError && <p className="text-sm text-red-500 mt-1">{expiryError}</p>}
            </div>

            <input
              type="number"
              placeholder="CVV"
              className="w-full border p-3 rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
            />

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
              className="w-full border p-3 rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
            />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
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

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <h4 className="font-semibold text-lg mb-1">Need Help?</h4>
          <p className="text-sm text-gray-500 mb-3">
            If you have any questions about your booking or payment, please contact our support team.
          </p>
          <p className="text-sm font-medium">support@eventsmanagementsystem.com</p>
          <p className="text-sm text-gray-800">+1 (555) 123-4567</p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PaymentCheckout;
