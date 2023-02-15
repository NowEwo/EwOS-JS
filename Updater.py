from zipfile import ZipFile
import requests
import shutil
import os

print("Downloading latest release ...")
ZipFile = requests.get("https://github.com/WolfyGreyWolf/SelariaMountainRange/archive/refs/heads/main.zip")
print("Writing into ZIP file !")
open("../Updater.zip" , "wb").write(ZipFile.content)

SMRDIR = os.getcwd().split("\\")[-1]

with ZipFile("../Updater.zip", 'r') as Zip:

    print('Extracting all the files ...')
    Zip.extractall()

print("Moving into the Selaria MountainRange Directory !")

shutil.move("../Updater/SelariaMountainRange-main" , "../"+SMRDIR)

print("Updated !")