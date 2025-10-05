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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  LinearProgress,
} from '@mui/material';
import { Add, Edit, Delete, Warning } from '@mui/icons-material';
import { inventoryAPI } from '../services/api';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    currentStock: 0,
    minStockLevel: 10,
    maxCapacity: 100,
    reorderPoint: 15,
    costPrice: 0,
    sellingPrice: 0,
    unit: 'units',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        currentStock: 0,
        minStockLevel: 10,
        maxCapacity: 100,
        reorderPoint: 15,
        costPrice: 0,
        sellingPrice: 0,
        unit: 'units',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem._id, formData);
      } else {
        await inventoryAPI.create(formData);
      }
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.delete(id);
        fetchItems();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const getStatusChip = (item: any) => {
    if (item.currentStock === 0) {
      return <Chip label="Out of Stock" color="error" size="small" />;
    } else if (item.currentStock <= item.reorderPoint) {
      return <Chip label="Low Stock" color="warning" size="small" />;
    } else {
      return <Chip label="In Stock" color="success" size="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Inventory Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your products and stock levels
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Item
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Max Capacity</TableCell>
                  <TableCell align="right">Reorder Point</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Cost</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.currentStock <= item.reorderPoint && (
                          <Warning color="warning" sx={{ mr: 1, fontSize: 20 }} />
                        )}
                        <Typography variant="body2" fontWeight={600}>
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.sku || '-'}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ minWidth: 80 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {item.currentStock}/{item.maxCapacity || 100}
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            height: 6,
                            bgcolor: '#e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min(((item.currentStock / (item.maxCapacity || 100)) * 100), 100)}%`,
                              height: '100%',
                              bgcolor: 
                                (item.currentStock / (item.maxCapacity || 100)) >= 0.9 ? '#ff9800' :
                                (item.currentStock / (item.maxCapacity || 100)) >= 0.7 ? '#ffc107' : '#4caf50',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{item.reorderPoint}</TableCell>
                    <TableCell>{getStatusChip(item)}</TableCell>
                    <TableCell align="right">${item.costPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">${item.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleOpen(item)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item._id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Current Stock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Max Capacity"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                required
                helperText="Storage limit"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Min Stock Level"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Reorder Point"
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost Price"
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Selling Price"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
