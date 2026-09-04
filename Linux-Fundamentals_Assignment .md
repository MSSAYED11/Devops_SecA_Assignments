# Assignment 1: Linux Fundamentals

## Task 1: Soft Link vs Hard Link

In Linux, hard links and soft links are both used to link one file with another, but they work a little differently.

### Hard Link

A hard link is basically another name for the same file. Both the original file and the hard link point to the same inode, so the actual data is shared between them.

If we delete the original file, the hard link will still work because the data is still there.

Some important points:
- Both files have the same inode number.
- Deleting the original file does not delete the data.
- Hard links normally cannot be created between different filesystems.
- We cannot normally create hard links to directories.

### Soft Link

A soft link, also called a symbolic link, is more like a shortcut. It stores the path of the file that it is pointing to.

So if the original file is deleted or moved, the soft link will not work anymore and becomes a dangling link.

Some points about soft links:
- It has its own inode.
- It points to the path of another file.
- It can point to directories also.
- It can work across different filesystems.

### Commands I used for practice

First I created a simple file:

```bash
echo "Hello Linux" > target.txt
```

Then created a hard link:

```bash
ln target.txt hardlink.txt
```

And a soft link:

```bash
ln -s target.txt softlink.txt
```

To check the inode numbers, I used:

```bash
ls -li
```

The original file and the hard link will have the same inode number.

After that I deleted the original file:

```bash
rm target.txt
```

Now if I check the hard link:

```bash
cat hardlink.txt
```

It still prints:

```text
Hello Linux
```

But if I try the soft link:

```bash
cat softlink.txt
```

It gives an error because the original file no longer exists.

---

## Task 2: useradd vs adduser

Both `useradd` and `adduser` are used for creating users in Linux, but they are not exactly the same.

### useradd

`useradd` is the lower-level command. It is available on most Linux distributions.

It usually requires us to provide extra options if we want things like a home directory or password to be configured automatically.

For example:

```bash
sudo useradd testuser
```

We can also use different options with it depending on what we want to setup.

### adduser

`adduser` is more user-friendly and is commonly available on Ubuntu and Debian.

It is basically a higher-level script that makes creating a user easier. It asks for things like the password and user information and also creates the home directory.

For example:

```bash
sudo adduser testuser
```

It will ask some questions during the process and setup the user for us.

So, on Ubuntu/Debian, I would prefer `adduser` when creating a normal user because it is easier and handles most of the setup automatically.

---

## Task 3: journalctl

`journalctl` is a command used to view system logs in Linux.

Linux systems using `systemd` store a lot of their logs using `systemd-journald`. Using `journalctl`, we can check these logs and find out what happened in the system.

To see the general system logs:

```bash
journalctl
```

If we want to see logs of a particular service, we can use `-u`.

For example, for SSH:

```bash
journalctl -u ssh.service
```

We can also watch the logs in real time. This is useful when troubleshooting a service:

```bash
journalctl -u ssh.service -f -n 50
```

Here, `-f` keeps following the new logs and `-n 50` shows the last 50 entries initially.

---

## Task 4: Linux Command Cheat Sheet

Here are some basic Linux commands that I used / learned:

### `ls -la`

Shows the files and folders in the current directory. The `-a` also shows hidden files and `-l` gives detailed information like permissions, owner, size etc.

```bash
ls -la
```

### `cd`

Used to move from one directory to another.

```bash
cd /path
```

### `pwd`

Shows the current directory that we are in.

```bash
pwd
```

### `chmod 755`

Used to change file permissions.

```bash
chmod 755 file
```

With `755`, the owner gets read, write and execute permissions, while the group and others get read and execute permissions.

### `chown`

Used to change the owner and group of a file.

```bash
chown user:group file
```

### `top` / `htop`

These commands are used to see running processes and system activity in real time.

```bash
top
```

`htop` is similar but has a more user-friendly interface.

### `grep`

Used for searching text inside files.

```bash
grep -i "pattern" file
```

The `-i` makes the search case-insensitive.

### `find`

Used to search for files and directories.

For example, to find all `.txt` files in the current directory and its subdirectories:

```bash
find . -name "*.txt"
```

These are some of the basic Linux commands that are useful for working with files, users, permissions, processes and logs.
