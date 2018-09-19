import json
import os
import os.path
import shutil
import sys
import random

from flask import request
from Database.Models.RepoFile import RepoFileModel
from App.Managers.ImageManager import ImageManager


class FineUploader:
    BASE_DIR = os.path.dirname(__file__)

    MEDIA_ROOT = os.path.join(BASE_DIR, '../../Public/repo')
    UPLOAD_DIRECTORY = os.path.join(MEDIA_ROOT, 'upload')
    CHUNKS_DIRECTORY = os.path.join(MEDIA_ROOT, 'chunks')

    # Utils
    ##################

    @classmethod
    def validate(cls,attrs):
        """ No-op function which will validate the client-side data.
        Werkzeug will throw an exception if you try to access an
        attribute that does not have a key for a MultiDict.
        """
        try:
            #required_attributes = ('qquuid', 'qqfilename')
            #[attrs.get(k) for k,v in attrs.items()]
            return True
        except Exception:
            return False

    @classmethod
    def handle_delete(cls, uuid):
        """ Handles a filesystem delete based on UUID."""
        location = os.path.join(cls.UPLOAD_DIRECTORY, uuid)
        shutil.rmtree(location)

    @classmethod
    def handle_file_delete(cls, f):
        """ Handles a filesystem delete based on UUID."""
        folderPath = os.path.join(cls.UPLOAD_DIRECTORY, f.name, "/")
        shutil.rmtree(folderPath)

        filePath = os.path.join(cls.UPLOAD_DIRECTORY, f.name, ".", f.fileType)
        shutil.rmtree(filePath)

    @classmethod
    def handle_upload(cls,f, attrs):
        """ Handle a chunked or non-chunked upload.
        """
        
        if attrs['folderId'] == "root":
            folderId = 0
        else :
            folderId = attrs['folderId']

        chunked = False
        dest_folder = os.path.join(cls.UPLOAD_DIRECTORY, attrs['qquuid'])
        dest = os.path.join(dest_folder, attrs['qqfilename'])

        # Chunked
        if 'qqtotalparts' in attrs and int(attrs['qqtotalparts']) > 1:
            chunked = True
            dest_folder = os.path.join(cls.CHUNKS_DIRECTORY, attrs['qquuid'])
            dest = os.path.join(dest_folder, attrs['qqfilename'], str(attrs['qqpartindex']))
            cls.save_upload(f, dest)
        else:
            # Generate repo file in database before saving actual file

            chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRTUVWXYZ0123456789"
            fileName = "".join(random.sample(chars, 6))
          
            while RepoFileModel.exists(fileName):
                fileName = "".join(random.sample(chars, 6))

            ogName = attrs['qqfilename']
            p = ogName.split(".")

            newFile = RepoFileModel(
                fileName, p[0], p[1], folderId, attrs['qquuid'])
            newFile.save()

            dest = os.path.join(cls.UPLOAD_DIRECTORY, fileName + "." + p[1])
            cls.save_upload(f, dest)

            ImageManager().createThumbnails(newFile)
            # ^^^ Generate repo file in database before saving actual file

       

        if chunked and (int(attrs['qqtotalparts']) - 1 == int(attrs['qqpartindex'])):

            chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRTUVWXYZ0123456789"
            fileName = "".join(random.sample(chars, 6))

            while RepoFileModel.exists(fileName):
                fileName = "".join(random.sample(chars, 6))

            ogName = attrs['qqfilename']
            p = ogName.split(".")


            newFile = RepoFileModel(fileName, p[0], p[1],folderId, attrs['qquuid'])
            newFile.save()

            dst = os.path.join(cls.UPLOAD_DIRECTORY,fileName + "." + p[1])

            cls.combine_chunks(attrs['qqtotalparts'],
                        attrs['qqtotalfilesize'],
                        source_folder=os.path.dirname(dest),
                           dest=dst)

            shutil.rmtree(os.path.dirname(os.path.dirname(dest)))

            ImageManager().createThumbnails(newFile)

    @classmethod
    def save_upload(cls,f, path):
        """ Save an upload.
        Uploads are stored in repo/uploads
        """

        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path))
        with open(path, 'wb+') as destination:
            destination.write(f.read())

    @classmethod
    def combine_chunks(cls,total_parts, total_size, source_folder, dest):
        """ Combine a chunked file into a whole file again. Goes through each part
        , in order, and appends that part's bytes to another destination file.

        Chunks are stored in media/chunks
        Uploads are saved in media/uploads
        """

        if not os.path.exists(os.path.dirname(dest)):
            os.makedirs(os.path.dirname(dest))

        with open(dest, 'wb+') as destination:
            for i in range(int(total_parts)):
                part = os.path.join(source_folder, str(i))
                with open(part, 'rb') as source:
                    destination.write(source.read())
