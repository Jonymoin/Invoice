import React, { useState } from "react";

const Invoice3 = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  // States
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [submitted, setSubmitted] = useState(false);

  // Add new row
  const addRow = () => setItems([...items, { description: "", amount: "" }]);

  // Update item
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

  // Submit
  const handleSubmit = () => {
    if (!toName || !toPhone || !invoiceNo) {
      alert("Please fill in Customer Name, Phone, and Invoice No before submitting.");
      return;
    }
    setSubmitted(true);
  };

  // Reset
  const handleReset = () => {
    setToName("");
    setToPhone("");
    setToAddress("");
    setInvoiceNo("");
    setItems([{ description: "", amount: "" }]);
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {!submitted ? (
        // FORM VIEW
        <div className="bg-white p-8 shadow-xl rounded-2xl border border-gray-200">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Create New Invoice
          </h1>

          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Invoice No *"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
            />
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
          </div>

          {/* Items */}
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
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">{i + 1}</td>
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
        // INVOICE VIEW
        <div className="bg-white p-10 shadow-2xl rounded-2xl border border-gray-200 relative">
          <div className="flex items-start justify-between border-b pb-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-blue-900">
                LSH ENGINEERING PRIVATE LIMITED
              </h1>
              <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                707 JURONG WEST STREET 71, #06-48, SINGAPORE (640707) <br />
                UEN: 201916839E <br />
                Tel: +65 8413 0016 <br />
                Email: washertroubleshootsg@gmail.com
              </p>
            </div>

            {/* LE Logo = RESET BUTTON */}
            <div
              onClick={handleReset}
              className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl cursor-pointer hover:bg-purple-700 transition"
              title="Click to reset invoice"
            >
              LE
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <p className="font-semibold">DATE: {formattedDate}</p>
            <p className="font-semibold">INV NO: {invoiceNo}</p>
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
                  <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-1/3 border-t-2 border-gray-700">
              <p className="text-right font-bold mt-2">TOTAL: ${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="text-sm mb-10">
            <p>
              <span className="font-semibold">PAYNOW:</span> 83091653
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="italic text-gray-600">Thank you</p>
            <div className="text-right">
              <p className="font-semibold">For LSH ENGINEERING PRIVATE LIMITED</p>
              <div className="mt-6">
                <div
                  style={{
                    fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
                    fontSize: "28px",
                    lineHeight: 1,
                    color: "#808080",
                  }}
                >
                  John Moin
                </div>
                <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice3;
