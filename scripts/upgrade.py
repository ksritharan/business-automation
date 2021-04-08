from tectle.db import get_connection_non_flask
from tectle.config import load_config_non_flask
import requests

def upgrade(conn, cur, config):
    version = get_version(cur)
    new_version = version
    
    try:
        if version < 1:
            query = """
                CREATE TABLE db_version (
                    version           INTEGER
                );
            """
            cur.execute(query)
            query = """
                INSERT INTO db_version (version)
                VALUES (0);
            """
            cur.execute(query)
            query = """
                CREATE TABLE gcodes (
                    id                INTEGER PRIMARY KEY,
                    filename          TEXT,
                    date_modified     INTEGER
                );
            """
            cur.execute(query)
            query = """
                CREATE TABLE printer_gcodes (
                    id                INTEGER PRIMARY KEY,
                    filename          TEXT,
                    printer_ip        TEXT,
                    date_modified     INTEGER
                )
            """
            cur.execute(query)
            conn.commit()
            new_version = 1
        if version < 2:
            query = """
                ALTER TABLE printer_gcodes ADD COLUMN progress INTEGER DEFAULT 100
            """
            cur.executescript(query)
            conn.commit()
            new_version = 2
        if version < 3:
            query = """
                ALTER TABLE printers ADD COLUMN progress INTEGER DEFAULT 0
            """
            cur.executescript(query)
            conn.commit()
            new_version = 3
        if version < 4:
            query = """
                ALTER TABLE printers ADD COLUMN waterplate_only INTEGER DEFAULT 0
            """
            cur.executescript(query)
            conn.commit()
            new_version = 4
        if version < 5:
            response = requests.get("https://openapi.etsy.com/v2/countries?api_key="+config['API_KEY'])
            rows = response.json()['results']
            query = """
                CREATE TABLE countries (
                    id                INTEGER PRIMARY KEY,
                    country_id        INTEGER, /* Etsy */
                    country_code      TEXT,    /* CA, US, FR */
                    name              TEXT     /* Canada */
                );
                INSERT INTO countries (country_id, country_code, name)
                VALUES %s
            """ % ',\n'.join(["(%(country_id)s, '%(iso_country_code)s', '%(name)s')" % row for row in rows])
            cur.executescript(query)
            conn.commit()
            new_version = 5
        if version < 6:
            fh = open('scripts/resources/country_values.txt', 'r')
            values = fh.read()
            fh.close()
            query = """
                DROP TABLE IF EXISTS countries;
                CREATE TABLE countries (
                    id                INTEGER PRIMARY KEY,
                    country_id        INTEGER, /* Etsy */
                    country_code      TEXT,    /* CA, US, FR */
                    name              TEXT,    /* Canada */
                    currency          TEXT,    /* CAD */
                    fxrate            REAL     /* 1.0 */
                );
                INSERT INTO countries (country_id, country_code, name, currency, fxrate)
                VALUES %s
            """ % values
            cur.executescript(query)
            conn.commit()
            new_version = 6
            
    except Exception as e:
        conn.rollback()
        print(e)
    
    if new_version > version:
        try:
            update_version(cur, new_version)
            conn.commit()
            print('Updated to version %s' % new_version)
        except:
            pass

def get_version(cur):
    query = """
        SELECT COUNT(1)
          FROM sqlite_master
         WHERE type = 'table'
           AND name = 'db_version'
    """
    cur.execute(query)
    exists = cur.fetchone()[0]
    version = 0
    if exists:
        query = """
            SELECT version
              FROM db_version
        """
        cur.execute(query)
        version = cur.fetchone()[0]
    return version

def update_version(cur, new_version):
    query = "UPDATE db_version SET version = %s" % new_version
    cur.execute(query)
    
def upgrade_non_flask():
    config = load_config_non_flask()
    conn = get_connection_non_flask(config['DEBUG'] == 'True')
    cur = conn.cursor()
    upgrade(conn, cur, config)

if __name__ == '__main__':
    upgrade_non_flask()