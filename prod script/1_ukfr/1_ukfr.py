from tectle.db import get_connection_non_flask, get_data_dict, get_data
from tectle.config import load_config_non_flask
import sys

notes = """
   ('2001326290', '2003873677')
   group_id was 846784762021040616177289561
   influencers
   ('1d0-b49', '2dd-e68', 'a34-ff0', '005-9dd', '372-bc3', '362-fb3', '186-57e')
"""

def print_query(conn, cur):
    query = """
        SELECT name, receipt_id, country, source, group_id, order_time
          FROM receipts
         WHERE receipt_id IN ('2001326290', '2003873677', '1d0-b49', '2dd-e68', 'a34-ff0', '005-9dd', '372-bc3', '362-fb3', '186-57e')
    """
    column_names, rows = get_data(cur, query)
    print('\t'.join(column_names))
    for row in rows:
        print ('\t'.join([str(val) for val in row]))

def run_query(conn, cur):
    query = """
        DELETE FROM receipt_packages
         WHERE receipt_id IN ('2001326290', '2003873677');
        DELETE FROM printer_queue
         WHERE receipt_id IN ('2001326290', '2003873677');
        DELETE FROM receipts
         WHERE receipt_id IN ('2001326290', '2003873677');
    """
    cur.executescript(query)
    query_2 = """
        UPDATE receipts
           SET order_time = 1620325022
         WHERE receipt_id IN ('a34-ff0', '005-9dd', '372-bc3', '362-fb3', '186-57e')
    """
    cur.execute(query_2)
    
    conn.commit()
    print_query(conn, cur)

def rollback_query(conn, cur):
    print('there is no rolling back...')
    print_query(conn, cur)

def main(mode):
    config = load_config_non_flask()
    conn = get_connection_non_flask(config['DEBUG'] == 'True')
    cur = conn.cursor()
    if mode == 'print':
        print_query(conn, cur)
    elif mode == 'run':
        run_query(conn, cur)
    elif mode == 'rollback':
        rollback_query(conn, cur)

if __name__ == '__main__':
    print(sys.argv)
    if len(sys.argv) != 2:
        print('invalid number of arguments')
    elif sys.argv[1] not in ('print', 'run', 'rollback'):
        print('invalid argument %s' % sys.argv[1])
    else:
        main(sys.argv[1])