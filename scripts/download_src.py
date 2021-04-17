import requests
import shutil
import zipfile
import os
from tectle.config import load_config_non_flask

zip_name = '../business-automation-master.zip'
zip_inner_dir = 'business-automation-master/'

unzip_dir_parent = '../temp/'
unzip_dir = '../temp/business-automation-master'
to_copy_dir = '../to copy/'
base_dir = 'business-automation-master/'

def get_prod_script():
    prod_zip_name = '../prod script.zip'
    delete_file(prod_zip_name, ignore=True)
    config = load_config_non_flask()
    url = config['PROD_SCRIPT']
    headers = {}
    headers['Accept'] = 'application/zip'
    headers['Content-Type'] = 'application/zip'
    r = requests.request("GET", url, headers=headers)
    r.raise_for_status()
    
    fd = open(prod_zip_name, 'wb')
    try:
        fd.write(r.content)
    except Exception as e:
        fd.close()
        raise e
    finally:
        fd.close()
    try:
        shutil.unpack_archive(prod_zip_name, to_copy_dir)
        #shutil.copytree(unzip_dir, to_copy_dir)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))
    delete_file(prod_zip_name)

def delete_dir(dir_name, ignore=False):
    try:
        shutil.rmtree(dir_name)
    except OSError as e:
        if not ignore:
            print ("Error: %s - %s." % (e.filename, e.strerror))

def delete_file(filename, ignore=False):
    try:
        os.remove(filename)
    except OSError as e:
        if not ignore:
            print ("Error: %s - %s." % (e.filename, e.strerror))

def unzip():
    try:
        shutil.unpack_archive(zip_name, unzip_dir_parent)
        shutil.copytree(unzip_dir, to_copy_dir)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

def download_zip():
    url = 'https://github.com/ksritharan/business-automation/archive/refs/heads/master.zip'
    
    headers = {}
    headers['Accept'] = 'application/zip'
    headers['Content-Type'] = 'application/zip'
    r = requests.request("GET", url, headers=headers)
    r.raise_for_status()
    
    fd = open(zip_name, 'wb')
    try:
        fd.write(r.content)
    except Exception as e:
        fd.close()
        raise e
    finally:
        fd.close()

def remove_files(main_dir, relative_paths):
    for path in relative_paths:
        file_or_folder_delete = os.path.join(main_dir, path)
        if os.path.isdir(file_or_folder_delete):
            delete_dir(file_or_folder_delete)
        else:
            delete_file(file_or_folder_delete)

def package_folder():
    things_to_delete = [
        'app.config',
        'screenshots/',
        'db/printer.db',
        'db/printer_debug.db',
        'python/Lib/site-packages/certifi',
        'python/Lib/site-packages/chardet',
        'python/Lib/site-packages/click',
        'python/Lib/site-packages/cv2',
        'python/Lib/site-packages/flask',
        'python/Lib/site-packages/idna',
        'python/Lib/site-packages/itsdangerous',
        'python/Lib/site-packages/jinja2',
        'python/Lib/site-packages/markupsafe',
        'python/Lib/site-packages/numpy',
        'python/Lib/site-packages/oauthlib',
        'python/Lib/site-packages/PyPDF2',
        'python/Lib/site-packages/reportlab',
        'python/Lib/site-packages/requests',
        'python/Lib/site-packages/requests_oauthlib',
        'python/Lib/site-packages/urllib3',
        'python/Lib/site-packages/waitress',
        'python/Lib/site-packages/werkzeug',
        'python/libcrypto-1_1.dll',
        'python/libffi-7.dll',
        'python/libssl-1_1.dll',
        'python/pyexpat.pyd',
        'python/python.cat',
        'python/python.exe',
        'python/python3.dll',
        'python/python38.dll',
        'python/python38.zip',
        'python/python38._pth',
        'python/pythonw.exe',
        'python/select.pyd',
        'python/sqlite3.dll',
        'python/unicodedata.pyd',
        'python/vcruntime140.dll',
        'python/winsound.pyd',
        'python/_asyncio.pyd',
        'python/_bz2.pyd',
        'python/_ctypes.pyd',
        'python/_decimal.pyd',
        'python/_elementtree.pyd',
        'python/_hashlib.pyd',
        'python/_lzma.pyd',
        'python/_msi.pyd',
        'python/_multiprocessing.pyd',
        'python/_overlapped.pyd',
        'python/_queue.pyd',
        'python/_socket.pyd',
        'python/_sqlite3.pyd',
        'python/_ssl.pyd',
    ]
    remove_files(to_copy_dir, things_to_delete)

def main():
    delete_dir(unzip_dir_parent, ignore=True)
    delete_dir(to_copy_dir, ignore=True)
    delete_file(zip_name, ignore=True)
    download_zip()
    unzip()
    delete_dir(unzip_dir_parent)
    delete_file(zip_name)
    get_prod_script()
    package_folder()

if __name__ == '__main__':
    main()