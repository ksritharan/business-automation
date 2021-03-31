from tectle.buildschema import *

def main():
    num_printers = 1
    num_fake_receipts = 10
    max_num_items = 5
    max_quantity = 3
    conn = get_connection(DB_DEBUG_FILE)
    cur = conn.cursor()
    build_schema(cur)
    create_test_data(cur, num_printers, num_fake_receipts, max_num_items, max_quantity)
    #fetch_shipping_costs(cur)
    update_package_configs(cur)
    conn.commit()
    

if __name__ == '__main__':
    main()