<?php
/**
 * Created by JetBrains PhpStorm.
 * User: SFera
 * Date: 5/16/11
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 */

	define('FLIP_HORISONTALLY',						1);
	define('FLIP_VERTICALLY',						2);
	define('FLIP_BOTH',								3);

	function imageFlip ( $imgsrc, $mode )
	{
		if (!is_resource($imgsrc))
		{
			$ext = explode('.',$imgsrc);
			$ext = strtolower($ext[count($ext)-1]);
			switch($ext)
			{
				case 'png':
					$imgsrc = imagecreatefrompng($imgsrc);
					break;
				case 'jpg':
				case 'jpeg':
					$imgsrc = imagecreatefromjpeg($imgsrc);
					break;
				case 'bmp':
					$imgsrc = imagecreatefromwbmp($imgsrc);
					break;
				case 'gif':
					$imgsrc = imagecreatefromgif($imgsrc);
					break;
				default: return null;
			}
		}

		imagealphablending($imgsrc, false);
		imagesavealpha($imgsrc, true);

		$width		= imagesx ( $imgsrc );
		$height		= imagesy ( $imgsrc );

		$src_x		= 0;
		$src_y		= 0;
		$src_width	= $width;
		$src_height = $height;

		if ($mode & FLIP_HORISONTALLY)
		{
			$src_x		= $width -1;
			$src_width	= -$width;
		}
		if ($mode & FLIP_VERTICALLY)
		{
			$src_y		= $height -1;
			$src_height	= -$height;
		}

		$imgdest = imagecreatetruecolor ( $width, $height );
		imagealphablending($imgdest, false);
		imagesavealpha($imgdest, true);

		if ( imagecopyresampled ( $imgdest, $imgsrc, 0, 0, $src_x, $src_y , $width, $height, $src_width, $src_height ) )
		{
			return $imgdest;
		}
		return $imgsrc;
	}

	function make_left_name($name)
	{
		$name = explode('.',$name);
		//echo "{$name[0]}<br />";
		if (strpos($name[0],'_'))
		{
			$n = explode('_',$name[0]);
			//echo "has _ {$n[0]} + {$n[1]}<br />";
			return $n[0].'_left_'.$n[1].'.'.$name[1];
		}

		return $name[0].'_left'.'.'.$name[1];
	}

	function make_left_sprites($dir)
	{
		$root = dirname(__FILE__);
		$root = substr($root,0,stripos($root, 'tools'));
		echo "creating left pics for {$dir} <br />";
		if ($handle = opendir($root.'images\\'.$dir))
		{
		    echo "Directory handle: $handle<br/>";
		    echo "Files:<br/>";

		    while (false !== ($file = readdir($handle)))
		    {
		    	if (!strpos($file, '.'))
		    		continue;

				echo "{$file} to ".make_left_name($file).'<br />';
				imagepng(imageFlip('../images/'.$dir.'/'.$file, FLIP_HORISONTALLY),'../images/'.$dir.'/'.make_left_name($file));
			}
		}
	}


