<?php
$cropfiles = array("mongodb_helper.php");

for($cropindex=0;isset($cropfiles[$cropindex]);$cropindex++){
		$dir = $cropfiles[$cropindex];
		while(1){
			if (file_exists($dir)) {	include_once($dir); break;	}
			else {		$dir = "../".$dir;	}
			}
}

class CropAvatar {
  private $src;
  private $data;
  private $dst;
  private $type;
  private $extension;
  private $msg;
  private $imageId;
  private $dir;

  function __construct($src, $data, $file,$con,$dir) {
	$this -> dir = $dir;
    $this -> setSrc($src);
    $this -> setData($data);
    $this -> setFile($file,$con);
    $this -> crop($this -> src, $this -> dst, $this -> data);
  }

  private function setSrc($src) {
    if (!empty($src)) {
      $type = exif_imagetype($src);

      if ($type) {
        $this -> src = $src;
        $this -> type = $type;
        $this -> extension = image_type_to_extension($type);
        $this -> setDst();
      }
    }
  }

  private function setData($data) {
    if (!empty($data)) {
      $this -> data = json_decode(stripslashes($data));
    }
  }

  private function setFile($file,$connection) {
    $errorCode = $file['error'];

    if ($errorCode === UPLOAD_ERR_OK) {
      $type = exif_imagetype($file['tmp_name']);

      if ($type) {
        $extension = image_type_to_extension($type);
        //$src = 'images/' . date('YmdHis') . '.original' . $extension;

        $std_id= $_SESSION["std_id"];
        $char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRTUVWXYZ0123456789";

        if ($type == IMAGETYPE_GIF || $type == IMAGETYPE_JPEG || $type == IMAGETYPE_PNG) {

          do{
        	$img_upload = substr(str_shuffle($char),0,10);
			$result = $connection->students->collections->findOne(['std_id'=>$std_id,'name'=>$img_upload,'type'=>'png']);
			
          } while ($result!=NULL);
			
			$helper = new mongodb_helper($connection);
			
			$result = $connection->students->collections_folder->findOne(['std_id'=>$std_id,'name'=>'Profile Pictures']);
			
			if($result==NULL){	
				$input["name"] = 'Profile Pictures';
				$input["std_id"] = $std_id;
				
				$result = $helper->insertIntoStudentCollectionsFolder($input);
				$folder_id = $result->getInsertedId();	
			}
			else {
				$folder_id = $result['_id'];
			}
				
			$input['folder'] = $folder_id;	
			$input['name'] = $img_upload;
			$input['type'] = "png";
			$input['std_id'] = $std_id;
			
			$result = $helper->insertIntoStudentCollections($input);
			$this->imageId = $result->getInsertedId();

			$src = $this->dir.$std_id."/".$img_upload.".".$extension;

			$result = move_uploaded_file($file['tmp_name'],$src);
			
			//DELETE ALL IMAGES IN TEMP FOLDER
			$files = glob($this->dir.$std_id."/temp/*");
			foreach($files as $file){
			  if(is_file($file)) {
				unlink($file);
			  }
			}

          if ($result) {
            $this -> src = $src;
            $this -> type = $type;
            $this -> extension = $extension;
            $this -> dst = $this->dir.$std_id."/".$img_upload.".png";
          } else {
             $this -> msg = 'Failed to save file';
          }
        } else {
          $this -> msg = 'Please upload image with the following types: JPG, PNG, GIF';
        }
      } else {
        $this -> msg = 'Please upload image file';
      }
    } else {
      $this -> msg = $this -> codeToMessage($errorCode);
    }
  }

  private function setDst() {
    $this -> dst = 'images/' . date('YmdHis') . '.png';
  }

