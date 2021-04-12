from flask import Flask
from flask import render_template, url_for, request
from markupsafe import escape
from tectle import *

import logging
import logging.config
import threading
from time import sleep

logging.config.fileConfig('logging.conf')
logger = logging.getLogger()

app = Flask(__name__)

app.secret_key = b'\x81/\xc9$\xd7\xd6\xe8\x0b\xf1e\x01\x10I\xba\xedq'
app.loaded_for_useragent = {}

@app.before_request
def before_request_func():
    if 'User-Agent' in request.headers:
        useragent = request.headers['User-Agent']
        if useragent not in app.loaded_for_useragent:
            app.loaded_for_useragent[useragent] = True
            load_config(force=True)

@app.after_request
def add_header(r):
    # no browser cache
    r.headers['Cache-Control'] = 'no-store, max-age=0'
    return r

@app.route('/')
def index():
    response = check_etsy_or_redirect()
    if not response:
        response = do_home()
    return response

@app.route('/printers')
def printers():
    return do_printers()

@app.route('/printers/add', methods=['POST'])
def printers_add():
    ip_address = request.form.get('ip')
    name = request.form.get('name', '')
    return do_add_printers(ip_address, name=name)

@app.route('/printers/remove', methods=['POST'])
def printers_remove():
    printer_id = request.form.get('printer_id')
    return do_remove_printers(printer_id)

@app.route('/printers/color', methods=['POST'])
def printer_color():
    printer_id = request.form.get('printerId')
    color = request.form.get('color')
    return do_color_printers(printer_id, color)

@app.route('/printers/waterplate', methods=['POST'])
def printer_waterplate():
    printer_id = request.form.get('printerId')
    waterplate_only = int(request.form.get('waterplateOnly'))
    return do_waterplate_printers(printer_id, waterplate_only)

@app.route('/printers/system/update')
def printer_system_update():
    return do_update_system_files()
    
@app.route('/db')
def db_info():
    return do_db_info()
    
@app.route('/queue/update', methods=['POST'])
def queue_update():
    queue_item_id = request.form.get('itemId')
    from_printer_id = request.form.get('fromPrinterId')
    to_printer_id = request.form.get('toPrinterId')
    priority = request.form.get('priority')
    old_priority = request.form.get('oldPriority')
    return do_queue_update(queue_item_id, from_printer_id, to_printer_id, priority, old_priority)

@app.route('/printer/<int:printer_id>/print', methods=['POST'])
def printer_print(printer_id):
    return do_printer_print(printer_id)
    
@app.route('/printer/<int:printer_id>/status', methods=['GET'])
def printer_status(printer_id):
    return do_printer_status(printer_id)
    
@app.route('/printer/upload/status', methods=['GET'])
def printer_upload_status():
    return do_printer_upload_status()

@app.route('/orders')
def orders():
    return do_orders()
    
@app.route('/orders/contractshipping/<string:group_id>', methods=['POST'])
def shipping_label(group_id):
    return do_contract_shipping_label(group_id)

@app.route('/orders/manifest/<string:group_id>', methods=['POST'])
def manifest(group_id):
    return do_manifest(group_id)

@app.route('/orders/complete/<string:receipt_id>', methods=['POST'])
def order_complete(receipt_id):
    return do_order_complete(receipt_id)
    

@app.route('/orders/remove', methods=['POST'])
def remove_order():
    receipt_id = request.form.get('receipt_id', '')
    return do_remove_receipt(receipt_id)

@app.route('/inventory')
def inventory():
    return do_inventory()
    
@app.route('/inventory/<string:strategy>')
def inventory2(strategy):
    return do_inventory(strategy=strategy)
    
@app.route('/inventory/add', methods=['POST'])
def add_inventory():
    form_data = {
        'sku': request.form.get('sku', ''),
        'quantity': request.form.get('quantity', 0)
    }
    return do_add_items(form_data)

@app.route('/inventory/random', methods=['POST'])
def random_add():
    return do_add_random_items()
    
@app.route('/inventory/edit', methods=['POST'])
def edit_inventory():
    form_data = {
        'sku': request.form.get('sku', ''),
        'quantity': request.form.get('quantity', 0),
    }
    return do_edit_items(form_data)

@app.route('/manifest/create', methods=['POST'])
def create_manifest():
    strategy = request.form.get('strategy', 'oldest')
    return do_create_manifest(strategy)

@app.route('/boxes')
def boxes():
    return do_boxes()

@app.route('/boxes/add', methods=['POST'])
def add_boxes():
    form_data = {
        'type': request.form.get('type', ''),
        'length_cm': request.form.get('length_cm', ''),
        'width_cm': request.form.get('width_cm', ''),
        'height_cm': request.form.get('height_cm', ''),
        'length_in': request.form.get('length_in', ''),
        'width_in': request.form.get('width_in', ''),
        'height_in': request.form.get('height_in', ''),
        'cost': request.form.get('cost', ''),
        'weight_kg': request.form.get('weight_kg', '')
    }
    return do_add_boxes(form_data)

@app.route('/boxes/edit', methods=['POST'])
def edit_boxes():
    form_data = {
        'id': request.form.get('id', ''),
        'type': request.form.get('type', ''),
        'length_cm': request.form.get('length_cm', ''),
        'width_cm': request.form.get('width_cm', ''),
        'height_cm': request.form.get('height_cm', ''),
        'length_in': request.form.get('length_in', ''),
        'width_in': request.form.get('width_in', ''),
        'height_in': request.form.get('height_in', ''),
        'cost': request.form.get('cost', ''),
        'weight_kg': request.form.get('weight_kg', '')
    }
    return do_edit_boxes(form_data)

