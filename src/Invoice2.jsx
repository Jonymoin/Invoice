import React, { useState } from "react";

const Invoice = () => {
  // ======================
  // STATES
  // ======================
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(""); // ✅ invoice date state

  // ======================
  // ADD ITEM ROW
  // ======================
  const addRow = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  // ======================
  // UPDATE ITEM
  // ======================
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ======================
  // TOTAL CALCULATION
  // ======================
  const total = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // ======================
  // SUBMIT (GENERATE INVOICE)
  // ======================
  const handleSubmit = () => {
    if (!toName || !toPhone) {
      alert("Please fill in the required fields before submitting.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB"); // ✅ generate date
    setInvoiceDate(today); // ✅ freeze date here
    setSubmitted(true);
  };

  // ======================
  // RESET
  // ======================
  const handleReset = () => {
    setToName("");
    setToPhone("");
    setToAddress("");
    setItems([{ description: "", amount: "" }]);
    setSubmitted(false);
    setInvoiceDate("");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {!submitted ? (
        // =======================
        // INPUT FORM
        // =======================
        <div className="bg-white p-8 shadow-xl rounded-2xl border">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Create New Invoice (Asian)
          </h1>

          {/* Customer Info */}
          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Customer Name *"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Phone Number *"
              value={toPhone}
              onChange={(e) => setToPhone(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Items Table */}
          <table className="w-full border mb-6">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-2">S/N</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(i, "description", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="border p-2 text-right">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(i, "amount", e.target.value)
                      }
                      className="w-24 border p-1 rounded text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Item
          </button>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-8 py-3 rounded-xl"
            >
              Generate Invoice
            </button>
          </div>
        </div>
      ) : (
        // =======================
        // INVOICE VIEW
        // =======================
        <div className="bg-white p-10 shadow-2xl rounded-2xl border relative">
          <div className="flex justify-between border-b pb-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-blue-900">
                For ASIAN CONS & ENGG PTE LTD
              </h1>
              <p className="text-sm text-gray-700 mt-2">
                7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880 <br />
                Tel: +65 8530 1773 <br />
                Email: washingrepairsg@gmail.com
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">DATE: {invoiceDate}</p>
              <p className="font-semibold">INV NO: 436</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold">TO:</p>
            <p>{toName}</p>
            <p>{toPhone}</p>
            {toAddress && <p>{toAddress}</p>}
          </div>

          <table className="w-full border mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">S/N</th>
                <th className="border p-2 text-left">DESCRIPTION</th>
                <th className="border p-2 text-right">AMOUNT ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <p className="font-bold">TOTAL: ${total.toFixed(2)}</p>
          </div>

          <button
            onClick={handleReset}
            className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;