  private function crop($src, $dst, $data) {
    if (!empty($src) && !empty($dst) && !empty($data)) {
      switch ($this -> type) {
        case IMAGETYPE_GIF:
          $src_img = imagecreatefromgif($src);
          break;

        case IMAGETYPE_JPEG:
          $src_img = imagecreatefromjpeg($src);
          break;

        case IMAGETYPE_PNG:
          $src_img = imagecreatefrompng($src);
          break;
      }

      if (!$src_img) {
        $this -> msg = "Failed to read the image file";
        return;
      }
		
      $size = getimagesize($src);
      $size_w = $size[0]; // natural width
      $size_h = $size[1]; // natural height

      $src_img_w = $size_w;
      $src_img_h = $size_h;

      $degrees = $data -> rotate;

      // Rotate the source image
      if (is_numeric($degrees) && $degrees != 0) {
        // PHP's degrees is opposite to CSS's degrees
        $new_img = imagerotate( $src_img, -$degrees, imagecolorallocatealpha($src_img, 0, 0, 0, 127) );

        imagedestroy($src_img);
        $src_img = $new_img;

        $deg = abs($degrees) % 180;
        $arc = ($deg > 90 ? (180 - $deg) : $deg) * M_PI / 180;

        $src_img_w = $size_w * cos($arc) + $size_h * sin($arc);
        $src_img_h = $size_w * sin($arc) + $size_h * cos($arc);

        // Fix rotated image miss 1px issue when degrees < 0
        $src_img_w -= 1;
        $src_img_h -= 1;
      }

      $tmp_img_w = $data -> width;
      $tmp_img_h = $data -> height;
      $dst_img_w = $tmp_img_w;
      $dst_img_h = $tmp_img_h;

      $src_x = $data -> x;
      $src_y = $data -> y;

      if ($src_x <= -$tmp_img_w || $src_x > $src_img_w) {
        $src_x = $src_w = $dst_x = $dst_w = 0;
      } else if ($src_x <= 0) {
        $dst_x = -$src_x;
        $src_x = 0;
        $src_w = $dst_w = min($src_img_w, $tmp_img_w + $src_x);
      } else if ($src_x <= $src_img_w) {
        $dst_x = 0;
        $src_w = $dst_w = min($tmp_img_w, $src_img_w - $src_x);
      }

      if ($src_w <= 0 || $src_y <= -$tmp_img_h || $src_y > $src_img_h) {
        $src_y = $src_h = $dst_y = $dst_h = 0;
      } else if ($src_y <= 0) {
        $dst_y = -$src_y;
        $src_y = 0;
        $src_h = $dst_h = min($src_img_h, $tmp_img_h + $src_y);
      } else if ($src_y <= $src_img_h) {
        $dst_y = 0;
        $src_h = $dst_h = min($tmp_img_h, $src_img_h - $src_y);
      }

      // Scale to destination position and size
      $ratio = $tmp_img_w / $dst_img_w;
      $dst_x /= $ratio;
      $dst_y /= $ratio;
      $dst_w /= $ratio;
      $dst_h /= $ratio;

      $dst_img = imagecreatetruecolor($dst_img_w, $dst_img_h);

      // Add transparent background to destination image
      imagefill($dst_img, 0, 0, imagecolorallocatealpha($dst_img, 0, 0, 0, 127));
      imagesavealpha($dst_img, true);

      $result = imagecopyresampled($dst_img, $src_img, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);

      if ($result) {
        if (!imagepng($dst_img, $this->dst)) {
          $this -> msg = "Failed to save the cropped image file";
        }
      } else {
        $this -> msg = "Failed to crop the image file";
      }

      unlink($src);
      imagedestroy($src_img);
      imagedestroy($dst_img);
    }
  }

  private function codeToMessage($code) {
    $errors = array(
      UPLOAD_ERR_INI_SIZE =>'The uploaded file exceeds the upload_max_filesize directive in php.ini',
      UPLOAD_ERR_FORM_SIZE =>'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
      UPLOAD_ERR_PARTIAL =>'The uploaded file was only partially uploaded',
      UPLOAD_ERR_NO_FILE =>'No file was uploaded',
      UPLOAD_ERR_NO_TMP_DIR =>'Missing a temporary folder',
      UPLOAD_ERR_CANT_WRITE =>'Failed to write file to disk',
      UPLOAD_ERR_EXTENSION =>'File upload stopped by extension',
    );

    if (array_key_exists($code, $errors)) {
      return $errors[$code];
    }

    return 'Unknown upload error';
  }

  public function getResult() {
    return !empty($this -> data) ? $this -> dst : $this -> src;
  }

  public function getMsg() {
    return $this -> msg;
  }

  public function getImageInsertId() {
    return $this -> imageId;
  }

}

/*$crop = new CropAvatar(
  isset($_POST['avatar_src']) ? $_POST['avatar_src'] : null,
  isset($_POST['avatar_data']) ? $_POST['avatar_data'] : null,
  isset($_FILES['avatar_file']) ? $_FILES['avatar_file'] : null
);*/

/*$response = array(
  'state'  => 200,
  'message' => $crop -> getMsg(),
  'result' => $crop -> getResult()
);*/

//echo json_encode($response);
