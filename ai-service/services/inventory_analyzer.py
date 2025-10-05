import os
import google.generativeai as genai
import json
import numpy as np

class InventoryAnalyzer:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.model = None
        
    def analyze_inventory(self, items, recent_orders):
        """
        Analyze inventory and provide actionable insights
        """
        insights = {
            'overview': self._get_overview_insights(items),
            'alerts': self._get_alerts(items),
            'opportunities': self._get_opportunities(items),
            'trends': self._analyze_trends(items, recent_orders),
            'recommendations': []
        }
        
        # Get AI-powered recommendations
        if self.model and items:
            try:
                ai_recommendations = self._get_ai_recommendations(items, recent_orders)
                insights['recommendations'] = ai_recommendations
            except Exception as e:
                print(f"AI recommendations failed: {e}")
                insights['recommendations'] = self._get_rule_based_recommendations(items)
        else:
            insights['recommendations'] = self._get_rule_based_recommendations(items)
        
        return insights
    
    def _get_overview_insights(self, items):
        """Generate high-level inventory insights"""
        if not items:
            return {}
        
        total_value = sum(item['currentStock'] * item['costPrice'] for item in items)
        avg_stock_level = np.mean([item['currentStock'] for item in items])
        
        low_stock_items = [i for i in items if i['currentStock'] <= i.get('reorderPoint', 0)]
        high_value_items = sorted(items, key=lambda x: x['currentStock'] * x['costPrice'], reverse=True)[:5]
        
        return {
            'totalValue': round(total_value, 2),
            'averageStockLevel': round(avg_stock_level, 2),
            'lowStockCount': len(low_stock_items),
            'highValueItems': [item['name'] for item in high_value_items],
            'healthScore': self._calculate_health_score(items)
        }
    
    def _calculate_health_score(self, items):
        """Calculate overall inventory health score (0-100)"""
        if not items:
            return 0
        
        score = 100
        
        # Penalize for low stock items
        low_stock_ratio = len([i for i in items if i['currentStock'] <= i.get('reorderPoint', 0)]) / len(items)
        score -= low_stock_ratio * 30
        
        # Penalize for out of stock items
        out_of_stock_ratio = len([i for i in items if i['currentStock'] == 0]) / len(items)
        score -= out_of_stock_ratio * 40
        
        # Bonus for good turnover
        avg_turnover = np.mean([i.get('averageDailySales', 0) for i in items])
        if avg_turnover > 5:
            score += 10
        
        return max(0, min(100, round(score)))
    
    def _get_alerts(self, items):
        """Generate critical alerts"""
        alerts = []
        
        # Critical stock alerts
        critical_items = [i for i in items if i['currentStock'] == 0]
        if critical_items:
            alerts.append({
                'level': 'critical',
                'type': 'out_of_stock',
                'message': f"{len(critical_items)} items are out of stock",
                'items': [item['name'] for item in critical_items[:5]]
            })
        
        # Low stock warnings
        low_stock = [i for i in items if 0 < i['currentStock'] <= i.get('reorderPoint', 0)]
        if low_stock:
            alerts.append({
                'level': 'warning',
                'type': 'low_stock',
                'message': f"{len(low_stock)} items need reordering soon",
                'items': [item['name'] for item in low_stock[:5]]
            })
        
        # Slow moving items
        slow_moving = [i for i in items if i.get('averageDailySales', 0) < 0.5 and i['currentStock'] > 20]
        if slow_moving:
            alerts.append({
                'level': 'info',
                'type': 'slow_moving',
                'message': f"{len(slow_moving)} items are moving slowly",
                'items': [item['name'] for item in slow_moving[:5]]
            })
        
        return alerts
    
    def _get_opportunities(self, items):
        """Identify business opportunities"""
        opportunities = []
        
        # Fast-moving items that could be promoted
        fast_moving = [i for i in items if i.get('averageDailySales', 0) > 5]
        if fast_moving:
            opportunities.append({
                'type': 'promotion',
                'title': 'High Demand Items',
                'description': f"{len(fast_moving)} items have high demand. Consider bulk purchasing or promotions.",
                'items': [item['name'] for item in fast_moving[:3]],
                'potentialSavings': sum(item.get('costPrice', 0) * 10 for item in fast_moving[:3])
            })
        
        # Items with good profit margins
        high_margin = [i for i in items if (i.get('sellingPrice', 0) - i.get('costPrice', 0)) / i.get('costPrice', 1) > 0.5]
        if high_margin:
            opportunities.append({
                'type': 'profit',
                'title': 'High Margin Items',
                'description': f"{len(high_margin)} items have excellent profit margins. Focus on these.",
                'items': [item['name'] for item in high_margin[:3]]
            })
        
        return opportunities
    
    def _analyze_trends(self, items, recent_orders):
        """Analyze trends in inventory and ordering"""
        trends = {
            'orderFrequency': len(recent_orders),
            'topCategories': self._get_top_categories(items),
            'seasonalPatterns': 'Analysis requires more historical data'
        }
        
        return trends
    
    def _get_top_categories(self, items):
        """Get top categories by value"""
        categories = {}
        for item in items:
            cat = item.get('category', 'Uncategorized')
            if cat not in categories:
                categories[cat] = 0
            categories[cat] += item['currentStock'] * item['costPrice']
        
        return sorted(categories.items(), key=lambda x: x[1], reverse=True)[:5]
    
    def _get_ai_recommendations(self, items, recent_orders):
        """Get AI-powered recommendations using Gemini"""
        prompt = f"""
        Analyze this inventory data and provide 3-5 actionable recommendations for the shop owner.
        
        Total items: {len(items)}
        Recent orders: {len(recent_orders)}
        
        Key metrics:
        - Items out of stock: {len([i for i in items if i['currentStock'] == 0])}
        - Items low on stock: {len([i for i in items if i['currentStock'] <= i.get('reorderPoint', 0)])}
        - Average daily sales: {np.mean([i.get('averageDailySales', 0) for i in items]):.2f}
        
        Provide recommendations as a JSON array with format:
        [
          {{
            "title": "Recommendation title",
            "description": "Detailed explanation",
            "priority": "high|medium|low",
            "impact": "Brief impact statement"
          }}
        ]
        
        Return ONLY the JSON array, no additional text.
        """
        
        response = self.model.generate_content(prompt)
        recommendations_text = response.text
        
        # Clean up the response to extract JSON
        if '```json' in recommendations_text:
            recommendations_text = recommendations_text.split('```json')[1].split('```')[0].strip()
        elif '```' in recommendations_text:
            recommendations_text = recommendations_text.split('```')[1].split('```')[0].strip()
        
        recommendations = json.loads(recommendations_text)
        return recommendations
    
    def _get_rule_based_recommendations(self, items):
        """Fallback rule-based recommendations"""
        recommendations = []
        
        low_stock = [i for i in items if i['currentStock'] <= i.get('reorderPoint', 0)]
        if low_stock:
            recommendations.append({
                'title': 'Urgent Restocking Required',
                'description': f'{len(low_stock)} items need immediate restocking to avoid stockouts.',
                'priority': 'high',
                'impact': 'Prevents lost sales and customer dissatisfaction'
            })
        
        return recommendations
    
    def predict_demand(self, item_id, historical_data):
        """Predict future demand using simple forecasting"""
        if not historical_data or len(historical_data) < 7:
            return {
                'prediction': 'Insufficient data',
                'confidence': 'low'
            }
        
        # Simple moving average prediction
        recent_sales = [d['quantity'] for d in historical_data[-30:]]
        predicted_demand = np.mean(recent_sales)
        
        return {
            'itemId': item_id,
            'predictedDailyDemand': round(predicted_demand, 2),
            'predictedWeeklyDemand': round(predicted_demand * 7, 2),
            'predictedMonthlyDemand': round(predicted_demand * 30, 2),
            'confidence': 'medium',
            'trend': 'stable'
        }
    
    def optimize_pricing(self, items, market_data):
        """Suggest optimal pricing strategies"""
        suggestions = []
        
        for item in items[:10]:  # Limit to top 10 for performance
            current_margin = (item.get('sellingPrice', 0) - item.get('costPrice', 0)) / item.get('costPrice', 1)
            
            suggestion = {
                'itemId': item['id'],
                'itemName': item['name'],
                'currentPrice': item.get('sellingPrice', 0),
                'currentMargin': round(current_margin * 100, 2),
                'recommendation': 'maintain'
            }
            
            # Simple pricing logic
            if current_margin < 0.2:
                suggestion['suggestedPrice'] = item.get('costPrice', 0) * 1.3
                suggestion['recommendation'] = 'increase'
                suggestion['reasoning'] = 'Margin too low, recommend 30% markup'
            elif current_margin > 0.6 and item.get('averageDailySales', 0) < 1:
                suggestion['suggestedPrice'] = item.get('costPrice', 0) * 1.4
                suggestion['recommendation'] = 'decrease'
                suggestion['reasoning'] = 'High margin but slow sales, consider price reduction'
            
            suggestions.append(suggestion)
        
        return suggestions
