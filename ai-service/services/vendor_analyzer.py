import os
import google.generativeai as genai
import json
from datetime import datetime

class VendorAnalyzer:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.model = None
    
    def analyze_vendor(self, vendor, orders):
        """
        Comprehensive vendor performance analysis
        """
        analysis = {
            'vendorId': vendor['id'],
            'vendorName': vendor['name'],
            'performanceMetrics': self._calculate_performance_metrics(vendor, orders),
            'strengths': self._identify_strengths(vendor, orders),
            'weaknesses': self._identify_weaknesses(vendor, orders),
            'recommendations': [],
            'score': self._calculate_vendor_score(vendor, orders)
        }
        
        # Get AI-powered insights
        if self.model and orders:
            try:
                ai_insights = self._get_ai_insights(vendor, orders)
                analysis['aiInsights'] = ai_insights
                analysis['recommendations'] = ai_insights.get('recommendations', [])
            except Exception as e:
                print(f"AI insights failed: {e}")
                analysis['recommendations'] = self._get_rule_based_recommendations(vendor, orders)
        else:
            analysis['recommendations'] = self._get_rule_based_recommendations(vendor, orders)
        
        return analysis
    
    def _calculate_performance_metrics(self, vendor, orders):
        """Calculate key performance metrics"""
        if not orders:
            return {
                'totalOrders': 0,
                'onTimeDeliveryRate': vendor.get('performance', {}).get('onTimeDelivery', 0),
                'averageOrderValue': 0,
                'deliveryAccuracy': 0
            }
        
        total_orders = len(orders)
        completed_orders = [o for o in orders if o['status'] == 'received']
        
        # Calculate on-time delivery
        on_time = 0
        for order in completed_orders:
            if order.get('actualDelivery') and order.get('expectedDelivery'):
                actual = datetime.fromisoformat(order['actualDelivery'].replace('Z', '+00:00'))
                expected = datetime.fromisoformat(order['expectedDelivery'].replace('Z', '+00:00'))
                if actual <= expected:
                    on_time += 1
        
        on_time_rate = (on_time / len(completed_orders) * 100) if completed_orders else 0
        
        # Average order value
        avg_order_value = sum(o['total'] for o in orders) / len(orders) if orders else 0
        
        return {
            'totalOrders': total_orders,
            'completedOrders': len(completed_orders),
            'onTimeDeliveryRate': round(on_time_rate, 2),
            'averageOrderValue': round(avg_order_value, 2),
            'rating': vendor.get('rating', 0),
            'responseTime': vendor.get('performance', {}).get('responseTime', 0)
        }
    
    def _identify_strengths(self, vendor, orders):
        """Identify vendor strengths"""
        strengths = []
        
        if vendor.get('rating', 0) >= 4:
            strengths.append({
                'category': 'Quality',
                'description': f'Excellent rating of {vendor["rating"]}/5',
                'impact': 'high'
            })
        
        if vendor.get('performance', {}).get('onTimeDelivery', 0) >= 95:
            strengths.append({
                'category': 'Reliability',
                'description': f'{vendor["performance"]["onTimeDelivery"]}% on-time delivery',
                'impact': 'high'
            })
        
        if len(orders) > 10:
            strengths.append({
                'category': 'Relationship',
                'description': f'Established relationship with {len(orders)} orders',
                'impact': 'medium'
            })
        
        return strengths
    
    def _identify_weaknesses(self, vendor, orders):
        """Identify areas for improvement"""
        weaknesses = []
        
        if vendor.get('rating', 0) < 3:
            weaknesses.append({
                'category': 'Quality',
                'description': f'Low rating of {vendor["rating"]}/5',
                'severity': 'high'
            })
        
        if vendor.get('performance', {}).get('onTimeDelivery', 100) < 80:
            weaknesses.append({
                'category': 'Delivery',
                'description': f'Only {vendor["performance"]["onTimeDelivery"]}% on-time delivery',
                'severity': 'high'
            })
        
        if vendor.get('performance', {}).get('responseTime', 0) > 48:
            weaknesses.append({
                'category': 'Communication',
                'description': f'Slow response time ({vendor["performance"]["responseTime"]} hours)',
                'severity': 'medium'
            })
        
        return weaknesses
    
    def _calculate_vendor_score(self, vendor, orders):
        """Calculate overall vendor score (0-100)"""
        score = 0
        
        # Rating component (30%)
        score += (vendor.get('rating', 0) / 5) * 30
        
        # On-time delivery (30%)
        score += (vendor.get('performance', {}).get('onTimeDelivery', 0) / 100) * 30
        
        # Order history (20%)
        order_score = min(len(orders) / 20, 1) * 20  # Max score at 20+ orders
        score += order_score
        
        # Response time (20%)
        response_time = vendor.get('performance', {}).get('responseTime', 24)
        response_score = max(0, (48 - response_time) / 48) * 20
        score += response_score
        
        return round(score, 2)
    
    def _get_ai_insights(self, vendor, orders):
        """Get AI-powered vendor insights using Gemini"""
        prompt = f"""
        Analyze this vendor's performance and provide insights:
        
        Vendor: {vendor['name']}
        Rating: {vendor.get('rating', 0)}/5
        Total Orders: {len(orders)}
        On-Time Delivery: {vendor.get('performance', {}).get('onTimeDelivery', 0)}%
        Response Time: {vendor.get('performance', {}).get('responseTime', 0)} hours
        
        Recent order statuses: {[o['status'] for o in orders[:5]]}
        
        Provide analysis in JSON format:
        {{
          "summary": "Brief performance summary",
          "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
          "riskAssessment": "low|medium|high",
          "futureOutlook": "Brief outlook"
        }}
        
        Return ONLY the JSON object, no additional text.
        """
        
        response = self.model.generate_content(prompt)
        insights_text = response.text
        
        # Clean up the response to extract JSON
        if '```json' in insights_text:
            insights_text = insights_text.split('```json')[1].split('```')[0].strip()
        elif '```' in insights_text:
            insights_text = insights_text.split('```')[1].split('```')[0].strip()
        
        insights = json.loads(insights_text)
        return insights
    
    def _get_rule_based_recommendations(self, vendor, orders):
        """Fallback rule-based recommendations"""
        recommendations = []
        
        if vendor.get('rating', 0) < 3:
            recommendations.append("Consider finding alternative vendors with better ratings")
        
        if vendor.get('performance', {}).get('onTimeDelivery', 100) < 80:
            recommendations.append("Discuss delivery improvements or add buffer time to orders")
        
        if len(orders) > 0:
            recommendations.append("Continue monitoring performance and adjust order frequency")
        else:
            recommendations.append("Start with small trial orders to assess reliability")
        
        return recommendations
