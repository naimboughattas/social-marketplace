import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import { cn } from '../../lib/utils';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onRowClick?: (row: any) => void;
  renderCell?: (column: Column, value: any, row: any) => React.ReactNode;
}

export default function AdminTable({
  columns,
  data,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  renderCell
}: AdminTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell
              key={column.key}
              className={cn(
                column.sortable && "cursor-pointer hover:bg-gray-50",
                "whitespace-nowrap"
              )}
              onClick={() => column.sortable && onSort?.(column.key)}
            >
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                {column.sortable && sortField === column.key && (
                  <span className="text-gray-500">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
          >
            {columns.map((column) => (
              <TableCell key={column.key}>
                {renderCell ? (
                  renderCell(column, row[column.key], row)
                ) : (
                  row[column.key]
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}