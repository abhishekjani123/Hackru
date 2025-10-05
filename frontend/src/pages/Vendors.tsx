import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
} from '@mui/material';
import { Add, Edit, Delete, Store, Search, TravelExplore, Speed, LocalShipping, Star } from '@mui/icons-material';
import { vendorsAPI, vendorDiscoveryAPI } from '../services/api';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    category: [],
    rating: 0,
    deliveryTime: 7,
    paymentTerms: 'Net 30',
    minimumOrderValue: 0,
  });

  // Vendor Search States
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuantity, setSearchQuantity] = useState(50);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getAll();
      setVendors(response.data.vendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const handleOpen = (vendor?: any) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData(vendor);
    } else {
      setEditingVendor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        website: '',
        category: [],
        rating: 0,
        deliveryTime: 7,
        paymentTerms: 'Net 30',
        minimumOrderValue: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVendor(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingVendor) {
        await vendorsAPI.update(editingVendor._id, formData);
      } else {
        await vendorsAPI.create(formData);
      }
      fetchVendors();
      handleClose();
    } catch (error) {
      console.error('Failed to save vendor:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsAPI.delete(id);
        fetchVendors();
      } catch (error) {
        console.error('Failed to delete vendor:', error);
      }
    }
  };

  // Vendor Search Functions
  const handleSearchVendors = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a product name to search');
      return;
    }

    setSearching(true);
    try {
      const response = await vendorDiscoveryAPI.search({
        productName: searchQuery,
        quantity: searchQuantity,
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search vendors:', error);
      alert('Failed to search vendors. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setSearchQuery('');
    setSearchQuantity(50);
    setSearchResults(null);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchResults(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Vendor Management (Optional)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI auto-discovers vendors for you! This page is for saving favorites or manual tracking.
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<TravelExplore />}
            onClick={handleOpenSearch}
            sx={{
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              color: 'white',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                border: 'none',
              }
            }}
          >
            Search Online Vendors
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Add Favorite Vendor
          </Button>
        </Box>
      </Box>

      {/* AI Auto-Discovery Notice */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<TravelExplore />}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          🤖 AI Handles Vendor Discovery Automatically!
        </Typography>
        <Typography variant="body2">
          When you use <strong>AI Insights</strong>, the system automatically searches online marketplaces (Alibaba, Amazon Business, IndiaMART, etc.) 
          and finds the best vendors for each product. <strong>No manual vendor management required!</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          💡 This page is optional - use it only if you want to save favorite vendors or track specific suppliers manually.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {vendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor._id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Store />
                  </Box>
                  <Chip
                    label={vendor.status}
                    color={vendor.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {vendor.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={vendor.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({vendor.rating.toFixed(1)})
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📧 {vendor.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📞 {vendor.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  🚚 Delivery: {vendor.deliveryTime} days
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  💰 {vendor.paymentTerms}
                </Typography>

                {vendor.performance && (
                  <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      On-Time Delivery
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {vendor.performance.onTimeDelivery}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vendor.performance.totalOrders} total orders
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <IconButton size="small" onClick={() => handleOpen(vendor)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(vendor._id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {vendors.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No vendors yet
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Start by adding your first vendor
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mt: 2 }}>
                  Add Vendor
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vendor Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Delivery Time (days)"
                type="number"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(e, newValue) => setFormData({ ...formData, rating: newValue || 0 })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVendor ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vendor Search Dialog (Skyscanner-style) */}
      <Dialog open={searchOpen} onClose={handleCloseSearch} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TravelExplore sx={{ color: '#6366f1' }} />
            <Typography variant="h6" fontWeight={600}>
              Search Online Vendors
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Find vendors from Alibaba, Amazon Business, IndiaMART, and more
          </Typography>
        </DialogTitle>
        <DialogContent>
          {/* Search Form */}
          <Box sx={{ mb: 3, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Product Name"
                  placeholder="e.g., Wireless Mouse, Office Chair, Laptop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchVendors()}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={searchQuantity}
                  onChange={(e) => setSearchQuantity(Number(e.target.value))}
                  helperText="For bulk pricing"
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearchVendors}
              disabled={searching}
              sx={{ mt: 2, py: 1.5 }}
              startIcon={searching ? <CircularProgress size={20} /> : <Search />}
            >
              {searching ? 'Searching...' : 'Search Vendors'}
            </Button>
          </Box>

          {/* Loading State */}
          {searching && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Searching across multiple marketplaces...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Checking Alibaba, Amazon Business, IndiaMART, and more
              </Typography>
            </Box>
          )}

          {/* Search Results */}
          {searchResults && !searching && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Found {searchResults.totalResults} vendors for "{searchResults.productName}" 
                {searchResults.bestDeal && ` • Best price: $${searchResults.bestDeal.unitPrice}/unit`}
              </Alert>

              {/* Best Deal Highlight */}
              {searchResults.bestDeal && (
                <Card sx={{ mb: 3, border: '2px solid #10b981', bgcolor: '#f0fdf4' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Star sx={{ color: '#10b981' }} />
                      <Typography variant="h6" fontWeight={700} color="#10b981">
                        Best Deal
                      </Typography>
                    </Box>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography variant="h5" fontWeight={700}>
                          {searchResults.bestDeal.vendorName}
                        </Typography>
                        <Chip 
                          label={searchResults.bestDeal.source} 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                          <Rating value={searchResults.bestDeal.rating} readOnly size="small" />
                          <Typography variant="body2">({searchResults.bestDeal.rating})</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="h4" color="primary" fontWeight={700}>
                          ${searchResults.bestDeal.unitPrice}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per unit
                        </Typography>
                        {searchResults.bestDeal.discount > 0 && (
                          <Chip 
                            label={`${searchResults.bestDeal.discount}% OFF`} 
                            color="success" 
                            size="small" 
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalShipping />
                          <div>
                            <Typography variant="body2">{searchResults.bestDeal.deliveryTime} days</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {searchResults.bestDeal.country}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="h6" fontWeight={700}>
                          ${searchResults.bestDeal.totalCost}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total ({searchQuantity} units)
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              <Divider sx={{ my: 3 }}>
                <Chip label={`All ${searchResults.totalResults} Results`} />
              </Divider>

              {/* All Results */}
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {searchResults.results.map((vendor: any, index: number) => (
                  <Card 
                    key={index} 
                    sx={{ 
                      mb: 2, 
                      opacity: vendor.available ? 1 : 0.6,
                      border: index === 0 ? '1px solid #6366f1' : '1px solid #e0e0e0'
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {vendor.vendorName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip label={vendor.source} size="small" variant="outlined" />
                            <Chip 
                              label={vendor.country} 
                              size="small" 
                              icon={<LocalShipping fontSize="small" />}
                            />
                            {vendor.verified && (
                              <Chip 
                                label="Verified" 
                                size="small" 
                                color="success"
                                icon={<Star fontSize="small" />}
                              />
                            )}
                            {vendor.shippingIncluded && (
                              <Chip label="Free Shipping" size="small" color="info" />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Rating value={vendor.rating} readOnly size="small" />
                            <Typography variant="caption">({vendor.rating})</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            ${vendor.unitPrice}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            per unit
                          </Typography>
                          {vendor.discount > 0 && (
                            <Box>
                              <Typography 
                                variant="caption" 
                                sx={{ textDecoration: 'line-through' }}
                                color="text.secondary"
                              >
                                ${vendor.originalPrice}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Speed fontSize="small" color="action" />
                            <Typography variant="body2">{vendor.deliveryTime} days</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            by {vendor.estimatedArrival}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                          {vendor.available ? (
                            <>
                              <Typography variant="h6" fontWeight={600}>
                                ${vendor.totalCost}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                total
                              </Typography>
                            </>
                          ) : (
                            <Chip 
                              label={`MOQ: ${vendor.minimumOrder}`} 
                              size="small" 
                              color="warning"
                            />
                          )}
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <Button
                            fullWidth
                            variant={vendor.available ? "contained" : "outlined"}
                            size="small"
                            disabled={!vendor.available}
                          >
                            {vendor.available ? 'Select' : 'Min Order'}
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Summary */}
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">
                  💡 <strong>Average Price:</strong> ${searchResults.averagePrice}/unit • 
                  <strong> Search Time:</strong> {searchResults.searchTime} • 
                  <strong> Total Options:</strong> {searchResults.totalResults}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Empty State */}
          {!searchResults && !searching && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <TravelExplore sx={{ fontSize: 80, color: '#e0e0e0' }} />
              <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">
                Search for products to find vendors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter a product name and quantity above
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearch}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vendors;