@app.route('/boxes/remove', methods=['POST'])
def remove_boxes():
    box_id = request.form.get('id', '')
    return do_remove_boxes(box_id)
    
@app.route('/boxes/shipping', methods=['POST'])
def shipping_costs():
    return do_shipping_costs()

@app.route('/boxes/inventory/edit', methods=['POST'])
def box_inventory():
    form_data = {
        'id': request.form.get('id', ''),
        'quantity': request.form.get('quantity', 0),
    }
    return do_edit_box_inventory(form_data)
    
@app.route('/orders/<string:manifest>')
def orders_manifest2(manifest):
    return do_orders(group_id=manifest)

@app.route('/orders/update', methods=['POST'])
def update_orders():
    return do_update_orders()

@app.route('/products/')
def products():
    return do_products()

@app.route('/products/edit', methods=['POST'])
def edit_products():
    product_id = request.form.get('id', '')
    package_class_id = request.form.get('package_class_id', '')
    return do_edit_product_class(product_id, package_class_id)

@app.route('/products/class/add', methods=['POST'])
def add_class():
    form_data = {
        'class': request.form.get('class', ''),
        'weight_kg': request.form.get('weight_kg', ''),
        'cost': request.form.get('cost', '')
    }
    return do_add_class(form_data)

@app.route('/products/class/edit', methods=['POST'])
def edit_class():
    form_data = {
        'id': request.form.get('id', ''),
        'class': request.form.get('class', ''),
        'weight_kg': request.form.get('weight_kg', ''),
        'cost': request.form.get('cost', '')
    }
    return do_edit_class(form_data)

@app.route('/products/class/remove', methods=['POST'])
def remove_class():
    class_id = request.form.get('id', '')
    return do_remove_class(class_id)

@app.route('/filament/edit', methods=['POST'])
def edit_filament():
    form_data = {
        'color': request.form.get('color', ''),
        'weight_kg': request.form.get('weight_kg', 0),
    }
    return do_edit_filament(form_data)

@app.route('/products/weight/edit', methods=['POST'])
def edit_product_weight():
    form_data = {
        'sku': request.form.get('sku', ''),
        'filament_weight_kg': request.form.get('filament_weight_kg', '')
    }
    return do_edit_product_weight(form_data)

@app.route('/products/print-time/edit', methods=['POST'])
def edit_product_print_time():
    form_data = {
        'sku': request.form.get('sku', ''),
        'increment': request.form.get('increment', 0)
    }
    return do_edit_product_print_time(form_data)
    
@app.route('/packaging/')
def packaging():
    return do_packaging()

@app.route('/packaging/add', methods=['POST'])
def add_packaging():
    return do_add_packaging(request.form.to_dict())

@app.route('/packaging/edit', methods=['POST'])
def edit_packaging():
    return do_edit_packaging(request.form.to_dict())

@app.route('/packaging/remove', methods=['POST'])
def remove_packaging():
    package_id = request.form.get('id', '')
    return do_remove_packaging(package_id)
# "fake printer"

@app.route('/printer/<string:printer_ip>/rr_status')
def printer_rrstatus(printer_ip):
    status_type = request.args.get('type', '')
    return do_printer_rrstatus(printer_ip, status_type)

@app.route('/printer/<string:printer_ip>/rr_gcode')
def printer_gcode(printer_ip):
    gcode = request.args.get('gcode', '')
    return do_printer_gcode(printer_ip, gcode)

@app.route('/printer/<string:printer_ip>/rr_reply')
def printer_reply(printer_ip):
    return do_printer_reply(printer_ip)

@app.route('/printer/<string:printer_ip>/rr_upload', methods=['POST'])
def printer_upload(printer_ip):
    filename = request.args.get('name', '')
    time = request.args.get('time', '')
    return do_printer_upload(filename, time, request)
    
@app.route('/printer/<string:printer_ip>/rr_fileinfo')
def printer_fileinfo(printer_ip):
    return do_printer_fileinfo(printer_ip)
    
@app.route('/etsy')
def etsy():
    return do_etsy()
@app.route('/etsy-callback')
def etsy_callback():
    return do_etsy_callback(request)


# "fake orders"
@app.route('/receipts/open')
def get_open_receipts():
    limit = int(request.args.get('limit', '50'))
    offset = int(request.args.get('offset', '0'))
    return do_open_receipts(limit, offset)
@app.route('/receipts/<string:receipt_id>/transactions')
def get_transactions(receipt_id):
    return do_transactions(receipt_id)

#webflow
@app.route('/sites/orders')
def get_unfulfilled_receipts():
    limit = int(request.args.get('limit', '50'))
    offset = int(request.args.get('offset', '0'))
    return do_unfulfilled_receipts(limit, offset)
    
def worker_thread():
    config = load_config_non_flask()
    url_template = None
    is_debug = 'DEBUG' in config and config['DEBUG'] == 'True'
    is_printer_debug = 'PRINTER_DEBUG' in config and config['PRINTER_DEBUG'] == 'True'
    sleep_interval = float(config.get('SLEEP_INTERVAL', '60')) # seconds
    while True:
        update_printers(is_printer_debug, is_debug)
        sleep(sleep_interval)
    
if __name__ == '__main__':
    threading.Thread(target=worker_thread, daemon=True).start()
    from waitress import serve
    serve(app, host="127.0.0.1", port=8080, threads=16)