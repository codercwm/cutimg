		function showCutImg(showImg){

			var showImg = $(showImg);

			var changeInput = showImg.parents('.showImgDiv').siblings('.CutImage');

			var size = changeInput.siblings('.imgCoord').attr('ratio').split('*');
			
			var needWidth = size[0];
			
			var needHeight = size[1];
			
			var ratio = parseInt(needWidth)/parseInt(needHeight);
			
			ratio = parseFloat(ratio.toFixed(2));
			
			var thisFullDiv = showImg.parent();

			var coordArr = changeInput.siblings('.imgCoord').val().split(',');
			
			thisCutImgWidth = showImg.width();
			thisCutImgHeight = showImg.height()
	
			thisFullDiv.css('width',thisCutImgWidth);
			thisFullDiv.css('height',thisCutImgHeight);
				
			if((thisCutImgWidth/thisCutImgHeight)>=ratio){
				var thisCutDivHeight = thisCutImgHeight;
				var thisCutDivWidth = thisCutDivHeight*ratio;
			}else{
				var thisCutDivWidth = thisCutImgWidth;
				var thisCutDivHeight = thisCutDivWidth/ratio;
			}
				
			var hideWidth = (thisFullDiv.width()-thisCutDivWidth)/2;
				
			showImg.siblings('.hideImgLeft').width(hideWidth);
			showImg.siblings('.hideImgRight').width(hideWidth);
				
			var hideHeight = (thisFullDiv.height()-thisCutDivHeight)/2;
				
			showImg.siblings('.hideImgTop').width(thisCutDivWidth);
			showImg.siblings('.hideImgBottom').width(thisCutDivWidth);
				
			showImg.siblings('.hideImgTop').height(hideHeight);
			showImg.siblings('.hideImgBottom').height(hideHeight);

			if(hideWidth>0){
				var cutRatioX = thisCutImgWidth/hideWidth;
			}else{
				var cutRatioX = 0
			}
				
			if(hideHeight>0){
				var cutRatioY = thisCutImgHeight/hideHeight;
			}else{
				var cutRatioY = 0;
			}
		
			var coord = needWidth+'#'+needHeight+'#'+(cutRatioX)+'#'+(cutRatioY);

			if(coordArr!=''){
				coordArr.push(coord);
			}else{
				coordArr = [coord];
			}
			
			changeInput.siblings('.imgCoord').val(coordArr);
			$('.fullDiv').on('mousedown',function(e){
				var me = $(this);
				
				var changeInput = me.parent().siblings('.CutImage');

				var index = me.attr('index');
				
				var oldx = e.pageX;
				var oldy = e.pageY;
				
				var imgleft = me.children('.cutImg').position().left;
				var imgtop = me.children('.cutImg').position().top;
				
				var maxw = me.children('.hideImgLeft').width();
				var maxh = me.children('.hideImgTop').height();
				
				var goordArr = changeInput.siblings('.imgCoord').val().split(',');
				
				var cutDivSize = goordArr[index].split('#');
				
				$(document).mousemove(function(e){
					var newx = e.pageX;
					var newy = e.pageY;
					
					var movex = newx - oldx;
					var movey = newy - oldy;
					
					var x = movex + imgleft;
					var y = movey + imgtop;
					
					if(Math.abs(x)>maxw){
						if(x>0) x = maxw;
						if(x<0) x = -maxw;
					}
					
					if(Math.abs(y)>maxh){
						if(y>0) y = maxh;
						if(y<0) y = -maxh;
					}
						
					me.children('.cutImg').css('left',x+'px');
					me.children('.cutImg').css('top',y+'px');
					
					if(parseInt(maxw - x)>0){
						var cutRatioX = me.children('.cutImg').width()/parseInt(maxw - x);
					}else{
						var cutRatioX = 0;
					}
					
					if(parseInt(maxh - y)>0){
						var cutRatioY = me.children('.cutImg').height()/parseInt(maxh - y)
					}else{
						var cutRatioY = 0;
					}
					
					var cutImgPo = (cutRatioX) +'#'+ (cutRatioY);
					
					var coordVal = cutDivSize[0]+'#'+cutDivSize[1]+'#'+cutImgPo;
					
					goordArr[index] = coordVal;
					
					changeInput.siblings('.imgCoord').val(goordArr);
					
					
				});
			});
			
			
			$(document).on('mouseup',function(e){
				$(document).unbind('mousemove');
			});
		}
		
		
		

		$(".CutImage").change(function(){
			
			$(this).siblings('.imgCoord').val('');
			
			if($(this).prop('multiple')!=true){		//判断是否多文件上传
				var objUrl = getObjectURL1(this.files[0]) ;

	  			if (objUrl) {
	  					html = '';
	  					html += '<div style="border:1px solid #000;position:relative;z-index:2;overflow:hidden;cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;" index="0" class="fullDiv">';
						html += '<div style="position:absolute;background:#ccc;top:0;z-index:4;opacity:0.95;left:0;right:0;margin:auto;" class="hideImgTop"></div>';
						html += '<div style="position:absolute;background:#ccc;bottom:0;z-index:4;opacity:0.95;left:0;right:0;margin:auto;" class="hideImgBottom"></div>';
						html += '<div style="position:absolute;height:100%;background:#ccc;left:0;z-index:4;opacity:0.95;" class="hideImgLeft"></div><div style="position:absolute;z-index:3;left:0;right:0;top:0;bottom:0;margin:auto;" class="cutDiv"></div>';
						html += '<div style="position:absolute;height:100%;background:#ccc;right:0;z-index:4;opacity:0.95;" class="hideImgRight"></div>';
						html += '<img style="position:absolute;z-index:1;width:150px" onload="showCutImg(this)" class="cutImg" class="imgshover" src="'+objUrl+'" alt="图片加载失败" />';
						html += '</div>';										//修改img标签的width样式可改变预览图大小
	  					
						$(this).siblings('.showImgDiv').html(html);
	  			}

			}else{
				var objUrl = getObjectURL2($(this).get(0).files);
	  			if (objUrl) {
	  				
	  				var html = '';
	  				for(var i=0;i<objUrl.length;i++)
	  				{
	  					html += '<div style="margin-bottom:5px;border:1px solid #000;position:relative;z-index:2;overflow:hidden;cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;" index="'+i+'" class="fullDiv">';
						html += '<div style="position:absolute;background:#ccc;top:0;z-index:4;opacity:0.95;left:0;right:0;margin:auto;" class="hideImgTop"></div>';
						html += '<div style="position:absolute;background:#ccc;bottom:0;z-index:4;opacity:0.95;left:0;right:0;margin:auto;" class="hideImgBottom"></div>';
						html += '<div style="position:absolute;height:100%;background:#ccc;left:0;z-index:4;opacity:0.95;" class="hideImgLeft"></div><div style="position:absolute;z-index:3;left:0;right:0;top:0;bottom:0;margin:auto;" class="cutDiv"></div>';
						html += '<div style="position:absolute;height:100%;background:#ccc;right:0;z-index:4;opacity:0.95;" class="hideImgRight"></div>';
						html += '<img style="position:absolute;z-index:1;width:150px" onload="showCutImg(this)" class="cutImg" class="imgshover" src="'+objUrl[i]+'" alt="图片加载失败" />';
						html += '</div>';										//修改img标签的width样式可改变预览图大小
	  					
	  				}
	  				
	  				$(this).siblings('.showImgDiv').html(html);
	  		  
	  			}
	  			
	  			//$('.fullDiv').css('float','left');
			}
			
  			
  		}) ;

  		//建立一個可存取到該file的url
  		function getObjectURL1(file) {
  			var url = null ; 
  			if (window.createObjectURL!=undefined) { // basic
  				url = window.createObjectURL(file) ;
  			} else if (window.URL!=undefined) { // mozilla(firefox)
  				url = window.URL.createObjectURL(file) ;
  			} else if (window.webkitURL!=undefined) { // webkit or chrome
  				url = window.webkitURL.createObjectURL(file) ;
  			}
  			return url ;
  		}

  		//建立一個可存取到該file的url
  		function getObjectURL2(file) {
  			var url = new Array(); 
  			if (window.createObjectURL!=undefined) { // basic
  				for(var i=0;i<file.length;i++)
  				{
  					url[i] = window.createObjectURL(file[i]) ;
  				}
  			} else if (window.URL!=undefined) { // mozilla(firefox)
  				for(var i=0;i<file.length;i++)
  				{
  					url[i] = window.URL.createObjectURL(file[i]) ;
  				}
  			} else if (window.webkitURL!=undefined) { // webkit or chrome
  				for(var i=0;i<file.length;i++)
  				{
  					url[i] = window.webkitURL.createObjectURL(file[i]) ;
  				}
  			}
  			return url ;
  		}