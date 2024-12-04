import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { AdminForm } from '../AdminForm';

interface Column {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  title: string;
  columns: Column[];
  data: any[];
  tableWidth?: string;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  isDeletable?: (row: any) => boolean;
  onError?: (error: any) => void;
  fields?: any[];
  formTitle?: string;
}

export function AdminTable({
  title,
  columns,
  data,
  tableWidth = "100%",
  onAdd,
  onEdit,
  onDelete,
  loading,
  canEdit = true,
  canDelete = true,
  isDeletable = () => true,
  onError,
  fields,
  formTitle
}: AdminTableProps) {
  const { hasPermission } = useAuth();
  const { user } = useSupabase();
  const hasEditPermission = canEdit && hasPermission('edit_rates');
  const hasDeletePermission = canDelete && hasPermission('delete_rates');
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);

  const handleDeleteClick = (row: any) => {
    if (!isDeletable(row)) {
      onError?.('This record cannot be deleted as it is required for system stability');
      return;
    }
    setSelectedRow(row);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRow && onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(selectedRow);
      } catch (error) {
        onError?.(error);
      } finally {
        setIsDeleting(false);
        setShowDeleteConfirm(false);
        setSelectedRow(null);
      }
    }
  };

  const handleEdit = (row: any) => {
    setEditData(row);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editData) {
        await onEdit?.(formData);
      } else {
        await onAdd?.(formData);
      }
      setShowForm(false);
      setEditData(null);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-full" style={{ width: tableWidth }}>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        {onAdd && hasEditPermission && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
              {(hasEditPermission || hasDeletePermission) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {(hasEditPermission || hasDeletePermission) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {hasEditPermission && onEdit && (
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {hasDeletePermission && onDelete && isDeletable(row) && (
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete Record
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this record? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
    {/* Edit/Add Form Modal */}
    {showForm && fields && (
      <AdminForm
        title={formTitle || (editData ? 'Edit Record' : 'Add Record')}
        fields={fields}
        data={editData || {}}
        onSave={handleSave}
        onClose={() => {
          setShowForm(false);
          setEditData(null);
        }}
        isOpen={showForm}
      />
    )}
  </div>
  );
}