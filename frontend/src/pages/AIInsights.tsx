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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { AutoAwesome, TrendingUp, Psychology, Lightbulb, ExpandMore, CheckCircle, Warning } from '@mui/icons-material';
import { aiAPI, purchaseOrdersAPI } from '../services/api';
import { motion } from 'framer-motion';

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [generatingOrders, setGeneratingOrders] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<{[key: string]: any}>({});
  const [backupSelections, setBackupSelections] = useState<{[key: string]: any[]}>({});

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

  const handleSelectPrimaryVendor = (itemId: string, recommendation: any) => {
    setSelectedVendors(prev => ({
      ...prev,
      [itemId]: recommendation
    }));
    alert(`✅ Selected ${recommendation.vendorName} as primary vendor for ${recommendation.itemName}`);
  };

  const handleSelectBackupVendor = (itemId: string, backup: any) => {
    setBackupSelections(prev => {
      const currentBackups = prev[itemId] || [];
      const isAlreadySelected = currentBackups.some(b => b.vendorId === backup.vendorId);
      
      if (isAlreadySelected) {
        alert(`⚠️ This vendor is already selected as a backup for this item`);
        return prev;
      }
      
      return {
        ...prev,
        [itemId]: [...currentBackups, backup]
      };
    });
    alert(`✅ Added ${backup.vendorName} as backup vendor`);
  };

  const generateOrders = async () => {
    if (!recommendations?.recommendations) return;

    try {
      setGeneratingOrders(true);
      const response = await aiAPI.generateOrder({ recommendations: recommendations.recommendations });
      if (response.data.success) {
        alert(`✅ ${response.data.message}\n\nCheck the Purchase Orders page to view them.`);
        // Reset selections after successful order generation
        setSelectedVendors({});
        setBackupSelections({});
      } else {
        alert('Purchase orders created successfully! Check the Purchase Orders page.');
      }
    } catch (error: any) {
      console.error('Failed to generate orders:', error);
      alert(`❌ Failed to create purchase orders: ${error.response?.data?.message || error.message}`);
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

              {recommendations.searchSummary && (
                <Alert severity="success" icon={<TrendingUp />} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="body2">
                        🤖 <strong>AI-Powered Search:</strong> Analyzed {recommendations.searchSummary.totalVendorsAnalyzed} vendors from {recommendations.searchSummary.marketplaces?.join(', ')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        All recommendations are sourced directly from online marketplaces - no manual vendor management needed!
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={generateOrders}
                      disabled={generatingOrders || !recommendations.recommendations || recommendations.recommendations.length === 0}
                      startIcon={generatingOrders ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {generatingOrders ? 'Creating Orders...' : 'Generate Purchase Orders'}
                    </Button>
                  </Box>
                </Alert>
              )}

              {/* Selection Summary */}
              {(Object.keys(selectedVendors).length > 0 || Object.keys(backupSelections).length > 0) && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Your Selections</AlertTitle>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    ✅ <strong>{Object.keys(selectedVendors).length}</strong> primary vendor{Object.keys(selectedVendors).length !== 1 ? 's' : ''} selected
                  </Typography>
                  <Typography variant="body2">
                    🔄 <strong>{Object.values(backupSelections).reduce((sum: number, arr: any[]) => sum + arr.length, 0)}</strong> backup vendor{Object.values(backupSelections).reduce((sum: number, arr: any[]) => sum + arr.length, 0) !== 1 ? 's' : ''} added
                  </Typography>
                </Alert>
              )}

              <Grid container spacing={3}>
                {recommendations.recommendations?.map((rec: any, index: number) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ overflow: 'visible' }}>
                      <CardContent>
                        {/* Product Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Box>
                            <Typography variant="h5" fontWeight={700}>
                              {rec.itemName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Current Stock</Typography>
                                <Typography variant="h6" fontWeight={600}>{rec.currentStock}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Recommended Qty</Typography>
                                <Typography variant="h6" fontWeight={600} color="primary">{rec.recommendedQuantity}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Vendors Found</Typography>
                                <Typography variant="h6" fontWeight={600}>{rec.totalVendorsFound || 5}</Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Chip 
                            label={`${(rec.confidence * 100).toFixed(0)}% Confident`} 
                            color="success" 
                            sx={{ fontSize: '0.9rem', px: 2, py: 2.5 }}
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Vendor Options - Primary + Backups */}
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            📊 Vendor Options (Ranked by AI)
                          </Typography>

                          {/* Primary Vendor */}
                          <Card sx={{ mb: 2, border: '2px solid #4caf50', bgcolor: '#f1f8f4' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Chip label="#1 RECOMMENDED" color="success" size="small" sx={{ fontWeight: 700 }} />
                                <Typography variant="h6" fontWeight={700}>{rec.vendorName}</Typography>
                                <Chip label={`🌐 ${rec.vendorSource}`} size="small" color="info" />
                                {rec.country && <Chip label={rec.country} size="small" variant="outlined" />}
                                {rec.stockAvailable && <Chip label="✓ In Stock" size="small" color="success" />}
                              </Box>

                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={3}>
                                  <Typography variant="caption" color="text.secondary">Unit Price</Typography>
                                  <Typography variant="h5" fontWeight={700} color="success.main">
                                    ${rec.price.toFixed(2)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Typography variant="caption" color="text.secondary">Total Cost</Typography>
                                  <Typography variant="h6" fontWeight={600}>
                                    ${rec.totalCost.toFixed(2)}
                                  </Typography>
                                  <Typography variant="caption" color="success.main">
                                    💰 Save ${rec.estimatedSavings.toFixed(2)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <Typography variant="caption" color="text.secondary">Rating</Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    ⭐ {rec.rating?.toFixed(1) || '4.5'}/5
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <Typography variant="caption" color="text.secondary">Delivery</Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    🚚 {rec.deliveryTime} days
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <Button 
                                    variant="contained" 
                                    color={selectedVendors[rec.itemId] ? "primary" : "success"}
                                    fullWidth
                                    onClick={() => handleSelectPrimaryVendor(rec.itemId, rec)}
                                    startIcon={selectedVendors[rec.itemId] ? <CheckCircle /> : null}
                                  >
                                    {selectedVendors[rec.itemId] ? "Selected" : "Select"}
                                  </Button>
                                </Grid>
                              </Grid>

                              {rec.aiInsight && (
                                <Alert severity="success" icon={<Lightbulb />} sx={{ mt: 2 }}>
                                  <Typography variant="body2">{rec.aiInsight}</Typography>
                                </Alert>
                              )}
                            </CardContent>
                          </Card>

                          {/* Backup Vendors */}
                          {rec.backupVendors && rec.backupVendors.length > 0 && (
                            <>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
                                🔄 Backup Vendors (Auto-failover if primary unavailable)
                              </Typography>
                              {rec.backupVendors.map((backup: any, idx: number) => (
                                <Card key={idx} sx={{ mb: 1.5, bgcolor: idx === 0 ? '#fff8e1' : '#fafafa' }}>
                                  <CardContent sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                      <Chip 
                                        label={`#${backup.priority}`} 
                                        size="small" 
                                        color={idx === 0 ? "warning" : "default"}
                                        sx={{ fontWeight: 600 }}
                                      />
                                      <Typography variant="subtitle1" fontWeight={600}>{backup.vendorName}</Typography>
                                      <Chip label={`🌐 ${backup.vendorSource}`} size="small" />
                                      {backup.country && <Chip label={backup.country} size="small" variant="outlined" />}
                                      {backup.stockAvailable ? (
                                        <Chip label="✓ In Stock" size="small" color="success" icon={<CheckCircle />} />
                                      ) : (
                                        <Chip label="Check Stock" size="small" color="warning" icon={<Warning />} />
                                      )}
                                    </Box>

                                    <Grid container spacing={2} alignItems="center">
                                      <Grid item xs={6} md={2}>
                                        <Typography variant="caption" color="text.secondary">Unit Price</Typography>
                                        <Typography variant="h6" fontWeight={600}>${backup.price.toFixed(2)}</Typography>
                                      </Grid>
                                      <Grid item xs={6} md={2}>
                                        <Typography variant="caption" color="text.secondary">Total</Typography>
                                        <Typography variant="body1" fontWeight={600}>${backup.totalCost.toFixed(2)}</Typography>
                                        {backup.savings > 0 && (
                                          <Typography variant="caption" color="success.main">Save ${backup.savings.toFixed(2)}</Typography>
                                        )}
                                      </Grid>
                                      <Grid item xs={4} md={1.5}>
                                        <Typography variant="caption" color="text.secondary">Rating</Typography>
                                        <Typography variant="body2">⭐ {backup.rating.toFixed(1)}</Typography>
                                      </Grid>
                                      <Grid item xs={4} md={1.5}>
                                        <Typography variant="caption" color="text.secondary">Delivery</Typography>
                                        <Typography variant="body2">🚚 {backup.deliveryTime}d</Typography>
                                      </Grid>
                                      <Grid item xs={4} md={1.5}>
                                        <Typography variant="caption" color="text.secondary">Reliability</Typography>
                                        <Typography variant="body2">{(backup.reliabilityScore * 100).toFixed(0)}%</Typography>
                                      </Grid>
                                      <Grid item xs={12} md={3.5}>
                                        <Button 
                                          variant={backupSelections[rec.itemId]?.some((b: any) => b.vendorId === backup.vendorId) ? "contained" : "outlined"}
                                          size="small" 
                                          fullWidth
                                          onClick={() => handleSelectBackupVendor(rec.itemId, backup)}
                                          startIcon={backupSelections[rec.itemId]?.some((b: any) => b.vendorId === backup.vendorId) ? <CheckCircle /> : null}
                                        >
                                          {backupSelections[rec.itemId]?.some((b: any) => b.vendorId === backup.vendorId) ? "Added as Backup" : "Use as Backup"}
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              ))}
                            </>
                          )}
                        </Box>
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
