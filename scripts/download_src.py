import requests
import shutil
import zipfile
import os

zip_name = '../business-automation-master.zip'
zip_inner_dir = 'business-automation-master/'

zip_dir = 'D:/business-automation/release versions/version to upload/business-automation-master/'
unzip_dir_parent = '../temp/'
unzip_dir = '../temp/business-automation-master'
to_copy_dir = '../to copy/'
final_zip_name = 'D:/business-automation/release versions/version to upload/business-automation-master'
base_dir = 'business-automation-master/'

def delete_dir(dir_name):
    try:
        shutil.rmtree(dir_name)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

def delete_file(filename):
    try:
        os.remove(filename)
    except OSError as e:
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
        'db/printer_debug.db'
    ]
    remove_files(to_copy_dir, things_to_delete)

def main():
    delete_dir(unzip_dir_parent)
    delete_dir(to_copy_dir)
    delete_file(zip_name)
    download_zip()
    unzip()
    delete_dir(unzip_dir_parent)
    delete_file(zip_name)
    package_folder()

if __name__ == '__main__':
    main()