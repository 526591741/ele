
var rlistObj = Object.create(searchObj);

rlistObj = $.extend(rlistObj,{
	name:'rlist',
	dom:$('#rlist'),
	init:function(){

		if(location.hash.split('-')[1]=='baidu'){
			 //console.log('baidu')
			this.type = 'baidu';
			this.loadBaidu();
			this.gun();
		}else{
			this.type = 'ele';
			this.loadRlist();
			this.banner();
			this.gun();
		}	
	},
	loadBaidu:function(page){
		var me = this;
		if(!page){  //初始
			page = 1;
			this.page = 1;
			$('.fjshop').html('');
			$('.sh-tip').html('正在加载...');
			$('.swiper-container').hide().next().show();
			$('#rlist-tit').css('background','#ff2e4b');
			
		}

		var bdhash = location.hash.split('-');
		var bdinfo = {
			lat:bdhash[2],
			lng:bdhash[3],
			name:decodeURI(bdhash[4]),
			address:decodeURI(bdhash[5])
		};
		//console.log(bdinfo.name);
		//console.log(bdinfo.address);
		$('.address').html(bdinfo.name)
		//console.log(page)
		$.ajax({
			url:'/mobile/waimai',
			data:{
				qt:'shoplist',
				address:bdinfo.address,
				lat:bdinfo.lat,
				lng:bdinfo.lng,
				page:page || 1,
				count:10,
				display:'json'
			},
			
			dataType:'json',
			success:function(res){
				var shangjia = (res.result.total-res.result.convenient_num) || 0 ;
				var cssj = res.result.convenient_num || 0 ;
				//console.log(shangjia)
				$('.sj').html('共'+ shangjia +'个商家');
				$('.cssj').html('共'+ cssj +'个商家');
				//console.log(res)
				var html = "";
				var Res = res.result.shop_info;
				
				for(var i = 0 ;i < Res.length;i++){
					//console.log(i)
					
					html += '<li><a><img src="'+Res[i].logo_url+'" class="shoplogo2"><div class="right"><div class="shop-name">'+ Res[i].shop_name+'</div><div class="recent">月销量'+Res[i].saled_month+'单</div><div><span class="s-pirce">￥'+Res[i].takeout_price+'起送 / '+ '配送费￥5' +'</span> <span class="min">  '+Res[i].delivery_time+'分钟</span></div></div></a></li>';
				}
				
				$('.fjshop').append(html);

				if(Res.length != 10){
					$('.sh-tip').html('已经加载完了');
				}
				me.isgun = true;
			},
			error:function(){
				console.log('后台出错了')
			}
			
		})
	},
	leave:function(){
		this.dom.hide();
		window.removeEventListener('scroll',this.gunFn);
	},
	banner:function(){
		//console.log($('.ban-wrap').html().indexOf('list'))
		if($('.ban-wrap').html().indexOf('list')!=-1){
			return;
		}
		$.ajax({
			url:'v2/index_entry',
			data:{
				geohash:location.hash.split('-')[1],
				group_type:1,
				flags:['T']
			},
			type:'get',
			success:function(res){
				$('.ban-wrap').html('');
				//console.log(res)
				var html1 = "";
				var html2 = "";
				for(var i = 0;i < res.length;i++){
					if(i<8){
						html1 += '<a class="list"><img src="http://fuss10.elemecdn.com'+ res[i].image_url +'" class="fl"><div class="ban-tx">'+res[i].title+'</div></a>'
					}else{
						html2 += '<a class="list"><img src="http://fuss10.elemecdn.com'+ res[i].image_url +'" class="fl"><div class="ban-tx">'+res[i].title+'</div></a>'
					}
				}
				$('.ban-wrap').eq(0).html(html1);
				$('.ban-wrap').eq(1).html(html2);

				var mySwiper = new Swiper('.swiper-container', {
				loop: true,
				autoplay: 5000,
				  pagination: '.swiper-pagination'
				})

			},
			error: function(res){
				console.log('我请求失败了');	 	
			}
		})
	 
	},

	gunFn:function(){
		var me = rlistObj;
		//console.log('我在滚');
	　	var scrollTop = $(window).scrollTop();   //当前高度
	　	var scrollHeight = $(document).height()-15;  //页面高度
	　	var windowHeight = $(window).height();   //浏览器高度
		//console.log(scrollHeight)
	　	if(scrollTop + windowHeight > scrollHeight&&me.isgun){
		//console.log(ok)
		me.isgun = false;
		if(me.type == 'ele'){
			me.start += 10;
			me.loadeleinfo(me.start);
		}else if(me.type == 'baidu'){
			me.page += 1;
			me.loadBaidu(me.page)
		}
	　}
	},
	gun:function(){ 
		 var me = this;
		 this.isgun = true;
		window.addEventListener('scroll', this.gunFn);
	},
	loadInfo:function(){   //读取地址的信息 ele
		var me = this;
		$.ajax({
			url: '/v1/pois/' + location.hash.split('-')[1],
			type: 'get',
			success: function(res){
				me.rinfo = {
					lat : res.latitude,
					lon : res.longitude,
					address : res.address
				}
				Store('ele',me.rinfo);
			$('.address').html(me.rinfo.address);
				me.loadeleinfo();
			}
		})
	},
	loadRlist:function(start){
		var me = this;
		this.list_num = 10;
		
		if(!start){  //初始
			start = 0;
			$('.fjshop').html('');
			$('.sh-tip').html('正在加载...');
			this.start = 0;
			$('.swiper-container').show().next().hide();
			$('#rlist-tit').css('background','#3190e8');

			if(Store('ele')){
				this.rinfo = Store('ele');
				$('.address').html(me.rinfo.address);
				this.loadeleinfo(start);
			}else if(location.hash.split('-')[1]){
				this.loadInfo();
			}else{
				window.location.href = '#search';
				return;
			}
			//console.log(me.rinfo)
		 //头部地址			
		}
		//console.log(start)
	
	},
	loadeleinfo:function(start){
		var me = this;
			$.ajax({
			url:'shopping/restaurants',
			data:{
				latitude:me.rinfo.lat,
				longitude:me.rinfo.lon,
				offset:start,
				limit:me.list_num,
				extras:['activities']
			},
			type:'get',
			success:function(res){
				//$('.sh-tip').show();
				//console.log(res)
				var html = "";
				for(var i in res){
					var src = res[i].image_path;
					var geshi = '.'+src.slice(32);

					src = '/'+src.slice(0,1)+'/'+src.slice(1,3)+'/'+src.slice(3)+geshi;
					
					var fen = res[i].rating;  //评分
					var pingfen = fen*20+'%'

					var shopname = res[i].name;
					if(res[i].is_premium){   //是不是品牌
						shopname = '<span class="pinpai">品牌</span>'+shopname;
					}
					var distance = res[i].distance;  //距离
					distance < 1000 ? distance = distance +'m' : distance = (distance/1000).toFixed(2) +'km';
					
					html += '<li><a href="#detail-'+ res[i].id + '-' + res[i].latitude + '-' + res[i].longitude + '"><img src="http://fuss10.elemecdn.com'+src+'" class="shoplogo"><div class="right"><div class="shop-name">'+ shopname+'</div><div class="recent"><div class="xing2"><i class="xing" style="width:' + pingfen + '"></i></div><span class="fen">'+fen+'</span>月销量'+res[i].recent_order_num+'单</div><div><span class="s-pirce">￥'+res[i].float_minimum_order_amount+'起送 / '+ res[i].piecewise_agent_fee.tips +'</span> <span class="min">' + res[i].order_lead_time +'分钟</span><span class="dis">'+ distance +'/</span></div></div></a></li>';	
				}
				 $('.fjshop').append(html);
				//console.log(me.PF);
				if(res.length < me.list_num){
					$('.sh-tip').html('已经加载完了');
					return;
				}
				 me.isgun = true;

			},
			error:function(){
				console.log('后台出错了');
			}
		})
	}
})


