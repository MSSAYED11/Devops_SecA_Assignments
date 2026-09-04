# Task 1: Practice `git commit -a -m` vs `git commit -m`

## Core Differences
* **`git commit -m`**: Only commits files that are already staged using `git add`. It fails to commit unstaged modifications.
* **`git commit -a -m`**: Automatically stages and commits all modified or deleted tracked files in a single step.
* **Untracked Files**: Neither command will stage or commit brand-new (untracked) files without explicitly running `git add` first.

## Terminal Output Log

```bash
mssay@MSLap://mnt/c/Users/mssay/Desktop$ mkdir git-homework
mssay@MSLap://mnt/c/Users/mssay/Desktop$ cd git-homework
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git init
hint: Using 'master' as the name for the initial branch. This default branch name
hint: will change to "main" in Git 3.0. To configure the initial branch name
hint: to use in all of your new repositories, which will suppress this warning,
hint: call:
hint:
hint:    git config --global init.defaultBranch <name>
hint:
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint:
hint:    git branch -m <name>
hint:
hint: Disable this message with "git config set advice.defaultBranchName false"
Initialized empty Git repository in /mnt/c/Users/mssay/Desktop/git-homework/.git/
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "First line" > test.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git add test.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git commit -m "Initial commit"
[master (root-commit) 27f8bad] Initial commit
 1 file changed, 1 insertion(+)
 create mode 100644 test.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "Second line" >> test.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git commit -m "Try updating test.txt"
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   test.txt

no changes added to commit (use "git add" and/or "git commit -a")
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git commit -a -m "Update test.txt using -a option"
[master 03691c4] Update test.txt using -a option
 1 file changed, 1 insertion(+)
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "Untracked file" > newfile.txt
git commit -a -m "Try committing untracked file"
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        newfile.txt

nothing added to commit but untracked files present (use "git add" to track)
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$
