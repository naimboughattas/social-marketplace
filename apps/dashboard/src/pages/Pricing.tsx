import { Check } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const plans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for small businesses starting their Instagram journey',
    features: [
      '100 Real Follows',
      '200 Genuine Likes',
      '50 Custom Comments',
      'Basic Analytics',
      'Email Support',
    ],
  },
  {
    name: 'Growth',
    price: 99,
    description: 'Ideal for growing businesses looking to expand their reach',
    features: [
      '250 Real Follows',
      '500 Genuine Likes',
      '150 Custom Comments',
      'Advanced Analytics',
      'Priority Support',
      'Engagement Reports',
    ],
    popular: true,
  },
  {
    name: 'Professional',
    price: 199,
    description: 'For businesses seeking maximum Instagram impact',
    features: [
      '600 Real Follows',
      '1200 Genuine Likes',
      '400 Custom Comments',
      'Premium Analytics',
      '24/7 Priority Support',
      'Custom Reports',
      'Dedicated Account Manager',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the perfect plan to boost your Instagram presence with real engagement from authentic users.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                  plan.popular ? 'relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-purple-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {plan.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-6 w-5 flex-none text-purple-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/signup"
                  className="mt-8"
                >
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}