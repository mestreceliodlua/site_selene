import subprocess
import os

os.chdir(r"C:\Users\PC 2\Downloads\anamnese-adulto")

cmds = [
    ["git", "add", "-A"],
    ["git", "-c", "user.name=opencode", "-c", "user.email=opencode@local", "commit", "-m", "fix: temperamento agora armazena string (dominante), nao objeto"],
    ["git", "push", "origin", "main"],
]

for cmd in cmds:
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(f"{' '.join(cmd[:2])} => {r.returncode}")
    if r.stdout:
        print(r.stdout.strip())
    if r.returncode != 0 and r.stderr:
        print(f"ERR: {r.stderr.strip()}")
