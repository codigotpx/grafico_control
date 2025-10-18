function AlertBox({ means, limits }) {
  const outOfControl = means.some(m => m > limits.XbarUCL || m < limits.XbarLCL);
  return (
    <div className={`p-3 rounded ${outOfControl ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
      {outOfControl ? "⚠️ El proceso está FUERA de control" : "✅ El proceso está BAJO control"}
    </div>
  );
}

export default AlertBox;