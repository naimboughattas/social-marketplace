import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Grid, Text, Metric, AreaChart, DonutChart, TabGroup, Tab, TabList, TabPanel, TabPanels } from '@tremor/react';
import { DateRangePicker } from '../../components/admin/DateRangePicker';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Métriques clés adaptées à l'activité
const keyMetrics = [
  {
    name: 'Chiffre d\'affaires',
    value: '12,699 €',
    change: 35,
    trend: 'up',
    isPercentage: false,
    description: 'Total des recharges'
  },
  {
    name: 'Marge',
    value: '1,904.85 €',
    change: 40,
    trend: 'up',
    isPercentage: false,
    description: '15% du CA'
  },
  {
    name: 'Commandes',
    value: '1,832',
    change: 25,
    trend: 'up',
    isPercentage: false,
    description: 'Nombre total'
  },
  {
    name: 'Taux de conversion',
    value: '4.05 %',
    change: 53,
    trend: 'up',
    isPercentage: true,
    description: 'Commandes / Visites'
  },
  {
    name: 'Panier moyen',
    value: '6.93 €',
    change: 12,
    trend: 'up',
    isPercentage: false,
    description: 'Par commande'
  },
  {
    name: 'Délai moyen',
    value: '2h15',
    change: -15,
    trend: 'down',
    isPercentage: false,
    description: 'De livraison'
  }
];

// Distribution des services
const serviceDistribution = [
  { name: 'Follow', value: 40 },
  { name: 'Like', value: 35 },
  { name: 'Comment', value: 15 },
  { name: 'Repost', value: 10 }
];

// Distribution des plateformes
const platformDistribution = [
  { name: 'Instagram', value: 85 },
  { name: 'TikTok', value: 10 },
  { name: 'YouTube', value: 5 }
];

// Générer des données simulées pour les graphiques
const generateChartData = (hours: number) => {
  const data = [];
  const now = new Date();
  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      hour: format(date, 'HH:00', { locale: fr }),
      commandes: Math.floor(Math.random() * 20) + 5,
      ca: Math.floor(Math.random() * 100) + 50,
      marge: Math.floor(Math.random() * 15) + 7
    });
  }
  return data;
};

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date()
  ]);

  // Générer les données pour le graphique principal
  const chartData = generateChartData(24);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title>Analyses de données</Title>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        {/* Métriques clés */}
        <Grid numItemsLg={3} className="gap-6">
          {keyMetrics.map((metric) => (
            <Card key={metric.name} decoration="top" decorationColor={metric.trend === 'up' ? 'green' : 'red'}>
              <div className="flex items-start justify-between">
                <div>
                  <Text>{metric.name}</Text>
                  <Metric>{metric.value}</Metric>
                  <Text className="text-xs text-gray-500">{metric.description}</Text>
                </div>
                <div className={cn(
                  "flex items-center text-sm font-medium",
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {metric.change}%
                </div>
              </div>
            </Card>
          ))}
        </Grid>

        {/* Graphiques d'évolution */}
        <Card>
          <TabGroup>
            <div className="flex justify-between items-center mb-4">
              <TabList>
                <Tab>Commandes</Tab>
                <Tab>Chiffre d'affaires</Tab>
                <Tab>Marge</Tab>
              </TabList>
            </div>

            <TabPanels>
              <TabPanel>
                <AreaChart
                  className="h-72"
                  data={chartData}
                  index="hour"
                  categories={["commandes"]}
                  colors={["purple"]}
                  showLegend={false}
                  showGridLines={false}
                  showAnimation
                  curveType="monotone"
                />
              </TabPanel>
              <TabPanel>
                <AreaChart
                  className="h-72"
                  data={chartData}
                  index="hour"
                  categories={["ca"]}
                  colors={["green"]}
                  showLegend={false}
                  showGridLines={false}
                  showAnimation
                  curveType="monotone"
                />
              </TabPanel>
              <TabPanel>
                <AreaChart
                  className="h-72"
                  data={chartData}
                  index="hour"
                  categories={["marge"]}
                  colors={["blue"]}
                  showLegend={false}
                  showGridLines={false}
                  showAnimation
                  curveType="monotone"
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>

        {/* Distribution des services et plateformes */}
        <Grid numItemsLg={2} className="gap-6">
          <Card>
            <Title>Distribution des services</Title>
            <DonutChart
              className="mt-6"
              data={serviceDistribution}
              category="value"
              index="name"
              colors={["purple", "indigo", "blue", "cyan"]}
              showAnimation
              showTooltip
              valueFormatter={(value) => `${value}%`}
            />
          </Card>
          <Card>
            <Title>Distribution des plateformes</Title>
            <DonutChart
              className="mt-6"
              data={platformDistribution}
              category="value"
              index="name"
              colors={["pink", "rose", "orange"]}
              showAnimation
              showTooltip
              valueFormatter={(value) => `${value}%`}
            />
          </Card>
        </Grid>
      </div>
    </AdminLayout>
  );
}