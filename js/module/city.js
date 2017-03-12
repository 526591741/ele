var cityObj = Object.create(searchObj);

cityObj = $.extend(cityObj,{
	name:'city',
	dom:$('#city'),
	init:function(){
		this.event();
		this.Baiducity();
	},
	Baiducity:function(){
		
		var me = this;
		$.ajax({
			url:'/waimai?qt=getcitylist&format=1&t=1483686354642',
			dataType:'json',
			success:function(res){
				//console.log(res);
				var arr = [];
				for(var i in res.result.city_list){
					arr = arr.concat(res.result.city_list[i]);
				}
				//console.log(arr)
				me.Bdcity = {};
				for(var i in arr){
					me.Bdcity[arr[i].name] = arr[i].code;
				}
				//console.log(me.Bdcity);	
				me.hotCity();
				me.allcity();
			}
		});
	},
	hotCity:function(){
		var me = this;
		//searchObj.event();
		$.ajax({
			url:'/v1/cities',
			data:{
				type:'hot'
			},
			type:'get',
			success:function(res){
				//console.log(res)
				var html = "";
				for(var i = 0 ; i < res.length;i++){
					html += '<a href="#search-'+res[i].id+'-'+ me.Bdcity[res[i].name] +'-'+ res[i].name +'">'+res[i].name+'</a>'; 
				}
				$('.hot').html(html);
			}

		});
	},
	allcity:function(){
		var me = this;
		$.ajax({
			url:'/v1/cities',
			data:{
				type:'group'
			},
			type:'get',
			success:function(res){
			var html = "";
			var arr=[];
			var zimu = "";
			for(var n in res){
				arr.push(n);
			}
			arr.sort();
			//console.log(arr)
				for(var i in arr){
					zimu += '<li>'+arr[i]+'</li>'
					html += '<div class="now-city"><div class="n-city" data-city="'+ arr[i] +'">'+arr[i]+'</div>';
					for(var j in res[arr[i]]){
						var name = res[arr[i]][j].name;
						var BdcityId = me.Bdcity[name] || 0;
						html += '<a href="#search-'+res[arr[i]][j].id+'-'+ BdcityId +'-'+ name +'">'+ name +'</a>';
					}
					html +='</div>';
		}
				$('#group').html(html);
				$('#zimu').html('<li>顶</li>' + zimu);
				$('.zm').css({top:($(window).height()-$('.zm').height())/2})
	
				window.cityScroll = new IScroll('#city-wrap', {
					scrollbars: false, //不显示滚动条
					preventDefault: false, 
					bounce: false 
				});
			}

		});
	},
	event:function(){
		$('#city-wrap').height($(window).height())

		$('.now-city,#group').on('click','a',function(){
			$('.city').html($(this).html());			
		});

	$('#zimu').on('click', 'li', function(event){
			var selector = '[data-city="'+ this.innerHTML +'"]';
			var curelem = $(selector)[0];
			//console.log(curelem)
			cityScroll.scrollToElement(curelem, 300);
		})	
	$('#city').on('touchmove',function(event){
		event.preventDefault();
	})
	$('.hot,#group').on('click','a',function(){
		//console.log(this.hash);
		Store('city',this.hash);

	})
	}
})





