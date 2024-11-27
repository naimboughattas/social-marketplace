import SortableHeader from '../SortableHeader';

interface TableHeaderProps {
  multiSelectMode: boolean;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function TableHeader({
  multiSelectMode,
  sortField,
  sortDirection,
  onSort
}: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {multiSelectMode && (
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Sélection
          </th>
        )}
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Influenceur
        </th>
        <SortableHeader field="followers" label="Followers" currentField={sortField} direction={sortDirection} onSort={onSort} />
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Localisation
        </th>
        <SortableHeader field="delai" label="Délai" currentField={sortField} direction={sortDirection} onSort={onSort} />
        {!multiSelectMode ? (
          <>
            <SortableHeader field="follow" label="Follow" currentField={sortField} direction={sortDirection} onSort={onSort} />
            <SortableHeader field="like" label="Like" currentField={sortField} direction={sortDirection} onSort={onSort} />
            <SortableHeader field="comment" label="Comment" currentField={sortField} direction={sortDirection} onSort={onSort} />
            <SortableHeader field="repost" label="Repost" currentField={sortField} direction={sortDirection} onSort={onSort} />
          </>
        ) : (
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Prix
          </th>
        )}
      </tr>
    </thead>
  );
}