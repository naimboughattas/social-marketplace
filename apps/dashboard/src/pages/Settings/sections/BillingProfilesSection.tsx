import BillingProfileList from '../../../components/topup/BillingProfileList';

export default function BillingProfilesSection() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Profils de facturation
      </h3>
      <BillingProfileList />
    </div>
  );
}