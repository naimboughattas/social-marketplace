interface LevelBenefitsProps {
  benefits: string[];
}

export default function LevelBenefits({ benefits }: LevelBenefitsProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Avantages du niveau</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="p-4 rounded-lg bg-purple-50">
            <h4 className="font-medium text-purple-900">Avantage {index + 1}</h4>
            <p className="text-sm text-purple-700 mt-1">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}