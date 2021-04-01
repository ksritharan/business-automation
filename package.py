import requests
import shutil
import os
zip_name = 'D:/business-automation/release versions/version to upload/business-automation-master.zip'
zip_dir = 'D:/business-automation/release versions/version to upload/business-automation-master/'
unzip_dir_parent = 'D:/business-automation/release versions/version to upload/'
unzip_dir = 'D:/business-automation/release versions/version to upload/business-automation-master/'
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
    remove_files(unzip_dir, things_to_delete)
    delete_file(zip_name)
    shutil.make_archive(final_zip_name, 'zip', unzip_dir_parent, base_dir) 

def main():
    delete_dir(zip_dir)
    delete_file(zip_name)
    download_zip()
    unzip()
    package_folder()

if __name__ == '__main__':
    main()