# Git Homework Assignment

## Task 1: Practice `git commit -a -m` vs `git commit -m`

### What I understood

While doing this task, I understood the main difference between `git commit -m` and `git commit -a -m`.

* `git commit -m` only commits the changes that I have already added to the staging area using `git add`.
* `git commit -a -m` automatically stages the changes made to files that are already being tracked and then commits them.
* Both commands **do not work for new/untracked files**. For a new file, I still have to use `git add` first.

So basically, the `-a` option saves me from running `git add` for already tracked files, but it doesn't automatically add completely new files.

### Terminal Output Log

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
```

### My observation

When I first changed `test.txt` and used `git commit -m`, Git didn't commit it because I hadn't staged the change.

Then I used `git commit -a -m`, and this time it worked because `test.txt` was already a tracked file.

After that I created `newfile.txt` and tried the same `-a` command. It didn't commit the file because it was a new untracked file. So I would need to run `git add newfile.txt` first.

---

## Task 2: Git Cherry-Pick

### What I understood

In this task, I created a separate `feature-branch` from `main` and made two commits on it.

The first feature commit was:

```text
25608fa feat: add feature 1
```

and the second one was:

```text
7e4e28d feat: add feature 2
```

After that, I switched back to `main` and used `git cherry-pick` to bring only the first feature commit into the `main` branch.

```bash
git cherry-pick 25608fa
```

Git created a new commit on `main` called:

```text
e2da5ac feat: add feature 1
```

So from this, I understood that cherry-pick lets me take a particular commit from another branch and apply its changes to the branch I'm currently on. I didn't have to merge the whole feature branch.

### Terminal Output Log

```bash
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git branch -m main
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "Main commit 1" > main1.txt && git add main1.txt && git commit -m "main: commit 1"
[main afa4bbf] main: commit 1
 1 file changed, 1 insertion(+)
 create mode 100644 main1.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "Main commit 2" > main2.txt && git add main2.txt && git commit -m "main: commit 2"
[main 00d6328] main: commit 2
 1 file changed, 1 insertion(+)
 create mode 100644 main2.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git checkout -b feature-branch
Switched to a new branch 'feature-branch'
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "Feature 1" > feat1.txt && git add feat1.txt && git commit -m "feat: add feature 1"
[feature-branch 25608fa] feat: add feature 1
 1 file changed, 1 insertion(+)
 create mode 100644 feat1.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ echo "Feature 2" > feat2.txt && git add feat2.txt && git commit -m "feat: add feature 2"
[feature-branch 7e4e28d] feat: add feature 2
 1 file changed, 1 insertion(+)
 create mode 100644 feat2.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git log --oneline
7e4e28d (HEAD -> feature-branch) feat: add feature 2
25608fa feat: add feature 1
00d6328 (main) main: commit 2
afa4bbf main: commit 1
03691c4 Update test.txt using -a option
27f8bad Initial commit
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git checkout main
Switched to branch 'main'
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git cherry-pick 25608fa
[main e2da5ac] feat: add feature 1
 Date: Fri Sep 4 16:36:26 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 feat1.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ git log --oneline
e2da5ac (HEAD -> main) feat: add feature 1
00d6328 main: commit 2
afa4bbf main: commit 1
03691c4 Update test.txt using -a option
27f8bad Initial commit
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$ ls
feat1.txt  main1.txt  main2.txt  newfile.txt  test.txt
mssay@MSLap://mnt/c/Users/mssay/Desktop/git-homework$
```

### My observation

After cherry-picking, I checked `git log --oneline` again and could see the new commit `e2da5ac` on `main`.

I also used `ls` and could see `feat1.txt` in the main branch. The second feature file, `feat2.txt`, wasn't brought over because I only cherry-picked the first commit.

So, in simple terms, **cherry-pick is useful when I want one particular commit from another branch without bringing the other commits along with it.**
