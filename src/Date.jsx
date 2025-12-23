import React, { useState } from "react";

const Date1 = () => {
  // States
  const [invoiceDate, setInvoiceDate] = useState(""); // ✅ custom date
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [submitted, setSubmitted] = useState(false);

  // Add new row
  const addRow = () => setItems([...items, { description: "", amount: "" }]);

  // Update item row
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // Handle submit
  const handleSubmit = () => {
    if (!toName || !toPhone) {
      alert("Please fill in the required fields before submitting.");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setToName("");
    setToPhone("");
    setToAddress("");
    setInvoiceDate("");
    setItems([{ description: "", amount: "" }]);
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {!submitted ? (
        // ==========================
        // FORM VIEW
        // ==========================
        <div className="bg-white p-8 shadow-xl rounded-2xl border border-gray-200">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Create New Invoice (Asian)
          </h1>

          {/* Recipient Info */}
          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Customer Name *"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="text"
              placeholder="Phone Number *"
              value={toPhone}
              onChange={(e) => setToPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
            />

            {/* ✅ Date Input Field */}
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
            />
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border border-gray-300 mb-6 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-2 text-left">S/N</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {i + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      className="w-full border border-gray-300 p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={item.amount}
                      onChange={(e) => updateItem(i, "amount", e.target.value)}
                      className="w-24 border border-gray-300 p-1 rounded text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Item
          </button>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition"
            >
              Generate Invoice
            </button>
          </div>
        </div>
      ) : (
        // ==========================
        // INVOICE VIEW
        // ==========================
        <div className="bg-white p-10 shadow-2xl rounded-2xl border border-gray-200 relative">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-blue-900">
                For ASIAN CONS & ENGG PTE LTD
              </h1>
              <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                Company Registration No: 202334587K
              </p>
              <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880 <br />
                Tel: +65 8530 1773 <br />
                Email: washingrepairsg@gmail.com
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">DATE: {invoiceDate || "—"}</p>
              <p className="font-semibold">INV NO: 436</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-800">TO:</p>
            <p>{toName}</p>
            <p>{toPhone}</p>
            {toAddress && <p>{toAddress}</p>}
          </div>

          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">S/N</th>
                <th className="border border-gray-300 px-4 py-2 text-left">DESCRIPTION</th>
                <th className="border border-gray-300 px-4 py-2 text-right">AMOUNT ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-1/3 border-t-2 border-gray-700">
              <p className="text-right font-bold mt-2">
                TOTAL: ${total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="text-sm mb-10">
            <p>
              <span className="font-semibold">PAYNOW:</span> 83714275K
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="italic text-gray-600">Thank you</p>
            <div className="text-right">
              <p className="font-semibold">For ASIAN CONS & ENGG PTE LTD</p>
              <div className="mt-6 flex flex-col">
                <img
                  src="/sign.png"
                  alt="Signature"
                  className="w-32 h-16 object-contain ml-24"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="absolute top-2 right-4 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-md"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Date1;
