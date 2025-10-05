import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Grid,
} from '@mui/material';
import { Add, CheckCircle, Cancel, Visibility, AutoAwesome } from '@mui/icons-material';
import { purchaseOrdersAPI, vendorsAPI, inventoryAPI } from '../services/api';
import { format } from 'date-fns';

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    vendor: '',
    items: [{ inventoryItem: '', name: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    expectedDeliveryDate: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchVendors();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await purchaseOrdersAPI.getAll();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getAll();
      setVendors(response.data.vendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleOpen = () => {
    setFormData({
      vendor: '',
      items: [{ inventoryItem: '', name: '', quantity: 1, unitPrice: 0 }],
      notes: '',
      expectedDeliveryDate: '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { inventoryItem: '', name: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill item name when inventory item is selected
    if (field === 'inventoryItem') {
      const selectedItem = items.find(item => item._id === value);
      if (selectedItem) {
        newItems[index].name = selectedItem.name;
        newItems[index].unitPrice = selectedItem.costPrice;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    try {
      await purchaseOrdersAPI.create(formData);
      fetchOrders();
      handleClose();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await purchaseOrdersAPI.approve(id);
      fetchOrders();
    } catch (error) {
      console.error('Failed to approve order:', error);
    }
  };

  const handleReceive = async (id: string) => {
    try {
      await purchaseOrdersAPI.receive(id);
      fetchOrders();
    } catch (error) {
      console.error('Failed to mark as received:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await purchaseOrdersAPI.cancel(id);
        fetchOrders();
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setViewDialog(true);
  };

  const getStatusChip = (status: string) => {
    const statusConfig: any = {
      draft: { color: 'default', label: 'Draft' },
      pending: { color: 'warning', label: 'Pending' },
      approved: { color: 'info', label: 'Approved' },
      ordered: { color: 'primary', label: 'Ordered' },
      received: { color: 'success', label: 'Received' },
      cancelled: { color: 'error', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Purchase Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your purchase orders
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Create Order
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>AI Generated</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.vendor?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell>
                      {order.isAIGenerated && (
                        <Chip icon={<AutoAwesome />} label="AI" color="secondary" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleViewOrder(order)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      {order.status === 'draft' && (
                        <IconButton size="small" color="success" onClick={() => handleApprove(order._id)}>
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      {order.status === 'approved' && (
                        <IconButton size="small" color="primary" onClick={() => handleReceive(order._id)}>
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      {!['received', 'cancelled'].includes(order.status) && (
                        <IconButton size="small" color="error" onClick={() => handleCancel(order._id)}>
                          <Cancel fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Order Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create Purchase Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                required
              >
                {vendors.map((vendor) => (
                  <MenuItem key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {formData.items.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          label="Item"
                          value={item.inventoryItem}
                          onChange={(e) => handleItemChange(index, 'inventoryItem', e.target.value)}
                        >
                          {items.map((invItem) => (
                            <MenuItem key={invItem._id} value={invItem._id}>
                              {invItem.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Unit Price"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button onClick={handleAddItem} variant="outlined" fullWidth>
                + Add Item
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Expected Delivery Date"
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedOrder.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Vendor: {selectedOrder.vendor?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status: {getStatusChip(selectedOrder.status)}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Items:
              </Typography>
              {selectedOrder.items.map((item: any, index: number) => (
                <Box key={index} sx={{ mb: 1, p: 1, backgroundColor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qty: {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  Total: ${selectedOrder.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrders;
