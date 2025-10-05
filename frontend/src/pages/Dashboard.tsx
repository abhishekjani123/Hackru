import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  IconButton,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  Inventory,
  AttachMoney,
  AutoAwesome,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI, aiAPI, inventoryAPI } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, lowStockRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        inventoryAPI.getLowStock(),
      ]);

      setDashboardData({
        ...analyticsRes.data,
        lowStockItems: lowStockRes.data.items,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      const response = await aiAPI.recommendPurchase();
      setAiRecommendations(response.data);
    } catch (error) {
      console.error('Failed to fetch AI recommendations:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Inventory Value',
      value: `$${dashboardData?.inventory?.totalValue?.toLocaleString() || 0}`,
      icon: <AttachMoney />,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Total Items',
      value: dashboardData?.inventory?.totalItems || 0,
      icon: <Inventory />,
      color: '#6366f1',
      bgColor: '#e0e7ff',
    },
    {
      title: 'Low Stock Items',
      value: dashboardData?.inventory?.lowStockItems || 0,
      icon: <Warning />,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Monthly Spending',
      value: `$${dashboardData?.purchaseOrders?.monthlySpending?.toLocaleString() || 0}`,
      icon: <TrendingUp />,
      color: '#ec4899',
      bgColor: '#fce7f3',
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your inventory today
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: 20,
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: stat.bgColor,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* AI Recommendations Alert */}
      {dashboardData?.inventory?.lowStockItems > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Alert
            severity="warning"
            icon={<AutoAwesome />}
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchAIRecommendations}
                endIcon={<ArrowForward />}
              >
                Get AI Suggestions
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>AI Assistant Ready</AlertTitle>
            You have {dashboardData.inventory.lowStockItems} items that need attention.
            Let AI help you find the best vendors and create purchase orders automatically.
          </Alert>
        </motion.div>
      )}

      {/* Recent Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            ⚡ Recent Alerts
          </Typography>
          <Grid container spacing={2}>
            {dashboardData.alerts.slice(0, 3).map((alert: any, index: number) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    borderLeft: 4,
                    borderColor:
                      alert.level === 'critical'
                        ? 'error.main'
                        : alert.level === 'warning'
                        ? 'warning.main'
                        : 'info.main',
                  }}
                >
                  <CardContent>
                    <Chip
                      label={alert.level?.toUpperCase() || 'INFO'}
                      size="small"
                      color={
                        alert.level === 'critical'
                          ? 'error'
                          : alert.level === 'warning'
                          ? 'warning'
                          : 'info'
                      }
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body1" fontWeight={600} gutterBottom>
                      {alert.message}
                    </Typography>
                    {alert.items && (
                      <Typography variant="body2" color="text.secondary">
                        {alert.items.slice(0, 3).join(', ')}
                        {alert.items.length > 3 && ` +${alert.items.length - 3} more`}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Inventory Overview
                </Typography>
                <IconButton size="small" onClick={fetchDashboardData}>
                  <Refresh />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: 'In Stock',
                      value: (dashboardData?.inventory?.totalItems || 0) - (dashboardData?.inventory?.lowStockItems || 0),
                    },
                    { name: 'Low Stock', value: dashboardData?.inventory?.lowStockItems || 0 },
                    { name: 'Out of Stock', value: dashboardData?.inventory?.outOfStockItems || 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Vendors
              </Typography>
              {dashboardData?.vendors?.topVendors?.length > 0 ? (
                <Box>
                  {dashboardData.vendors.topVendors.map((vendor: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1.5,
                        borderBottom: index < dashboardData.vendors.topVendors.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {vendor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vendor.performance?.totalOrders || 0} orders
                        </Typography>
                      </Box>
                      <Chip
                        label={`${vendor.rating}/5`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No vendors yet. Add vendors to get started!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            🚀 Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/app/inventory')}
                sx={{ py: 1.5 }}
              >
                Add Inventory Item
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => navigate('/app/purchase-orders')}
                sx={{ py: 1.5 }}
              >
                View Purchase Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<AutoAwesome />}
                onClick={() => navigate('/app/ai-insights')}
                sx={{ py: 1.5 }}
              >
                AI Vendor Discovery
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
