import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Psychology,
  Speed,
  TrendingUp,
  AutoAwesome,
  Inventory,
  ShoppingCart,
  Assessment,
  Security,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Recommendations',
      description: 'Smart algorithms analyze your inventory and find the best vendors automatically',
      color: '#6366f1',
    },
    {
      icon: <Speed />,
      title: 'Real-Time Vendor Search',
      description: 'Scrapes live data from Alibaba, Amazon Business, IndiaMART and more',
      color: '#8b5cf6',
    },
    {
      icon: <TrendingUp />,
      title: 'Predictive Analytics',
      description: 'Forecast demand, optimize stock levels, and prevent stockouts',
      color: '#ec4899',
    },
    {
      icon: <ShoppingCart />,
      title: 'Automated Purchase Orders',
      description: 'Generate purchase orders with one click, backed by AI insights',
      color: '#10b981',
    },
    {
      icon: <Assessment />,
      title: 'Smart Insights Dashboard',
      description: 'Visual analytics to track inventory health and vendor performance',
      color: '#f59e0b',
    },
    {
      icon: <Security />,
      title: 'Multi-Vendor Backup',
      description: 'Top 5 vendors per product with automatic failover system',
      color: '#3b82f6',
    },
  ];

  const stats = [
    { value: '95%', label: 'Cost Savings' },
    { value: '10x', label: 'Faster Sourcing' },
    { value: '5+', label: 'Marketplaces' },
    { value: '24/7', label: 'AI Monitoring' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(
                i % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
                0.1
              )} 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 8, pb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                🛒 SmartVendor
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                AI-Powered Vendor Purchasing Management
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Discover the best vendors, compare prices in real-time, and automate your
                purchasing process with cutting-edge AI technology. Like Skyscanner, but for
                business procurement.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.6)}`,
                    },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-4px)',
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ py: 4 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ✨ Powerful Features
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, fontSize: '1.1rem' }}
            >
              Everything you need to revolutionize your procurement process
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        height: '100%',
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(feature.color, 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          boxShadow: `0 16px 48px ${alpha(feature.color, 0.25)}`,
                          border: `1px solid ${alpha(feature.color, 0.3)}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            mb: 3,
                            background: `linear-gradient(135deg, ${feature.color}, ${alpha(
                              feature.color,
                              0.7
                            )})`,
                            boxShadow: `0 8px 24px ${alpha(feature.color, 0.3)}`,
                          }}
                        >
                          {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              textAlign: 'center',
              py: 8,
              px: 4,
              boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            <AutoAwesome sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Ready to Transform Your Business?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
              Join hundreds of businesses saving time and money with AI-powered procurement
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                },
              }}
              endIcon={<ArrowForward />}
            >
              Start Your Free Trial
            </Button>
          </Card>
        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          py: 4,
          mt: 8,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 SmartVendor. Powered by AI. Built with ❤️
        </Typography>
      </Box>
    </Box>
  );
};

export default Landing;
