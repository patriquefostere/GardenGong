type DeleteButtonProps = {
  id: number;
  onDelete: (id: number) => void;
};

export function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  return (
    <button
      onClick={() => onDelete(id)}
      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
    >
      Delete
    </button>
  );
}
