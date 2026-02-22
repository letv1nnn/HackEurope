import subprocess as sp
import os

def run_process(command):
    result = sp.run(command, check=True)
    if result.returncode != 0:
        print(f"Command {' '.join(command)} failed with return code {result.returncode}")
    return result

os.chdir("./cowrie_config/cowrie/cowrie-env/")
print(os.getcwd())
cowrie_start = run_process(["bin/cowrie", "start"])
os.chdir("../../")
streamer_pr = run_process(["python3", "cowrie/session_watcher.py"])
