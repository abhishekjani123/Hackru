import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  List,
  ListItem,
  Divider,
  Grid,
} from '@mui/material';
import { AutoAwesome, TrendingUp, Psychology, Lightbulb } from '@mui/icons-material';
import { aiAPI, purchaseOrdersAPI } from '../services/api';
import { motion } from 'framer-motion';

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [generatingOrders, setGeneratingOrders] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.recommendPurchase();
      setRecommendations(response.data);
    } catch (error: any) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.getInventoryInsights();
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOrders = async () => {
    if (!recommendations?.recommendations) return;

    try {
      setGeneratingOrders(true);
      await aiAPI.generateOrder({ recommendations: recommendations.recommendations });
      alert('Purchase orders created successfully! Check the Purchase Orders page.');
    } catch (error) {
      console.error('Failed to generate orders:', error);
    } finally {
      setGeneratingOrders(false);
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              AI-Powered Insights
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Let AI analyze your inventory and recommend the best purchasing decisions
          </Typography>
        </Box>
      </motion.div>

      {/* Hero Card */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AutoAwesome sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Smart Vendor Recommendations
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI analyzes your inventory, compares vendors, and finds the best deals automatically
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={fetchRecommendations}
                disabled={loading}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                }}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
              >
                Get AI Recommendations
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                onClick={fetchInsights}
                disabled={loading}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
                startIcon={loading ? <CircularProgress size={20} /> : <Lightbulb />}
              >
                Get Inventory Insights
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Purchase Recommendations */}
      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  🎯 AI Purchase Recommendations
                </Typography>
                {recommendations.recommendations?.length > 0 && (
                  <Button
                    variant="contained"
                    onClick={generateOrders}
                    disabled={generatingOrders}
                    startIcon={generatingOrders ? <CircularProgress size={20} /> : <AutoAwesome />}
                  >
                    Generate Purchase Orders
                  </Button>
                )}
              </Box>

              {recommendations.summary && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'success.lighter', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Total Items
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {recommendations.summary.total_items}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Recommendations
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {recommendations.summary.total_recommendations}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Savings
                      </Typography>
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        ${recommendations.summary.estimated_savings?.toFixed(2) || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Grid container spacing={2}>
                {recommendations.recommendations?.map((rec: any, index: number) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {rec.itemName}
                          </Typography>
                          <Chip label={`${(rec.confidence * 100).toFixed(0)}% confident`} color="primary" size="small" />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Current Stock
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {rec.currentStock}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Recommended Qty
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {rec.recommendedQuantity}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            Best Vendor: {rec.vendorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: ${rec.price.toFixed(2)} × {rec.recommendedQuantity} = ${rec.totalCost.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            💰 Save: ${rec.estimatedSavings.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            🚚 Delivery: {rec.deliveryTime} days
                          </Typography>
                        </Box>

                        {rec.reasoning && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="caption">{rec.reasoning}</Typography>
                          </Alert>
                        )}

                        {rec.aiInsight && (
                          <Alert severity="success" icon={<Lightbulb />} sx={{ mt: 1 }}>
                            <Typography variant="caption">{rec.aiInsight}</Typography>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {recommendations.recommendations?.length === 0 && (
                <Alert severity="success">
                  <AlertTitle>All Good! ✨</AlertTitle>
                  Your inventory is well-stocked. No urgent purchases needed at this time.
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Inventory Insights */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                📊 Inventory Insights
              </Typography>

              {insights.insights?.overview && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Total Value
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          ${insights.insights.overview.totalValue?.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Health Score
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="success.main">
                          {insights.insights.overview.healthScore}/100
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Avg Stock Level
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {insights.insights.overview.averageStockLevel?.toFixed(0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Low Stock Items
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="warning.main">
                          {insights.insights.overview.lowStockCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {insights.insights?.recommendations && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    💡 AI Recommendations
                  </Typography>
                  <List>
                    {insights.insights.recommendations.map((rec: any, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <Card variant="outlined" sx={{ width: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip
                                label={rec.priority}
                                color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}
                                size="small"
                              />
                              <Typography variant="body1" fontWeight={600}>
                                {rec.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {rec.description}
                            </Typography>
                            {rec.impact && (
                              <Typography variant="caption" color="primary.main">
                                Impact: {rec.impact}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!recommendations && !insights && !loading && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Psychology sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready to optimize your inventory?
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Click the buttons above to get AI-powered recommendations
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIInsights;
