import PaymentMethodList from '../../../components/topup/PaymentMethodList';

export default function PaymentMethodsSection() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Moyens de paiement
      </h3>
      <PaymentMethodList />
    </div>
  );
}