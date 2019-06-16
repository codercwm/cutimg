<?php
/*图片上传代码略 下面直接进行图片裁剪*/
 
/**
 * [cut_img 图片裁剪函数]
 * Author: 程威明
 * @param  array $imgs          图片路径数组
 * @param  array $info          裁剪信息數組，包括裁剪后要保存的宽高、图片大小与裁剪开始坐标之比
 * @param  bool $cover          是否覆盖原图，默认不覆盖
 * @return array                若覆盖原图返回裁剪数量，不覆盖返回图片路径组成的数组
 */
function cut_img($imgs=array(),$infoarr=null,$cover=false)
{
    if($infoarr==null) return $imgs;
 
    //判断是否为数组（必须是一个以图片路径组成的数组）
    $imgs = is_array($imgs)?$imgs:array($imgs);
 
    //把多个裁剪信息切成单个信息组成的数组
    $infoarr = explode(',', $infoarr);
 
    $save_file = array();
 
    $i=0;
    foreach($imgs as $file){
 
        //如果不覆盖原图，可重新定义图片保存路径
        if(false==$cover){
            $file = $file;
        }
 
        //把裁剪信息切割成数组，第一个为要保存的宽第二个为要保存的高，第三和第四个为图片宽高与裁剪起点的比例
        $info = explode('#', $infoarr[$i]);
 
        //裁剪宽高比
        $ratio = $info[0]/$info[1];
 
        //判断图片是否存在
        if(!file_exists($file)) continue;
 
        //获取图片信息
        $imgize = getimagesize($file);
 
        //图片宽度
        $width = $imgize[0];
        //图片高度
        $height = $imgize[1];
 
        //图片裁剪起点坐标
        $x = $info[2]==0?0:$imgize[0]/$info[2];
        $y = $info[3]==0?0:$imgize[1]/$info[3];
 
        //判断图片原宽高比与裁剪宽高比的大小
        if($width/$height>=$ratio){
            $width = $height*$ratio;//如大于即为裁剪宽度
        }else{
            $height = $width/$ratio;//如小于即为裁剪高度
        }
 
        //裁剪的寬高不能超出圖片大小
        if(($width+$x)>$imgize[0]){
            $width = $width-($width+$x-$imgize[0]);
        }
 
        if(($height+$y)>$imgize[1]){
            $height = $height-($height+$y-$imgize[1]);
        }
 
        //创建源图的实例
        $src = imagecreatefromstring(file_get_contents($file));
 
        //創建一個圖像
        $new_image = imagecreatetruecolor($info[0], $info[1]);
 
        //分配颜色
        $color = imagecolorallocate($new_image,255,255,255);
        //定义为透明色
        imagecolortransparent($new_image,$color);
        //填充图片
        imagefill($new_image,0,0,$color);
 
        //拷贝图片并保存成指定大小
        imagecopyresized($new_image, $src, 0, 0, $x, $y, $info[0], $info[1], $width, $height);
 
        //保存
 
        if(false==$cover){
            $file = rtrim(dirname($file),'/').'/c_'.basename($file);
            $save_file[] = $file;
        }
 
        imagejpeg($new_image,$file);
 
        imagedestroy($new_image);
        imagedestroy($src);
 
        $i++;
    }
 
    if(false==$cover){
        return $save_file;
    }else{
        return $i;
    }
}

/**
 * [file_upload 文件上传函数，支持单文件，多文件]
 * Author: 程威明
 * @param  string $name         input表单中的name
 * @param  string $save_dir         文件保存路径，相对于当前目录
 * @param  array  $allow_suffix 允许上传的文件后缀
 * @return array                array() {
 *                                         ["status"]=> 全部上传成功为true，全部上传失败为false，部分成功为成功数量
 *                                         ["path"]=>array() {已成功的文件路径}
 *                                         ["error"]=>array() {失败信息}
 *                                      }
 */
function files_upload($name="photo",$save_dir="images",$allow_suffix=array('jpg','jpeg','gif','png'))
{
    //如果是单文件上传，改变数组结构
    if(!is_array($_FILES[$name]['name'])){
        $list = array();
        foreach($_FILES[$name] as $k=>$v){
            $list[$k] = array($v);
        }
        $_FILES[$name] = $list;
    }
 
    $response = array();
    $response['status'] = array();
    $response['path'] = array();
    $response['error'] = array();
 
    //拼接保存目录
    $save_dir = './'.trim(trim($save_dir,'.'),'/').'/';
 
    //判断保存目录是否存在
    if(!file_exists($save_dir))
    {
        //不存在则创建
        if(false==mkdir($save_dir,0777,true))
        {
            $response['status'] = false;
            $response['error'][] = '文件保存路径错误,路径 "'.$save_dir.'" 创建失败';
        }
    }
 
    $num = count($_FILES[$name]['tmp_name']);
 
    $success = 0;
 
    //循环处理上传
    for($i=0;$i <$num;$i++)
    {
        //判断是不是post上传
        if(!is_uploaded_file($_FILES[$name]['tmp_name'][$i]))
        {
            $response['error'][] = '非法上传，文件 "'.$_FILES[$name]['name'][$i].'" 不是post获得的';
            continue;
        }
 
        //判断错误
        if($_FILES[$name]['error'][$i]>0)
        {
            $response['error'][] = '文件 "'.$_FILES[$name]['name'][$i].'" 上传错误,error下标为 "'.$_FILES[$name]['error'][$i].'"';
            continue;
        }
 
        //获取文件后缀
        $suffix = ltrim(strrchr($_FILES[$name]['name'][$i],'.'),'.');
 
        //判断后缀是否是允许上传的格式
        if(!in_array($suffix,$allow_suffix))
        {
            $response['error'][] = '文件 "'.$_FILES[$name]['name'][$i].'" 为不允许上传的文件类型';
            continue;
        }
 
        //得到上传后文件名
        $new_file_name =date('ymdHis',time()).'_'.uniqid().'.'.$suffix;
 
        //拼接完整路径
        $new_path = $save_dir.$new_file_name;
 
        //上传文件 把tmp文件移动到保存目录中
        if(!move_uploaded_file($_FILES[$name]['tmp_name'][$i],$new_path))
        {
            $response['error'][] = '文件 "'.$_FILES[$name]['name'][$i].'" 从临时文件夹移动到保存目录时发送错误';
            continue;
        }
 
        //返回由图片文件路径组成的数组
        $response['path'][] =$save_dir.$new_file_name;
 
        $success++;
    }
 
    if(0==$success){
        $success = false;
    }elseif($success==$num){
        $success = true;
    }
 
    $response['status'] = $success;
 
    return $response;
}

$res = files_upload('img');
cut_img($res['path'],$_POST['imgCoord']);
echo '操作成功，请查看images文件夹';