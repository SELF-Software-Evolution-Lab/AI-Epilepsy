from ftplib import FTP
from os import environ

def fetch_file(ftp_dir, source, dest):
    ftp_host = environ.get("FTP_DEFAULT_HOST")
    ftp_user = environ.get("FTP_DEFAULT_USER")
    ftp_pass = environ.get("FTP_DEFAULT_PASS")
    with FTP(ftp_host, ftp_user, ftp_pass) as ftp :
        ftp.cwd(ftp_dir)
        with open(dest, 'wb') as fp:
            ftp.retrbinary('RETR '+source, fp.write)
    

