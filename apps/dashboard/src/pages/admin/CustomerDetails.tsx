import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Text, Badge, TabGroup, Tab, TabList, TabPanel, TabPanels } from '@tremor/react';
import { ArrowLeft, Mail, Building2, MapPin, Phone } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import Button from '../../components/Button';
import PaymentMethodInfo from '../../components/admin/PaymentMethodInfo';
import BillingProfileInfo from '../../components/admin/BillingProfileInfo';
import InfluencerServicesInfo from '../../components/admin/InfluencerServicesInfo';
import SocialAccountInfo from '../../components/admin/SocialAccountInfo';
import UserActions from '../../components/admin/UserActions';
import { Service } from '../../lib/types';

// Types
interface Customer {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role: 'business' | 'influencer' | 'both';
  balance: number;
  pendingBalance?: number;
  totalSpent: number;
  ordersCount: number;
  rechargesCount: number;
  lastActive: Date;
  status: 'active' | 'suspended';
  createdAt: Date;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  notes?: string[];
  paymentMethods: {
    type: 'card' | 'bank' | 'paypal';
    details: {
      cardLast4?: string;
      cardExpiry?: string;
      iban?: string;
      bic?: string;
      accountName?: string;
      paypalEmail?: string;
    };
    isDefault: boolean;
  }[];
  billingProfiles: {
    id: string;
    companyName: string;
    fullName: string;
    address: string;
    city: string;
    region: string;
    zipCode: string;
    country: string;
    taxId?: string;
    isDefault: boolean;
  }[];
  socialAccounts: {
    platform: 'instagram' | 'tiktok' | 'youtube';
    username: string;
    displayName: string;
    profileImage: string;
    followers: number;
    isVerified: boolean;
    isActive: boolean;
    services: {
      service: Service;
      price: number;
      isActive: boolean;
    }[];
  }[];
}

// Mock data
const mockCustomer: Customer = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  company: 'ACME Inc.',
  role: 'both',
  balance: 250.50,
  pendingBalance: 150.00,
  totalSpent: 1500,
  ordersCount: 25,
  rechargesCount: 5,
  lastActive: new Date(),
  status: 'active',
  createdAt: new Date(2023, 0, 15),
  phone: '+33 6 12 34 56 78',
  address: {
    street: '123 Main St',
    city: 'Paris',
    zipCode: '75001',
    country: 'France'
  },
  notes: [
    'Client VIP',
    'Préfère être contacté par email'
  ],
  paymentMethods: [
    {
      type: 'card',
      details: {
        cardLast4: '4242',
        cardExpiry: '12/24'
      },
      isDefault: true
    },
    {
      type: 'paypal',
      details: {
        paypalEmail: 'john@example.com'
      },
      isDefault: false
    }
  ],
  billingProfiles: [
    {
      id: '1',
      companyName: 'ACME Inc.',
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'Paris',
      region: 'Île-de-France',
      zipCode: '75001',
      country: 'France',
      taxId: 'FR123456789',
      isDefault: true
    }
  ],
  socialAccounts: [
    {
      platform: 'instagram',
      username: '@fashion_style',
      displayName: 'Fashion Style',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
      followers: 345000,
      isVerified: true,
      isActive: true,
      services: [
        { service: 'follow', price: 4, isActive: true },
        { service: 'like', price: 2, isActive: true },
        { service: 'comment', price: 8, isActive: true }
      ]
    }
  ]
};

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer] = useState(mockCustomer);
  const [newNote, setNewNote] = useState('');

  const handleSuspend = () => {
    // API call to suspend/reactivate user
    console.log('Suspend/reactivate user:', id);
  };

  const handleDelete = () => {
    // API call to delete user
    console.log('Delete user:', id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/customers"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <Title>{customer.name || customer.email}</Title>
              <Text>Client depuis {formatDate(customer.createdAt)}</Text>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = `mailto:${customer.email}`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contacter
            </Button>
            <UserActions
              onSuspend={handleSuspend}
              onDelete={handleDelete}
              isSuspended={customer.status === 'suspended'}
            />
          </div>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <Title>Informations</Title>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <Text className="text-gray-500">Email</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{customer.email}</span>
                </div>
              </div>
              {customer.company && (
                <div>
                  <Text className="text-gray-500">Entreprise</Text>
                  <div className="mt-1 flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>{customer.company}</span>
                  </div>
                </div>
              )}
              {customer.phone && (
                <div>
                  <Text className="text-gray-500">Téléphone</Text>
                  <div className="mt-1 flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              )}
              {customer.address && (
                <div>
                  <Text className="text-gray-500">Adresse</Text>
                  <div className="mt-1 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {customer.address.street}, {customer.address.zipCode} {customer.address.city}, {customer.address.country}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <Title>Statistiques</Title>
            <div className="mt-6 space-y-4">
              <div>
                <Text className="text-gray-500">Solde disponible</Text>
                <div className="mt-1 text-2xl font-semibold">
                  {customer.balance.toFixed(2)} €
                </div>
              </div>
              {customer.pendingBalance !== undefined && (
                <div>
                  <Text className="text-gray-500">Gains en attente</Text>
                  <div className="mt-1 text-2xl font-semibold">
                    {customer.pendingBalance.toFixed(2)} €
                  </div>
                </div>
              )}
              <div>
                <Text className="text-gray-500">Total dépensé</Text>
                <div className="mt-1 text-2xl font-semibold">
                  {customer.totalSpent.toFixed(2)} €
                </div>
              </div>
              <div>
                <Text className="text-gray-500">Commandes</Text>
                <div className="mt-1 text-2xl font-semibold">
                  {customer.ordersCount}
                </div>
              </div>
              <div>
                <Text className="text-gray-500">Recharges</Text>
                <div className="mt-1 text-2xl font-semibold">
                  {customer.rechargesCount}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Onglets */}
        <Card>
          <TabGroup>
            <TabList>
              <Tab>Moyens de paiement</Tab>
              <Tab>Profils de facturation</Tab>
              {(customer.role === 'influencer' || customer.role === 'both') && (
                <Tab>Services</Tab>
              )}
              <Tab>Notes</Tab>
            </TabList>
            <TabPanels>
              {/* Moyens de paiement */}
              <TabPanel>
                <div className="mt-6 space-y-4">
                  {customer.paymentMethods.map((method, index) => (
                    <PaymentMethodInfo key={index} method={method} />
                  ))}
                </div>
              </TabPanel>

              {/* Profils de facturation */}
              <TabPanel>
                <div className="mt-6 space-y-4">
                  {customer.billingProfiles.map((profile) => (
                    <BillingProfileInfo key={profile.id} profile={profile} />
                  ))}
                </div>
              </TabPanel>

              {/* Services (si influenceur) */}
              {(customer.role === 'influencer' || customer.role === 'both') && (
                <TabPanel>
                  <div className="mt-6 space-y-6">
                    {customer.socialAccounts.map((account) => (
                      <div key={account.username} className="space-y-4">
                        <SocialAccountInfo account={account} />
                        <InfluencerServicesInfo services={account.services} />
                      </div>
                    ))}
                  </div>
                </TabPanel>
              )}

              {/* Notes */}
              <TabPanel>
                <div className="mt-6">
                  <div className="space-y-4">
                    {customer.notes?.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{note}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Ajouter une note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        disabled={!newNote.trim()}
                        onClick={() => {
                          // Ajouter la note
                          setNewNote('');
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </AdminLayout>
  );
}