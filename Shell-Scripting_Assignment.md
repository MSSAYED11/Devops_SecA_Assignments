# Assignment 2: Shell Scripting Homework

## System Information Script Output

```text
mssay@MSLap://mnt/c/Users/mssay/Desktop$ mkdir -p shell-scripting-task
mssay@MSLap://mnt/c/Users/mssay/Desktop$ cd shell-scripting-task
mssay@MSLap://mnt/c/Users/mssay/Desktop/shell-scripting-task$ nano sys_info.sh
mssay@MSLap://mnt/c/Users/mssay/Desktop/shell-scripting-task$ chmod +x sys_info.sh
mssay@MSLap://mnt/c/Users/mssay/Desktop/shell-scripting-task$ ./sys_info.sh
==========================================
         SYSTEM INFORMATION REPORT
==========================================
Date & Time : Fri Sep  4 15:40:43 UTC 2026
Hostname    : MSLap
Logged User : mssay
==========================================

--- Disk Usage ---
Filesystem      Size  Used Avail Use% Mounted on
none            5.8G     0  5.8G   0% /usr/lib/modules/6.6.114.1-microsoft-standard-WSL2
none            5.8G  4.0K  5.8G   1% /mnt/wsl
drivers         458G  448G   11G  98% /usr/lib/wsl/drivers
/dev/sdd       1007G  1.9G  954G   1% /
none            5.8G   32K  5.8G   1% /mnt/wslg
none            5.8G     0  5.8G   0% /usr/lib/wsl/lib
rootfs          5.8G  2.8M  5.8G   1% /init
none            5.8G  620K  5.8G   1% /run
none            5.8G     0  5.8G   0% /run/lock
none            5.8G     0  5.8G   0% /run/shm
none            5.8G   80K  5.8G   1% /mnt/wslg/versions.txt
none            5.8G   80K  5.8G   1% /mnt/wslg/doc
C:\             458G  448G   11G  98% /mnt/c
D:\              18G   10G  7.7G  57% /mnt/d
none            1.0M     0  1.0M   0% /run/credentials/systemd-journald.service
tmpfs           5.8G     0  5.8G   0% /tmp
none            1.0M     0  1.0M   0% /run/credentials/systemd-resolved.service
none            1.0M     0  1.0M   0% /run/credentials/getty@tty1.service
tmpfs           1.2G   12K  1.2G   1% /run/user/1000
------------------------------------------
Enter new directory name to create: output_dir
Enter output file name (e.g. processes.txt): processes.txt
Directory 'output_dir' successfully created.
Running processes saved to 'output_dir/processes.txt'.
==========================================
ay@MSLap://mnt/c/Users/mssay/Desktop/shell-scripting-task$ ls -la output_dir/
total 4
drwxrwxrwx 1 mssay mssay 4096 Sep  4 15:42 .
drwxrwxrwx 1 mssay mssay 4096 Sep  4 15:42 ..
-rwxrwxrwx 1 mssay mssay 3022 Sep  4 15:42 processes.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/shell-scripting-task$ head -n 10 output_dir/processes.txt
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.3  0.1  24248 15180 ?        Ss   15:39   0:00 /sbin/init
root           2  0.0  0.0   3172  2208 hvc0     Sl+  15:39   0:00 /init
root           7  0.0  0.0   3172  2044 hvc0     Sl+  15:39   0:00 plan9 --control-socket 7 --log-level 4 --server-fd 8 --pipe-fd 10 --log-truncate
root          47  0.0  0.1  42188 16276 ?        S<s  15:39   0:00 /usr/lib/systemd/systemd-journald
systemd+      81  0.0  0.1  22400 14156 ?        Ss   15:39   0:00 /usr/lib/systemd/systemd-resolved
root          87  0.1  0.0  35304 12108 ?        Ss   15:39   0:00 /usr/lib/systemd/systemd-udevd
root         148  0.0  0.0   2880  1916 ?        Ss   15:39   0:00 /bin/sh /usr/lib/systemd/scripts/chronyd-starter.sh -n -F 1
root         152  0.0  0.0   4464  3064 ?        Ss   15:39   0:00 /usr/sbin/cron -f -P
message+     157  0.0  0.0   8800  5252 ?        Ss   15:39   0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
```
