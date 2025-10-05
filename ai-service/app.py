from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from services.recommendation_engine import RecommendationEngine
from services.inventory_analyzer import InventoryAnalyzer
from services.vendor_analyzer import VendorAnalyzer
from services.vendor_scraper import VendorScraper

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize AI services
recommendation_engine = RecommendationEngine()
inventory_analyzer = InventoryAnalyzer()
vendor_analyzer = VendorAnalyzer()
vendor_scraper = VendorScraper()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'AI Service is running',
        'version': '1.0.0'
    })

@app.route('/api/recommend-purchase', methods=['POST'])
def recommend_purchase():
    """
    Generate intelligent purchase recommendations based on inventory and vendors
    """
    try:
        data = request.json
        items = data.get('items', [])
        vendors = data.get('vendors', [])
        
        if not items:
            return jsonify({
                'message': 'No items to analyze',
                'recommendations': []
            })
        
        recommendations = recommendation_engine.generate_recommendations(items, vendors)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'summary': {
                'total_items': len(items),
                'total_recommendations': len(recommendations),
                'estimated_savings': sum(r.get('estimatedSavings', 0) for r in recommendations)
            }
        })
    except Exception as e:
        print(f"Error in recommend_purchase: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/inventory-insights', methods=['POST'])
def inventory_insights():
    """
    Provide AI-powered insights for inventory optimization
    """
    try:
        data = request.json
        items = data.get('items', [])
        recent_orders = data.get('recentOrders', [])
        
        insights = inventory_analyzer.analyze_inventory(items, recent_orders)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    except Exception as e:
        print(f"Error in inventory_insights: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/vendor-analysis', methods=['POST'])
def vendor_analysis():
    """
    Analyze vendor performance and provide recommendations
    """
    try:
        data = request.json
        vendor = data.get('vendor', {})
        orders = data.get('orders', [])
        
        analysis = vendor_analyzer.analyze_vendor(vendor, orders)
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
    except Exception as e:
        print(f"Error in vendor_analysis: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict-demand', methods=['POST'])
def predict_demand():
    """
    Predict future demand for inventory items
    """
    try:
        data = request.json
        item_id = data.get('itemId')
        historical_data = data.get('historicalData', [])
        
        prediction = inventory_analyzer.predict_demand(item_id, historical_data)
        
        return jsonify({
            'success': True,
            'prediction': prediction
        })
    except Exception as e:
        print(f"Error in predict_demand: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/optimize-pricing', methods=['POST'])
def optimize_pricing():
    """
    Suggest optimal pricing strategy
    """
    try:
        data = request.json
        items = data.get('items', [])
        market_data = data.get('marketData', {})
        
        pricing_suggestions = inventory_analyzer.optimize_pricing(items, market_data)
        
        return jsonify({
            'success': True,
            'suggestions': pricing_suggestions
        })
    except Exception as e:
        print(f"Error in optimize_pricing: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/search-vendors', methods=['POST'])
def search_vendors():
    """
    Search real vendors from online marketplaces using web scraping
    """
    try:
        data = request.json
        product_name = data.get('productName', '')
        quantity = data.get('quantity', 10)
        
        if not product_name:
            return jsonify({
                'success': False,
                'error': 'Product name is required'
            }), 400
        
        print(f"🔍 Scraping real vendors for: {product_name}")
        vendors = vendor_scraper.search_vendors(product_name, quantity)
        print(f"✅ Found {len(vendors)} real vendors")
        
        return jsonify({
            'success': True,
            'vendors': vendors,
            'count': len(vendors)
        })
    except Exception as e:
        print(f"Error in search_vendors: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
