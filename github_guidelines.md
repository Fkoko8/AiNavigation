# GitHub Push Guidelines

This document outlines the basic steps to push your project changes to a GitHub repository.

## Initial Setup (if you haven't already)

1.  **Initialize a Git repository in your project folder:**
    ```bash
    git init
    ```
2.  **Link your local repository to your GitHub repository:**
    Replace `<YOUR_REPOSITORY_URL>` with the actual URL of your GitHub repository (e.g., `https://github.com/your-username/your-repo-name.git`).
    ```bash
    git remote add origin <YOUR_REPOSITORY_URL>
    ```
    *If you already have a remote named 'origin' and want to change it, use:*
    ```bash
    git remote set-url origin <YOUR_NEW_REPOSITORY_URL>
    ```
3.  **Fetch remote branches (optional, good practice):**
    ```bash
    git fetch
    ```

## Pushing Changes

Follow these steps every time you want to update your GitHub repository with your local changes:

1.  **Stage your changes:**
    This command adds all modified and new files in the current directory and its subdirectories to the staging area.
    ```bash
    git add .
    ```
    *If you only want to stage specific files, list them explicitly:*
    ```bash
    git add path/to/your/file.html path/to/your/otherfile.css
    ```
2.  **Commit your staged changes:**
    This command saves your staged changes to your local repository with a descriptive message. Replace `"Your descriptive commit message here"` with a concise summary of what you changed.
    ```bash
    git commit -m "Your descriptive commit message here"
    ```
3.  **Push your committed changes to GitHub:**
    This command uploads your local commits to your remote repository on GitHub. `origin` is the default name for your remote repository, and `main` (or `master`) is typically the name of your primary branch.
    ```bash
    git push origin main
    ```
    *If your primary branch is named `master` (older convention), use:*
    ```bash
    git push origin master
    ```
    *If you are pushing a new branch for the first time, you might need to set the upstream branch:*
    ```bash
    git push -u origin <your-branch-name>
    ```

## Important Notes:

*   **Check `git status` frequently:** This command shows you which files have been modified, staged, or are untracked. It's a great way to understand the state of your repository.
    ```bash
    git status
    ```
*   **`.gitignore` file:** This file specifies intentionally untracked files that Git should ignore. Make sure important files (like large video files, node_modules, or sensitive configuration) are listed in `.gitignore` to prevent them from being committed.
*   **Branching:** For larger projects or collaborative work, it's highly recommended to work on separate branches (e.g., `git checkout -b feature/new-feature`) and merge them into `main` once complete.
