import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './components/common/Toast';
import { StorefrontLayout } from './components/common/StorefrontLayout';

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { CataloguePage } from './pages/storefront/CataloguePage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { CartPage } from './pages/storefront/CartPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { OrderConfirmationPage } from './pages/storefront/OrderConfirmationPage';
import { TrackingPage } from './pages/storefront/TrackingPage';
import { LoginPage } from './pages/storefront/LoginPage';
import { RegisterPage } from './pages/storefront/RegisterPage';
import { VerifyEmailPage } from './pages/storefront/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/storefront/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/storefront/ResetPasswordPage';
import { AccountPage } from './pages/storefront/AccountPage';

// Info & Policy Pages
import { AboutPage } from './pages/info/AboutPage';
import { ContactPage } from './pages/info/ContactPage';
import { FAQPage } from './pages/info/FAQPage';
import { ShippingPolicyPage } from './pages/info/ShippingPolicyPage';
import { ReturnsPolicyPage } from './pages/info/ReturnsPolicyPage';
import { JewelleryCarePage } from './pages/info/JewelleryCarePage';
import { PrivacyPolicyPage } from './pages/info/PrivacyPolicyPage';
import { TermsPage } from './pages/info/TermsPage';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-warmIvory">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="font-serif-luxury text-8xl font-bold text-primary/30">404</div>
        <div className="space-y-2">
          <h1 className="font-serif-luxury text-2xl font-bold text-charcoal">
            Page Not Discovered
          </h1>
          <p className="text-xs text-mutedGrey leading-relaxed">
            The jewellery piece, collection, or destination you were seeking may have been moved or is currently exclusive to our private vault.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary text-xs py-2.5 px-6 w-full sm:w-auto">
            Return to Homepage
          </Link>
          <Link to="/shop" className="btn-secondary text-xs py-2.5 px-6 w-full sm:w-auto">
            Browse Fine Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Routes>
                {/* Storefront Layout with Header, Footer, and Cart Drawer */}
                <Route path="/" element={<StorefrontLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<CataloguePage />} />
                  <Route path="catalogue" element={<CataloguePage />} />
                  <Route path="product/:slug" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                  <Route path="orders/confirmed/:orderNumber" element={<OrderConfirmationPage />} />
                  <Route path="orders/confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                  
                  {/* Tracking routes */}
                  <Route path="track" element={<TrackingPage />} />
                  <Route path="track/:orderNumber" element={<TrackingPage />} />
                  <Route path="orders/track" element={<TrackingPage />} />
                  <Route path="orders/track/:orderNumber" element={<TrackingPage />} />

                  {/* Auth & Customer Account */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="verify-email" element={<VerifyEmailPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="account" element={<AccountPage />} />

                  {/* Trust & Educational Information Pages */}
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="faqs" element={<FAQPage />} />
                  <Route path="shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="returns-policy" element={<ReturnsPolicyPage />} />
                  <Route path="jewellery-care" element={<JewelleryCarePage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsPage />} />

                  {/* Catch-all for Storefront */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Owner & Administrator Portal */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Routes>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
