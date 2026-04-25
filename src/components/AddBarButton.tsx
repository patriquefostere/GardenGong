export function AddBarButton({ addBar }: { addBar: () => void }) {
  return (
    <button
      onClick={addBar}
      className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
    >
      Add Bar
    </button>
  );
}
