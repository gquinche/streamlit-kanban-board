#!/usr/bin/env python3
"""
Build script for streamlit-kanban-os package
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a command and return True if successful"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, check=True, capture_output=True, text=True)
        print(f"✅ {cmd}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {cmd}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main build function"""
    print("🏗️  Building streamlit-kanban-os package...")

    # Get the project root
    project_root = Path(__file__).parent

    # Check if we're in the right directory
    if not (project_root / "pyproject.toml").exists():
        print("❌ Error: pyproject.toml not found. Run this script from the project root.")
        sys.exit(1)

    # Build the frontend
    frontend_dir = project_root / "streamlit_kanban_os" / "src" / "frontend"
    if frontend_dir.exists():
        print("\n📦 Building frontend...")
        if not run_command("npm run build", cwd=frontend_dir):
            print("❌ Frontend build failed")
            sys.exit(1)

    # Build the Python package
    print("\n🐍 Building Python package...")
    if not run_command("poetry build"):
        print("❌ Python package build failed")
        sys.exit(1)

    # Check the built package
    dist_dir = project_root / "dist"
    if dist_dir.exists():
        print("\n📦 Built packages:")
        for file in dist_dir.iterdir():
            if file.is_file():
                size = file.stat().st_size / 1024 / 1024  # Size in MB
                print(".1f")

    print("\n🎉 Build completed successfully!")
    print("\nTo install locally for testing:")
    print("  pip install -e .")
    print("\nTo upload to PyPI:")
    print("  poetry publish")

if __name__ == "__main__":
    main()
