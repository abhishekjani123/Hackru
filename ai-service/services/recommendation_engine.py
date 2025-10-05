import os
import google.generativeai as genai
import json

class RecommendationEngine:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.model = None
        
    def generate_recommendations(self, items, vendors):
        """
        Generate smart purchase recommendations using AI
        """
        recommendations = []
        
        for item in items:
            # Find vendors who sell this item
            matching_vendors = self._find_matching_vendors(item, vendors)
            
            if not matching_vendors:
                continue
            
            # Calculate optimal quantity to order
            optimal_quantity = self._calculate_optimal_quantity(item)
            
            # Select best vendor based on multiple factors
            best_vendor = self._select_best_vendor(item, matching_vendors, optimal_quantity)
            
            if best_vendor:
                recommendation = {
                    'itemId': item['id'],
                    'itemName': item['name'],
                    'currentStock': item['currentStock'],
                    'reorderPoint': item['reorderPoint'],
                    'recommendedQuantity': optimal_quantity,
                    'vendorId': best_vendor['id'],
                    'vendorName': best_vendor['name'],
                    'price': best_vendor['price'],
                    'totalCost': best_vendor['price'] * optimal_quantity,
                    'estimatedSavings': best_vendor.get('savings', 0),
                    'deliveryTime': best_vendor.get('deliveryTime', 7),
                    'confidence': best_vendor.get('confidence', 0.85),
                    'reasoning': self._generate_reasoning(item, best_vendor, optimal_quantity)
                }
                recommendations.append(recommendation)
        
        # Get AI-powered insights using Gemini
        if recommendations and self.model:
            try:
                ai_insights = self._get_ai_insights(items, recommendations)
                for i, rec in enumerate(recommendations):
                    if i < len(ai_insights):
                        rec['aiInsight'] = ai_insights[i]
            except Exception as e:
                print(f"AI insights generation failed: {e}")
        
        return recommendations
    
    def _find_matching_vendors(self, item, vendors):
        """Find vendors who sell the item"""
        matching = []
        
        for vendor in vendors:
            for product in vendor.get('products', []):
                if (product['itemName'].lower() in item['name'].lower() or 
                    item['name'].lower() in product['itemName'].lower()):
                    matching.append({
                        'id': vendor['id'],
                        'name': vendor['name'],
                        'price': product['price'],
                        'moq': product.get('moq', 1),
                        'leadTime': product.get('leadTime', vendor.get('deliveryTime', 7)),
                        'rating': vendor.get('rating', 0),
                        'onTimeDelivery': vendor.get('performance', {}).get('onTimeDelivery', 100)
                    })
                    break
        
        return matching
    
    def _calculate_optimal_quantity(self, item):
        """Calculate optimal order quantity using Economic Order Quantity (EOQ) logic"""
        current_stock = item['currentStock']
        reorder_point = item['reorderPoint']
        avg_daily_sales = item.get('averageDailySales', 1)
        
        # Simple calculation: order enough for 30 days
        safety_stock = reorder_point - current_stock
        demand_based_quantity = avg_daily_sales * 30
        
        optimal_quantity = max(safety_stock, demand_based_quantity)
        
        # Round up to reasonable quantity
        if optimal_quantity < 10:
            return 10
        elif optimal_quantity < 50:
            return round(optimal_quantity / 5) * 5
        else:
            return round(optimal_quantity / 10) * 10
    
    def _select_best_vendor(self, item, vendors, quantity):
        """Select the best vendor based on price, quality, and reliability"""
        if not vendors:
            return None
        
        best_vendor = None
        best_score = -1
        
        for vendor in vendors:
            # Check if vendor meets MOQ
            if quantity < vendor.get('moq', 1):
                continue
            
            # Calculate score (weighted average)
            price_score = 1 / (vendor['price'] + 1)  # Lower price = higher score
            rating_score = vendor['rating'] / 5
            delivery_score = vendor['onTimeDelivery'] / 100
            
            # Weighted scoring
            score = (price_score * 0.5 + rating_score * 0.3 + delivery_score * 0.2)
            
            if score > best_score:
                best_score = score
                best_vendor = vendor
                
                # Calculate potential savings compared to average
                avg_price = sum(v['price'] for v in vendors) / len(vendors)
                vendor['savings'] = (avg_price - vendor['price']) * quantity
                vendor['confidence'] = min(score, 0.95)
        
        return best_vendor
    
    def _generate_reasoning(self, item, vendor, quantity):
        """Generate human-readable reasoning for the recommendation"""
        reasons = []
        
        if vendor.get('savings', 0) > 0:
            reasons.append(f"Save ${vendor['savings']:.2f} compared to average market price")
        
        if vendor['rating'] >= 4:
            reasons.append(f"High vendor rating ({vendor['rating']}/5)")
        
        if vendor['onTimeDelivery'] >= 90:
            reasons.append(f"Reliable delivery record ({vendor['onTimeDelivery']}%)")
        
        reasons.append(f"Optimal quantity for {quantity / item.get('averageDailySales', 1):.0f} days of sales")
        
        return " • ".join(reasons)
    
    def _get_ai_insights(self, items, recommendations):
        """Get AI-powered insights using Gemini"""
        try:
            prompt = f"""
            As an inventory management AI assistant, analyze these purchase recommendations and provide brief, actionable insights for each.
            
            Items needing restock: {len(items)}
            Recommendations: {json.dumps(recommendations, indent=2)}
            
            For each recommendation, provide a one-sentence insight about:
            - Why this is a good purchase
            - Any seasonal or trend considerations
            - Risk factors to consider
            
            Return ONLY a JSON array of insights (one per recommendation), each as a short string.
            Example format: ["insight 1", "insight 2", "insight 3"]
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
        except Exception as e:
            print(f"Error getting AI insights: {e}")
            return [f"AI-recommended purchase from {r['vendorName']}" for r in recommendations]
