import { useState } from 'react';
import { Tab } from '@headlessui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, AlertTriangle, CheckCircle, XCircle, Flag } from 'lucide-react';
import Button from '../../components/Button';
import { cn } from '../../lib/utils';
import { formatDate } from '../../lib/utils';

interface Report {
  id: string;
  type: 'user' | 'content' | 'order';
  targetId: string;
  targetType: string;
  reason: string;
  description: string;
  reportedBy: {
    id: string;
    email: string;
  };
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  notes: string[];
}

const mockReports: Report[] = [
  {
    id: '1',
    type: 'user',
    targetId: 'user123',
    targetType: 'Influencer',
    reason: 'Fake Account',
    description: 'This account is impersonating a known brand',
    reportedBy: {
      id: 'reporter1',
      email: 'reporter@example.com'
    },
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    notes: []
  }
];

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  investigating: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-800'
};

export default function AdminModeration() {
  const [reports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [note, setNote] = useState('');

  const filteredReports = reports.filter(report => {
    if (search && !report.targetId.includes(search) && 
        !report.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (typeFilter !== 'all' && report.type !== typeFilter) return false;
    return true;
  });

  const handleAddNote = () => {
    if (!note.trim() || !selectedReport) return;
    // Add note logic here
    setNote('');
  };

  const handleUpdateStatus = (reportId: string, status: Report['status']) => {
    // Update status logic here
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title>Modération</Title>
          <div className="flex space-x-4">
            <TextInput
              icon={Search}
              placeholder="Rechercher un signalement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="investigating">En cours</SelectItem>
              <SelectItem value="resolved">Résolu</SelectItem>
              <SelectItem value="dismissed">Rejeté</SelectItem>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
              <SelectItem value="content">Contenu</SelectItem>
              <SelectItem value="order">Commandes</SelectItem>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Liste des signalements */}
          <div className="col-span-4">
            <Card>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={cn(
                      'w-full p-4 text-left rounded-lg border transition-colors',
                      selectedReport?.id === report.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4 text-red-500" />
                          <h3 className="font-medium text-gray-900">
                            {report.targetType} #{report.targetId}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{report.reason}</p>
                      </div>
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        statusStyles[report.status]
                      )}>
                        {report.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {formatDate(report.createdAt)}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Détails du signalement */}
          <div className="col-span-8">
            {selectedReport ? (
              <Card>
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h2 className="text-xl font-medium text-gray-900">
                        Signalement #{selectedReport.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Signalé par {selectedReport.reportedBy.email} • {formatDate(selectedReport.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <Select
                        value={selectedReport.status}
                        onValueChange={(value) => handleUpdateStatus(selectedReport.id, value as any)}
                      >
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="investigating">En cours</SelectItem>
                        <SelectItem value="resolved">Résolu</SelectItem>
                        <SelectItem value="dismissed">Rejeté</SelectItem>
                      </Select>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Raison</h3>
                      <p className="mt-1">{selectedReport.reason}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{selectedReport.description}</p>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                      <div className="space-y-2">
                        {selectedReport.notes.map((note, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ajouter une note */}
                    <div className="flex space-x-4">
                      <TextInput
                        placeholder="Ajouter une note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleAddNote}>
                        Ajouter
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme résolu
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Aucun signalement sélectionné
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sélectionnez un signalement pour voir les détails
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}