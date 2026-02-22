import json
import time
import requests
from collections import defaultdict

LOG_FILE = "/home/letv1n/comsci/Projects/HackEurope/cowrie_config/cowrie/var/log/cowrie/cowrie.json"
API_URL = "http://localhost:8000/api/v1/dashboard/send_honeypot_json"

# store logs grouped by session
sessions = defaultdict(list)


def follow(file):
    file.seek(0, 2)  # go to end of file
    while True:
        line = file.readline()
        if not line:
            time.sleep(0.2)
            continue
        yield line


with open(LOG_FILE, "r") as f:
    print("Session watcher is up and running")

    for line in follow(f):
        try:
            event = json.loads(line)
        except:
            continue

        session_id = event.get("session")
        if not session_id:
            continue

        # store every event for this session
        sessions[session_id].append(event)

        # when session ends → send all logs for that session
        if event.get("eventid") == "cowrie.session.closed":
            print("Session closed:", session_id)

            payload = {
                "session": session_id,
                "logs": sessions[session_id]
            }

            try:
                requests.post(API_URL, json=payload, timeout=5)
                print(f"POST sent ({len(payload['logs'])} events)")
            except Exception as e:
                print("POST failed:", e)

            # remove from memory after sending
            del sessions[session_id]
