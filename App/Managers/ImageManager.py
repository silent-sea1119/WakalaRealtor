import os
from PIL import Image

class ImageManager:
    BASE_DIR = os.path.dirname(__file__)
    UPLOAD_DIRECTORY = os.path.join(BASE_DIR, '../../Public/repo/upload')

    @classmethod
    def createThumbnails(cls,file):
        
        if not cls.resize_and_crop(file, (150, 150)):
            return False
        
        if not cls.resize_and_crop(file, (300, 300)):
            return False

        return True

    @classmethod
    def resize(cls,file,w, h):
        fileName = "thumb_" + str(w) + "_" + str(h) + ".jpg"
        inFile = os.path.join(cls.UPLOAD_DIRECTORY, file.name + "." + file.fileType)
        outFile = os.path.join(cls.UPLOAD_DIRECTORY,file.name, fileName)

        if not os.path.exists(os.path.dirname(outFile)):
            os.makedirs(os.path.dirname(outFile))

        try:
            im = Image.open(inFile)
            im.thumbnail((w, h), Image.ANTIALIAS)
            im.save(outFile, "JPEG")
            return True
        except IOError:
            return False

    @classmethod
    def resize_and_crop(cls,file,size, crop_type='middle'):
        fileName = "thumb_" + str(size[0]) + "_" + str(size[1]) + ".jpg"
        img_path = os.path.join(cls.UPLOAD_DIRECTORY,
                                file.name + "." + file.fileType)
        modified_path = os.path.join(cls.UPLOAD_DIRECTORY,file.name, fileName)

        if not os.path.exists(os.path.dirname(modified_path)):
            os.makedirs(os.path.dirname(modified_path))

        """
            Resize and crop an image to fit the specified size.
            args:
                img_path: path for the image to resize.
                modified_path: path to store the modified image.
                size: `(width, height)` tuple.
                crop_type: can be 'top', 'middle' or 'bottom', depending on this
                    value, the image will cropped getting the 'top/left', 'midle' or
                    'bottom/rigth' of the image to fit the size.
            raises:
                Exception: if can not open the file in img_path of there is problems
                    to save the image.
                ValueError: if an invalid `crop_type` is provided.
        """

        # If height is higher we resize vertically, if not we resize horizontally
        img = Image.open(img_path)
        # Get current and desired ratio for the images
        img_ratio = img.size[0] / float(img.size[1])
        ratio = size[0] / float(size[1])
        #The image is scaled/cropped vertically or horizontally depending on the ratio
        if ratio > img_ratio:
            img = img.resize((int(size[0], size[0] * img.size[1]) / int(img.size[0])),
                            Image.ANTIALIAS)
            # Crop in the top, middle or bottom
            if crop_type == 'top':
                box = (0, 0, img.size[0], size[1])
            elif crop_type == 'middle':
                box = (0, (img.size[1] - size[1]) / 2,
                    img.size[0], (img.size[1] + size[1]) / 2)
            elif crop_type == 'bottom':
                box = (0, img.size[1] - size[1], img.size[0], img.size[1])
            else:
                return False
                #raise ValueError('ERROR: invalid value for crop_type')

            img = img.crop(box)
        elif ratio < img_ratio:
            img = img.resize((int(size[1] * img.size[0] / img.size[1]), int(size[1])),
                            Image.ANTIALIAS)
            # Crop in the top, middle or bottom
            if crop_type == 'top':
                box = (0, 0, size[0], img.size[1])
            elif crop_type == 'middle':
                box = ((img.size[0] - size[0]) / 2, 0,
                    (img.size[0] + size[0]) / 2, img.size[1])
            elif crop_type == 'bottom':
                box = (img.size[0] - size[0], 0, img.size[0], img.size[1])
            else:
                return False
                #raise ValueError('ERROR: invalid value for crop_type')
            img = img.crop(box)
        else:
            img = img.resize((size[0], size[1]),
                            Image.ANTIALIAS)
            # If the scale is the same, we do not need to crop
        img.save(modified_path)

        return True
