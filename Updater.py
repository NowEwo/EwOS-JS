from zipfile import ZipFile
import requests
import shutil
import os

print("Downloading latest release ...")

Release = requests.get("https://github.com/WolfyGreyWolf/SelariaMountainRange/archive/refs/heads/main.zip")

print("Writing into ZIP file ...")

open("../Updater.zip" , "wb").write(Release.content)

SMRDIR = os.getcwd().split("\\")[-1]

print('Extracting all the files ...')

with ZipFile("../Updater.zip", 'r') as ExtractableZip:
    ExtractableZip.extractall()

print("Moving into the Selaria MountainRange Directory ...")

def merge(scr_path, dir_path):
  files = next(os.walk(scr_path))[2]
  folders = next(os.walk(scr_path))[1]
  for file in files: # Copy the files
    scr_file = scr_path + "/" + file
    dir_file = dir_path + "/" + file
    if os.path.exists(dir_file): # Delete the old files if already exist
      os.remove(dir_file)
    shutil.copy(scr_file, dir_file)
  for folder in folders: # Merge again with the subdirectories
    scr_folder = scr_path + "/" + folder
    dir_folder = dir_path + "/" + folder
    if not os.path.exists(dir_folder): # Create the subdirectories if dont already exist
      os.mkdir(dir_folder)
    merge(scr_folder, dir_folder)

merge("SelariaMountainRange-main" , "../"+SMRDIR)

print("Cleaning ...")

shutil.rmtree("SelariaMountainRange-main")
os.remove("../Updater.zip")

print("Updated ! \n You can now restart your Selaria MountainRange session !")