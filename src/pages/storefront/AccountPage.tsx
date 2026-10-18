import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  ShoppingBag,
  MapPin,
  Heart,
  Key,
  Truck,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { ordersApi } from '../../api/orders';
import { authApi } from '../../api/auth';
import { Order, Address } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading, refreshProfile, logout } = useAuth();
  const { wishlist } = useWishlist();

  const activeTab = searchParams.get('tab') || 'orders';

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Profile Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone_number || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      setIsLoadingOrders(true);
      ordersApi
        .getMyOrders()
        .then(setOrders)
        .catch((err) => console.error('Failed to load orders:', err))
        .finally(() => setIsLoadingOrders(false));
    } else if (activeTab === 'addresses' && isAuthenticated) {
      setIsLoadingAddresses(true);
      authApi
        .getAddresses()
        .then(setAddresses)
        .catch((err) => console.error('Failed to load addresses:', err))
        .finally(() => setIsLoadingAddresses(false));
    }
  }, [activeTab, isAuthenticated]);

  const setTab = (tabName: string) => {
    setSearchParams({ tab: tabName });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      await authApi.updateProfile({
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      });
      await refreshProfile();
      setProfileMessage('Profile details updated successfully.');
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      setPasswordError('New password confirmation does not match.');
      return;
    }
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordMessage(null);
    try {
      await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });
      setPasswordMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleOpenAddressModal = (addr?: Address) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrFullName(addr.full_name);
      setAddrPhone(addr.phone);
      setAddrStreet(addr.street_address);
      setAddrApartment(addr.apartment_suite || '');
      setAddrCity(addr.city);
      setAddrState(addr.state);
      setAddrPostalCode(addr.postal_code);
      setAddrIsDefault(addr.is_default);
    } else {
      setEditingAddressId(null);
      setAddrFullName(user?.display_name || '');
      setAddrPhone(user?.phone_number || '');
      setAddrStreet('');
      setAddrApartment('');
      setAddrCity('');
      setAddrState('Maharashtra');
      setAddrPostalCode('');
      setAddrIsDefault(addresses.length === 0);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      full_name: addrFullName,
      phone: addrPhone,
      street_address: addrStreet,
      apartment_suite: addrApartment,
      city: addrCity,
      state: addrState,
      postal_code: addrPostalCode,
      country: 'India',
      address_type: 'shipping' as const,
      is_default: addrIsDefault,
    };

    try {
      if (editingAddressId) {
        await authApi.updateAddress(editingAddressId, payload);
      } else {
        await authApi.addAddress(payload);
      }
      setIsAddressModalOpen(false);
      const updated = await authApi.getAddresses();
      setAddresses(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you wish to remove this saved address?')) return;
    try {
      await authApi.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleCancelOrder = async (orderNumber: string) => {
    if (!confirm('Are you sure you want to cancel this order? Stock will be restored and any simulated charges reversed.')) return;
    setCancellingOrder(true);
    try {
      const res = await ordersApi.cancelOrder(orderNumber, 'Cancelled by customer from account portal');
      setOrders(orders.map((o) => (o.order_number === orderNumber ? res.order : o)));
      if (selectedOrder && selectedOrder.order_number === orderNumber) {
        setSelectedOrder(res.order);
      }
    } catch (err: any) {
      alert(err.message || 'Order could not be cancelled.');
    } finally {
      setCancellingOrder(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="section-container py-24 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Order History', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" />, count: wishlist.length },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile Details', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'security', label: 'Password & Security', icon: <Key className="w-4 h-4" /> },
  ];

  return (
    <div className="section-container py-10 sm:py-14">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-borderNeutral mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Patron Portal
          </span>
          <h1 className="font-serif-luxury text-3xl font-medium text-charcoal">
            Welcome, {user?.display_name || 'Valued Patron'}
          </h1>
          <p className="text-xs text-mutedGrey mt-0.5">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="btn-secondary h-10 px-4 text-xs text-red-600 hover:bg-red-50"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Tabs Navigation */}
        <aside className="lg:col-span-3 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-button text-xs font-semibold tracking-wide transition-all ${
                activeTab === t.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-charcoal hover:bg-white border border-transparent hover:border-borderNeutral'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {t.icon}
                <span>{t.label}</span>
              </div>
              {t.count !== undefined && t.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === t.id ? 'bg-white text-primary' : 'bg-softNeutral text-charcoal'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-9 bg-white border border-borderNeutral rounded-card p-6 sm:p-8 min-h-[450px]">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
                <h2 className="font-serif-luxury text-xl font-bold text-charcoal">
                  Your Order History
                </h2>
                <Link
                  to="/orders/track"
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Public Tracking Portal</span>
                </Link>
              </div>

              {isLoadingOrders ? (
                <div className="space-y-3 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-softNeutral rounded-card" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-mutedGrey mx-auto" />
                  <h3 className="font-serif-luxury text-base font-semibold text-charcoal">No Orders Placed Yet</h3>
                  <p className="text-xs text-mutedGrey max-w-sm mx-auto">
                    When you order our certified diamond and gold jewellery, you can track simulated delivery milestones here.
                  </p>
                  <Link to="/shop" className="btn-primary text-xs mt-2">
                    Browse Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="border border-borderNeutral rounded-card p-4 sm:p-5 hover:border-primary/50 transition-all space-y-3 bg-warmIvory/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-borderNeutral/60 text-xs">
                        <div>
                          <span className="font-bold text-charcoal text-sm">#{o.order_number}</span>
                          <span className="text-mutedGrey ml-3">
                            {new Date(o.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                            {o.status_display}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            {o.payment_status_display}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs text-charcoal">
                          <p>
                            Items in Order: <strong>{o.total_items || 1}</strong>
                          </p>
                          <p className="text-mutedGrey mt-0.5">
                            Total: <strong className="text-charcoal font-bold">₹{Number(o.total_amount).toLocaleString('en-IN')}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/orders/track/${o.order_number}`}
                            className="btn-secondary h-9 px-3 text-xs gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Telemetry</span>
                          </Link>

                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="btn-primary h-9 px-3 text-xs"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-borderNeutral">
                <h2 className="font-serif-luxury text-xl font-bold text-charcoal">
                  Your Saved Jewellery ({wishlist.length})
                </h2>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <Heart className="w-10 h-10 text-mutedGrey mx-auto" />
                  <h3 className="font-serif-luxury text-base font-semibold text-charcoal">Your Wishlist is Empty</h3>
                  <p className="text-xs text-mutedGrey">
                    Save your favourite diamond engagement rings and bridal heirlooms for later review.
                  </p>
                  <Link to="/shop" className="btn-primary text-xs mt-2">
                    Explore Catalogue
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlist.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
                <h2 className="font-serif-luxury text-xl font-bold text-charcoal">
                  Saved Address Book
                </h2>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="btn-primary h-9 px-3 text-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isLoadingAddresses ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-24 bg-softNeutral rounded-card" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <MapPin className="w-10 h-10 text-mutedGrey mx-auto" />
                  <h3 className="font-serif-luxury text-base font-semibold text-charcoal">No Addresses Saved</h3>
                  <p className="text-xs text-mutedGrey">
                    Add a delivery address to speed up your future jewellery orders.
                  </p>
                  <button onClick={() => handleOpenAddressModal()} className="btn-primary text-xs mt-2">
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="border border-borderNeutral rounded-card p-4 space-y-3 relative hover:border-primary/50 transition-all bg-warmIvory/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{a.full_name}</span>
                        {a.is_default && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-mutedGrey space-y-0.5">
                        <p>{a.street_address}</p>
                        {a.apartment_suite && <p>{a.apartment_suite}</p>}
                        <p>{a.city}, {a.state} - {a.postal_code}</p>
                        <p>Phone: {a.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-borderNeutral/50 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleOpenAddressModal(a)}
                          className="text-primary hover:underline font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(a.id)}
                          className="text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <div className="pb-3 border-b border-borderNeutral">
                <h2 className="font-serif-luxury text-xl font-bold text-charcoal">
                  Patron Profile Details
                </h2>
                <p className="text-xs text-mutedGrey mt-0.5">Manage your personal identification details.</p>
              </div>

              {profileMessage && (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded-button flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{profileMessage}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Email (Cannot be modified)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="input-field text-xs bg-softNeutral text-mutedGrey cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field text-xs"
                    placeholder="+91 98200 12345"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn-primary text-xs h-11 px-6 font-semibold"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-lg">
              <div className="pb-3 border-b border-borderNeutral">
                <h2 className="font-serif-luxury text-xl font-bold text-charcoal">
                  Security & Password
                </h2>
                <p className="text-xs text-mutedGrey mt-0.5">Ensure your account uses a secure password.</p>
              </div>

              {passwordMessage && (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded-button flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordMessage}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-button flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="input-field text-xs"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field text-xs"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="input-field text-xs"
                    placeholder="Repeat new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="btn-primary text-xs h-11 px-6 font-semibold"
                >
                  {passwordSaving ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative bg-white rounded-card p-6 sm:p-8 max-w-lg w-full space-y-4 z-10 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-1 text-mutedGrey">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Apartment / Suite (Optional)</label>
                <input
                  type="text"
                  value={addrApartment}
                  onChange={(e) => setAddrApartment(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-primary"
                />
                <span className="font-semibold text-charcoal">Set as default delivery address</span>
              </label>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn-primary flex-1 text-xs">
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-card p-6 sm:p-8 max-w-xl w-full space-y-4 z-10 shadow-float max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                  Order #{selectedOrder.order_number}
                </h3>
                <span className="text-xs text-mutedGrey">
                  Status: <strong className="text-primary">{selectedOrder.status_display}</strong>
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-mutedGrey">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-softNeutral/60 rounded-card space-y-1">
                <p className="font-bold text-charcoal">Delivery Address:</p>
                <p>{selectedOrder.shipping_full_name} • {selectedOrder.shipping_phone}</p>
                <p className="text-mutedGrey">{selectedOrder.shipping_street}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_postal_code}</p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="font-bold text-charcoal uppercase tracking-wider text-[11px]">Items Ordered:</p>
                <div className="divide-y divide-borderNeutral/50 border border-borderNeutral rounded-button p-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-charcoal">{item.product_name}</span>
                        {item.variant_name && <span className="text-mutedGrey block text-[11px]">{item.variant_name}</span>}
                        <span className="text-[11px] text-mutedGrey">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-charcoal">
                        ₹{Number(item.subtotal).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-borderNeutral space-y-1 text-right">
                <p>Subtotal: <strong className="text-charcoal">₹{Number(selectedOrder.subtotal_amount).toLocaleString('en-IN')}</strong></p>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <p className="text-primary font-semibold">Discount: -₹{Number(selectedOrder.discount_amount).toLocaleString('en-IN')}</p>
                )}
                <p className="text-sm font-bold text-primary pt-1">
                  Total Paid (Demo): ₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-borderNeutral">
                <Link
                  to={`/orders/track/${selectedOrder.order_number}`}
                  className="btn-primary flex-1 text-xs text-center"
                >
                  Track Shipment
                </Link>

                {selectedOrder.can_cancel && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.order_number)}
                    disabled={cancellingOrder}
                    className="btn-secondary text-xs text-red-600 hover:bg-red-50"
                  >
                    {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
