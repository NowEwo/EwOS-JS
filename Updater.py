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
    ExtractableZip.printdir()
    ExtractableZip.extractall()

print("Moving into the Selaria MountainRange Directory ...")

for Element in os.listdir("../Updater/SelariaMountainRange-main"):
    shutil.move("../Updater/SelariaMountainRange-main/"+Element , "../"+SMRDIR+"/"+Element)

print("Updated !")