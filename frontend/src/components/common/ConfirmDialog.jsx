const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
