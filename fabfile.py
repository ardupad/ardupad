#
# Fabric script to manage ardupad
#


import os
from time import strftime

from fabric.api import env, run, sudo, local, \
     cd, hosts, runs_once, prompt, require

env.user = "ardupad"
env.hosts = ["dev.ardupad.cc:2222"]
env.backup_dir = "/home/ardupad/backup"

@runs_once
def beta():
    """ The beta environment """
    env.remote_app_dir = "/home/ardupad/domains/dev.ardupad.cc/ardupad/"
    env.branch = "dev"
    env.database = "/home/ardupad/domains/dev.ardupad.cc/ardupad.db"

def update_code():
    """
    Push code to github
    Pull code from server
    """
    require('remote_app_dir', provided_by=[beta])

    local("git push origin master dev")

    with cd(env.remote_app_dir):
        run("git checkout %s" % env.branch)
        run("git pull origin %s" % env.branch)

def backup(files=True, database=True):
    """
    Backup
    """
    require('branch', provided_by=[beta])
    date = strftime("%Y%m%d%H%M")

    if files:
        with cd(os.path.join(env.remote_app_dir, '..')):
            run("tar czf %s/%s/ardupad-%s-%s.tar "
                "ardupad" % (env.backup_dir, env.branch, env.branch, date)
                )

    if database:
        run("cp %s %s/%s/ardupad-%s-%s.sqlite" %
            (env.database, env.backup_dir, env.branch, env.branch, date)
            )

def deploy(do_backup=True, do_update=True):
    require('branch', provided_by=[beta])
    require('remote_app_dir', provided_by=[beta])

    if do_backup == True:
        backup()

    if do_update == True:
        update_code()

def list_backups():
    require('branch', provided_by=[beta])
    run("ls %s/%s" % (env.backup_dir, env.branch))

def restart():
    sudo("/etc/init.d/ardupad restart", shell=False)
