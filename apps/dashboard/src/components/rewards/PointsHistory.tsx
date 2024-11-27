import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PointsHistory {
  date: string;
  points: number;
  amount: number;
}

interface PointsHistoryProps {
  history: PointsHistory[];
}

export default function PointsHistory({ history }: PointsHistoryProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Historique des points</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="points" fill="#8B5CF6" name="Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}