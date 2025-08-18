from odoo import http
from odoo.http import request


class CustomWebsiteController(http.Controller):

    @http.route('/', type='http', auth='public', website=True)
    def custom_page(self, **kwargs):
        """
        Route for the home page
        """
        return request.render('custom_website.custom_page', {
            'page_title': 'Custom Page - AuraCenter',
            'meta_description': 'Custom website page built with Odoo 15',
        })

    @http.route('/custom-page/api/data', type='json', auth='public', methods=['POST'])
    def get_custom_data(self, **kwargs):
        """
        API endpoint for custom data (example for AJAX calls)
        """
        return {
            'status': 'success',
            'message': 'Data retrieved successfully',
            'data': {
                'features': [
                    {
                        'title': 'Custom Styling',
                        'description': 'Beautiful CSS animations and responsive design',
                        'icon': 'fa-paint-brush'
                    },
                    {
                        'title': 'Interactive Elements',
                        'description': 'JavaScript functionality for enhanced user experience',
                        'icon': 'fa-mouse-pointer'
                    },
                    {
                        'title': 'Odoo Integration',
                        'description': 'Seamlessly integrated with Odoo\'s website framework',
                        'icon': 'fa-cogs'
                    }
                ],
                'stats': {
                    'total_visits': 1234,
                    'active_users': 89,
                    'satisfaction': 98
                }
            }
        }