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
        Generate smart purchase recommendations using AI with backup vendors
        """
        recommendations = []
        
        for item in items:
            # Find vendors who sell this item
            matching_vendors = self._find_matching_vendors(item, vendors)
            
            if not matching_vendors:
                continue
            
            # Calculate optimal quantity to order
            optimal_quantity = self._calculate_optimal_quantity(item)
            
            # Select TOP 5 vendors (primary + 4 backups) based on multiple factors
            top_vendors = self._select_top_vendors(item, matching_vendors, optimal_quantity, top_n=5)
            
            if top_vendors and len(top_vendors) > 0:
                # Primary vendor
                primary_vendor = top_vendors[0]
                
                # Backup vendors (remaining)
                backup_vendors = []
                for idx, vendor in enumerate(top_vendors[1:], start=2):
                    backup_vendors.append({
                        'priority': idx,
                        'vendorId': vendor['id'],
                        'vendorName': vendor['name'],
                        'vendorSource': vendor.get('source', 'Database'),
                        'isOnline': vendor.get('isOnline', False),
                        'country': vendor.get('country', 'N/A'),
                        'price': vendor['price'],
                        'totalCost': vendor['price'] * optimal_quantity,
                        'deliveryTime': vendor.get('deliveryTime', 7),
                        'rating': vendor.get('rating', 0),
                        'stockAvailable': vendor.get('stockAvailable', True),
                        'reliabilityScore': vendor.get('confidence', 0.85),
                        'savings': vendor.get('savings', 0)
                    })
                
                recommendation = {
                    'itemId': item['id'],
                    'itemName': item['name'],
                    'currentStock': item['currentStock'],
                    'reorderPoint': item['reorderPoint'],
                    'recommendedQuantity': optimal_quantity,
                    # Primary vendor
                    'vendorId': primary_vendor['id'],
                    'vendorName': primary_vendor['name'],
                    'vendorSource': primary_vendor.get('source', 'Database'),
                    'isOnline': primary_vendor.get('isOnline', False),
                    'country': primary_vendor.get('country', 'N/A'),
                    'price': primary_vendor['price'],
                    'totalCost': primary_vendor['price'] * optimal_quantity,
                    'estimatedSavings': primary_vendor.get('savings', 0),
                    'deliveryTime': primary_vendor.get('deliveryTime', 7),
                    'confidence': primary_vendor.get('confidence', 0.85),
                    'rating': primary_vendor.get('rating', 0),
                    'stockAvailable': primary_vendor.get('stockAvailable', True),
                    'reasoning': self._generate_reasoning(item, primary_vendor, optimal_quantity),
                    # Backup system
                    'backupVendors': backup_vendors,
                    'totalVendorsFound': len(top_vendors),
                    'hasBackup': len(backup_vendors) > 0
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
                        'onTimeDelivery': vendor.get('performance', {}).get('onTimeDelivery', 100),
                        # Preserve vendor source metadata
                        'isOnline': vendor.get('isOnline', False),
                        'source': vendor.get('source', 'Database'),
                        'country': vendor.get('country', 'N/A')
                    })
                    break
        
        return matching
    
    def _calculate_optimal_quantity(self, item):
        """Calculate optimal order quantity using Economic Order Quantity (EOQ) logic"""
        current_stock = item['currentStock']
        reorder_point = item['reorderPoint']
        max_capacity = item.get('maxCapacity', float('inf'))
        avg_daily_sales = max(item.get('averageDailySales', 1), 1)  # Ensure at least 1
        
        # Calculate remaining capacity
        remaining_capacity = max_capacity - current_stock
        
        # Simple calculation: order enough for 30 days
        safety_stock = reorder_point - current_stock
        demand_based_quantity = avg_daily_sales * 30
        
        optimal_quantity = max(safety_stock, demand_based_quantity)
        
        # Respect capacity limit
        optimal_quantity = min(optimal_quantity, remaining_capacity)
        
        # Ensure we have at least something to order
        if optimal_quantity <= 0:
            return 0
        
        # Round up to reasonable quantity
        if optimal_quantity < 10:
            return max(optimal_quantity, 1)
        elif optimal_quantity < 50:
            return round(optimal_quantity / 5) * 5
        else:
            return round(optimal_quantity / 10) * 10
    
    def _select_top_vendors(self, item, vendors, quantity, top_n=5):
        """
        Select top N vendors based on comprehensive scoring system
        Returns vendors ranked by reliability, price, and delivery
        """
        if not vendors:
            return []
        
        import random
        
        scored_vendors = []
        avg_price = sum(v['price'] for v in vendors) / len(vendors) if vendors else 0
        
        for vendor in vendors:
            # Check if vendor meets MOQ
            moq = vendor.get('moq', 1)
            if quantity < moq:
                # Skip this vendor but note MOQ issue
                continue
            
            # Multi-factor scoring system
            # 1. Price Score (40%) - Lower is better
            price_score = 1 / (vendor['price'] + 1)
            normalized_price_score = min(price_score / 0.1, 1.0)  # Normalize
            
            # 2. Rating Score (25%)
            rating_score = vendor.get('rating', 4.0) / 5.0
            
            # 3. Delivery Reliability (20%)
            delivery_score = vendor.get('onTimeDelivery', 90) / 100
            
            # 4. Delivery Speed (15%) - Faster is better
            delivery_time = vendor.get('deliveryTime', 7)
            speed_score = max(0, 1 - (delivery_time / 30))  # 30 days = 0 score
            
            # Calculate composite score
            composite_score = (
                normalized_price_score * 0.40 +
                rating_score * 0.25 +
                delivery_score * 0.20 +
                speed_score * 0.15
            )
            
            # Add bonus for domestic vendors (faster, less customs issues)
            if vendor.get('country', '').upper() == 'USA':
                composite_score += 0.05
            
            # Calculate savings
            savings = (avg_price - vendor['price']) * quantity
            
            # Simulate stock availability (90% chance available)
            stock_available = random.random() < 0.9
            
            # Add to scored list
            scored_vendors.append({
                **vendor,
                'score': composite_score,
                'savings': savings,
                'confidence': min(composite_score, 0.95),
                'stockAvailable': stock_available,
                'priceRank': 0,  # Will be set after sorting
                'overallRank': 0  # Will be set after sorting
            })
        
        # Sort by score (highest first)
        scored_vendors.sort(key=lambda x: x['score'], reverse=True)
        
        # Assign ranks
        for idx, vendor in enumerate(scored_vendors):
            vendor['overallRank'] = idx + 1
        
        # Sort by price to assign price ranks
        price_sorted = sorted(scored_vendors, key=lambda x: x['price'])
        for idx, vendor in enumerate(price_sorted):
            vendor['priceRank'] = idx + 1
        
        # Return top N vendors
        return scored_vendors[:top_n]
    
    def _select_best_vendor(self, item, vendors, quantity):
        """Legacy method - now uses _select_top_vendors"""
        top_vendors = self._select_top_vendors(item, vendors, quantity, top_n=1)
        return top_vendors[0] if top_vendors else None
    
    def _generate_reasoning(self, item, vendor, quantity):
        """Generate human-readable reasoning for the recommendation"""
        reasons = []
        
        # Add vendor source information
        source_info = f"Found on {vendor.get('source', 'online marketplace')}"
        if vendor.get('country'):
            source_info += f" ({vendor['country']})"
        reasons.append(source_info)
        
        if vendor.get('savings', 0) > 0:
            reasons.append(f"Save ${vendor['savings']:.2f} compared to average market price")
        
        if vendor['rating'] >= 4:
            reasons.append(f"High vendor rating ({vendor['rating']}/5)")
        
        if vendor['onTimeDelivery'] >= 90:
            reasons.append(f"Reliable delivery record ({vendor['onTimeDelivery']}%)")
        
        # Avoid division by zero
        avg_daily_sales = item.get('averageDailySales', 0)
        if avg_daily_sales > 0:
            days_of_supply = quantity / avg_daily_sales
            reasons.append(f"Optimal quantity for {days_of_supply:.0f} days of sales")
        else:
            reasons.append(f"Optimal quantity for 30 days of sales")
        
        return " • ".join(reasons)
    
    def _get_ai_insights(self, items, recommendations):
        """Get AI-powered insights using Gemini"""
        try:
            prompt = f"""
            As an AI procurement advisor, analyze these purchase recommendations from both database vendors and online marketplaces.
            
            Items needing restock: {len(items)}
            Recommendations: {json.dumps(recommendations, indent=2)}
            
            For each recommendation, provide ONE concise, actionable insight (max 150 characters) considering:
            - Whether vendor is from database vs online marketplace (check 'isOnline' and 'vendorSource' fields)
            - Price competitiveness and potential savings
            - Delivery time and reliability
            - Any risks (e.g., international shipping, new vendor, market volatility)
            - Strategic purchasing advice
            
            Return ONLY a JSON array of brief insights (one per recommendation).
            Example: ["Great deal from Alibaba but verify quality standards first", "Trusted vendor with fast delivery - safe choice"]
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
