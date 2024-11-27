import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { CartProvider } from "./lib/cart";
import { NotificationProvider } from "./lib/notifications";
import { FavoritesProvider } from "./lib/favorites";
import { InstagramAccountsProvider } from "./lib/instagram-accounts";
import { OrderNumberProvider } from "./lib/order-number";
import { ThemeProvider } from "./lib/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import NotificationToast from "./components/NotificationToast";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import InfluencerCatalog from "./pages/InfluencerCatalog";
import Orders from "./pages/Orders";
import Subscriptions from "./pages/Subscriptions";
import Invoices from "./pages/Invoices";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import TopUp from "./pages/TopUp";
import Withdraw from "./pages/Withdraw";
import MyAccounts from "./pages/MyAccounts";
import Proposals from "./pages/Proposals";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import MySubscribers from "./pages/MySubscribers";
import BuyerRewards from "./pages/BuyerRewards";
import SellerRewards from "./pages/SellerRewards";
import Affiliate from "./pages/Affiliate";
import PublicProfile from "./pages/PublicProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import AdminCustomers from "./pages/admin/Customers";
import AdminCustomerDetails from "./pages/admin/CustomerDetails";
import AdminRecharges from "./pages/admin/Recharges";
import AdminPayments from "./pages/admin/Payments";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminInfluencers from "./pages/admin/Influencers";
import AdminSupport from "./pages/admin/Support";
import AdminModeration from "./pages/admin/Moderation";
import AdminRewards from "./pages/admin/Rewards";
import AdminSEO from "./pages/admin/SEO";
import AdminNotifications from "./pages/admin/Notifications";
import AdminPerformance from "./pages/admin/Performance";
import AdminSettings from "./pages/admin/Settings";
import AdminTheme from "./pages/admin/Theme";

import { useEffect } from "react";
import { ref, get, onValue } from "firebase/database";
import { database } from "./lib/firebase";

import { useAuth } from "./lib/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard/buy" />;
  }

  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    const postsRef = ref(database, "posts/");

    // Écoute les changements en temps réel
    onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("New post data:", data); // Attendu
      } else {
        console.log("No data found at 'posts/'"); // Si le chemin est vide
      }
    });

    return () => {
      console.log("Listener detached");
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <NotificationProvider>
            <CartProvider>
              <FavoritesProvider>
                <InstagramAccountsProvider>
                  <OrderNumberProvider>
                    <ThemeProvider>
                      <Routes>
                        <Route
                          path="/"
                          element={<Navigate to="/dashboard/buy" />}
                        />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                          path="/:platform/:username"
                          element={<PublicProfile />}
                        />

                        {/* Protected Routes */}
                        <Route
                          path="/checkout"
                          element={
                            <PrivateRoute>
                              <Checkout />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/buy"
                          element={
                            <PrivateRoute>
                              <InfluencerCatalog />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/orders"
                          element={
                            <PrivateRoute>
                              <Orders />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/subscriptions"
                          element={
                            <PrivateRoute>
                              <Subscriptions />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/invoices"
                          element={
                            <PrivateRoute>
                              <Invoices />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/topup"
                          element={
                            <PrivateRoute>
                              <TopUp />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/withdraw"
                          element={
                            <PrivateRoute>
                              <Withdraw />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/my-accounts"
                          element={
                            <PrivateRoute>
                              <MyAccounts />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/proposals"
                          element={
                            <PrivateRoute>
                              <Proposals />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <PrivateRoute>
                              <Settings />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/subscribers"
                          element={
                            <PrivateRoute>
                              <MySubscribers />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/support"
                          element={
                            <PrivateRoute>
                              <Support />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/buyer-rewards"
                          element={
                            <PrivateRoute>
                              <BuyerRewards />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/seller-rewards"
                          element={
                            <PrivateRoute>
                              <SellerRewards />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/dashboard/affiliate"
                          element={
                            <PrivateRoute>
                              <Affiliate />
                            </PrivateRoute>
                          }
                        />

                        {/* Admin Routes */}
                        <Route
                          path="/admin"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminDashboard />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/orders"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminOrders />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/orders/:id"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminOrderDetails />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/customers"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminCustomers />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/customers/:id"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminCustomerDetails />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/recharges"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminRecharges />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/payments"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminPayments />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/analytics"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminAnalytics />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/influencers"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminInfluencers />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/support"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminSupport />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/moderation"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminModeration />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/rewards"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminRewards />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/seo"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminSEO />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/notifications"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminNotifications />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/performance"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminPerformance />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/settings"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminSettings />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/admin/theme"
                          element={
                            <PrivateRoute requireAdmin>
                              <AdminTheme />
                            </PrivateRoute>
                          }
                        />
                      </Routes>
                      <NotificationToast />
                    </ThemeProvider>
                  </OrderNumberProvider>
                </InstagramAccountsProvider>
              </FavoritesProvider>
            </CartProvider>
          </NotificationProvider>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
