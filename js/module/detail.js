
var detailObj = Object.create(searchObj);

detailObj = $.extend(detailObj,{
	name:'detail',
	dom:$('#detail'),
	init:function(){
		this.event();
		//this.loadShopinfo();
		Shopcar.init();
		this.isAdd = true;

	},
	loadStore:function(){
		this.Store = Store(this.id);
		//console.log(this.id)
		if(this.Store){
			$('.car-main').html('');
			this.Car = this.Store[0];
			var list = this.Store[1];
			//console.log(Car)
			for(var i in this.Car){
				var carObj = this.cartMap[this.Car[i].food_id];
				//console.log(carObj)
				Shopcar.addCart(carObj);
				$(this.Car[i].selector).find('.jn').show();
			}
			for(var i in list){
				var listobj = list[i];
				if(listobj.num>0){
					$(listobj.selector).find('.food-n').html(listobj.num).show();
				}

			}
			this.carSum();
			
		}else{ 
			this.Car={};
			$('.car-main').html('');
			this.carSum();
		}
	},
	event:function(){
		var me = this;

		$('.main-right').on('click','.add',function(e){  //加购物车
			//console.log(e.clientX,e.clientY)			
			if(!me.isAdd)return;	//动画效果
			me.isAdd = false;		
			me.addqiu(e);
			
			var Foodid = $(this).closest('dd').data('foodid');
			var CartObj = me.cartMap[Foodid];
			CartObj.add();
			
			if(!me.Car[Foodid]){  //如果没被选中过
				Shopcar.addCart(CartObj);
			}
			me.Car[Foodid] = CartObj;

			//var listid = $(this).closest('dd').data('listid');

			var listid = me.foodidMap[Foodid];

			me.List[listid].add();
			me.carSum();
			return false;
		});

		$('.main-right').on('click','.jian',function(){  //减
			var Foodid = $(this).closest('dd').data('foodid');
			var CartObj = me.cartMap[Foodid];
			CartObj.jian();
			if(CartObj.num == 0){
				Shopcar.delete(CartObj);
			}
			me.carSum();
			var listid = me.foodidMap[Foodid]
			me.List[listid].minus();
			return false;
		});
		$('.shopcar-img').on('click',function(){   //点击购物车
			if(!me.openCar)return;
			$('.shopinfo').toggle();
	/*		$('.car-wrap').css('bottom',-$('.car-wrap').height())
			setTimeout(function(){
				$('.car-wrap')[0].classList.toggle('move');
			},30)*/
			
		})

		$('.main-left').on('click','li',function(event){
				//console.log(this)
			$(this).addClass('food-active');
			$(this).siblings().removeClass('food-active');
			var selector = '[data-tit="'+ $(this).find('.list-name').text() +'"]';
			var curelem = $(selector)[0];
			//console.log(curelem)
			rightScroll.scrollToElement(curelem, 300);
		});

		$('#detail').on('touchmove',function(event){
			event.preventDefault();
		});

/*		$('.main-right,.main-left').on('touchend',function(event){
			event.preventDefault();
		});*/

		$('.shop-tab').on('click',function(){
			$(this).addClass('shopnav-active').siblings().removeClass('shopnav-active');
			if($(this).index()==0){
				$('.main').show().next().hide();
				$('.shopcar').show();

			}else{
				$('.main').hide().next().show();
				$('.shopcar').hide();

			}
		})

	},
	loadInfo:function(){
		$('#de-head').html('');
		$('.icon-wrap').html('');
		$('.food-nav').html('');
		var hash = location.hash;
		this.id = hash.split('-')[1];
		this.lat = hash.split('-')[2];
		this.lng = hash.split('-')[3];
		this.loadHeaderInfo();  //加载头部信息
		this.loadMainInfo();		//加载主要信息
		$('#detail').height($(window).height());
	},
	imgURL:function(url){
		var src = url;
		var geshi = '.'+src.slice(32);
		return src = 'http://fuss10.elemecdn.com//'+src.slice(0,1)+'/'+src.slice(1,3)+'/'+src.slice(3)+geshi;
	},
	loadHeaderInfo:function(){   //加载头部 和商家信息
		var me = this;
		$.ajax({
			url: '/shopping/restaurant/' + this.id,
			data: {
				extras: ['activities', 'album', 'license', 'statistics','identification'],
				latitude:this.lat,
				longitude:this.lng
			},
			success:function(res){
				//$('#de-head').html('');
				//console.log(res);
				var info = "";
				if(res.activities[0]){
					info = '<div class="shop-icon"><b class="icon" style="background:#'+res.activities[0].icon_color+'">'+res.activities[0].icon_name+'</b><span class="ic-tx">'+res.activities[0].description+'</span></div>'
				}
				me.pay = res.float_minimum_order_amount; //起送价
				var shopTip =  res.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
				//'+res.activities[0].description+'

				var html = '<div class="background"></div><div class="head-main"><img class="shop-logo" src="'+me.imgURL(res.image_path)+'"><div class="head-tx"><h3>'+res.name+'</h3><div class="h-tx">'+res.piecewise_agent_fee.description+' / '+res.order_lead_time+'分钟送达 / ￥<span class="qisong">' + me.pay + '</span>起送</div><div class="shop-tip">'+info+'</div></div></div><div class="info-tip"><span class="gonggao">公告</span>' + shopTip + '</div>';
				//console.log(res.delivery_mode.color)
         		$('#de-head').html(html);

         		$('.background').css({'background-image':'url('+me.imgURL(res.image_path)+'?imageMogr/quality/80/format/webp/thumbnail/!40p/blur/50x40/)'})

         		$('.post').html(res.piecewise_agent_fee.tips); //配送费
         		if(me.pay>0){  //起送价
         			$('.pay').html('还差￥'+me.pay+'起送')
         		}

         		me.loadShopIcon(res);
 
			}	
		});
	},
	loadShopIcon:function(res){
		var info1;
		res.activities[0] ?  info1 = res.activities :  info1 = "";
		//console.log(info1);
		var html = "";
		for(var i in res.activities){
			html += '<div class="shop-icon"><b class="icon" style="background:#'+res.activities[i].icon_color+'">'+res.activities[i].icon_name+'</b><span class="ic-tx">'+res.activities[i].description+'</span></div>'
		}
		for(var i in res.supports){
			html += '<div class="shop-icon"><b class="icon" style="background:#'+res.supports[i].icon_color+'">'+res.supports[i].icon_name+'</b><span class="ic-tx">'+res.supports[i].description+'</span></div>'
		}
		$('.icon-wrap').html(html);

	/*	window.iconScroll = new IScroll('.shop-info', {
			scrollbars: true, 
			preventDefault: false, 
			bounce: false 
		});
*/


	},
	loadMainInfo: function(){   //加载商品
		var me = this;
		$.ajax({
			url: '/shopping/v2/menu?restaurant_id=' + this.id,
			success: function(res){
				//console.log(res);
				me.shopInfo = res;
				me.mainLeft(res);   
				//me.mainRight(res);
			},
			error: function(){
				console.log('请求失败');
			}
		})	 	
	},
	mainLeft:function(res){   //加载左列表

		
		var str = "";
		for(var i = 0; i < res.length; i++) {

			if(Store(this.id)){
				var listid = res[i].id;
				//console.log(Store(this.id)[1][listid])
				if(Store(this.id)[1][listid]){

					var num = Store(this.id)[1][listid].num;
				}
			}

			var titlist = new TitList(res[i],num);

			str += titlist.loadtit();

			if(res[i].id!=null){
				this.List[res[i].id] = titlist;

			}
		//	console.log(this.List)
		}
		str += '<div class="h"></div>'
		$('.food-nav').html(str).find('li').eq(0).addClass('food-active').siblings().removeClass('food-active');;

		this.mainRight(res);  //加载食物详情

	},
	cartMap:{
		//id与食物信息的映射关系
	},
	Car:{
		//购物车里的东西
	},
	List:{
		//商品id与其内容映射
	},
	foodidMap:{
		// food-id : list-id
	},
	mainRight:function(res){
		this.Store = Store(this.id)
		//console.log(this.Store)
		var me = this;
		var html = "";
		var cart = null;
		for(var i in res){
			html += '<dl class="food-info"><dt class="food-tit" data-tit="' + res[i].name + '">' +  res[i].name + '<span class="tit-tip">'+ res[i].description +'</span></dt>';
			var listId = res[i].id
			for(var j in res[i].foods){

				var foodid = res[i].foods[j].specfoods[0].food_id;
				if(this.Store){
					if(this.Store[0][foodid]){
						//console.log(1)
						res[i].foods[j].num = this.Store[0][foodid].num;
					}
				}
				var food = new Foodlist(res[i].foods[j]);

					//console.log(res[i].foods[j].image_path)
				this.cartMap[food.food_id] = food;
				this.foodidMap[food.food_id] = listId;
				//console.log(this.foodidMap)
				html += food.loadfood();

			}
			html += '</dl>';
		}
		html += '<div class="h"></div>'
		$('.info-wrap').html(html);

		me.loadStore();  // 加载缓存里的数据

		window.leftScroll = new IScroll('.main-left', {
			scrollbars: false, 
			preventDefault: false, 
			bounce: false 
		});
		window.rightScroll = new IScroll('.main-right', {
			scrollbars: false,
			probeType: 2,
			preventDefault: false, 
			bounce: false
		});

		this.listHeight = [];
		var me = this;
		var sum = 0;

/*		$('.food-info').each(function(index,elem){
		  console.log($(elem))
		  sum += $(elem).height();
		  console.log($(elem).height())
		  me.listHeight.push(sum);
		})*/

		for(var i = 0;i < $('.food-info').length;i++){
			sum += $('.food-info').eq(i).height();
			me.listHeight.push(sum)
		}

		//console.log(me.listHeight)
		rightScroll.on('scroll',function(event){
			//console.log(rightScroll.y)
			for(var i = 0;i < me.listHeight.length; i++){
				if(Math.abs(rightScroll.y) <= me.listHeight[i]){
					//console.log(i)
					$('.main-left li').removeClass('food-active').eq(i).addClass('food-active');
					break;
				}
			}
		});

	},
	
	addqiu:function(e){
		var me = this;
		$('.shopcar-img').removeClass('dong');
		//clearTimeout(this.time);
		$('#detail').append('<div class="qiu"></div>');		
		$('.qiu').css({left:e.clientX-10,top:e.clientY});		
		this.time = setTimeout(function(){
			$('.qiu:last-child').hide().remove();
			$('.shopcar-img').addClass('dong');
			me.isAdd = true;
		},450)

	},
	carSum:function(){   //改变购物车的状态
		var sum = 0;
		var allpirce = 0;
		for(var i in this.Car){
			sum += this.Car[i].num;
			allpirce += this.Car[i].num*this.Car[i].pirce;
		}
		//console.log(sum)

		$('.foodnum').html(sum);
		$('.z-pirce').html(allpirce.toFixed(1));
		//console.log(this.pay-allpirce)
		if(sum>0){
			$('.foodnum').show();
			$('.shopcar-img').removeClass('ancar').addClass('lancar');
			this.openCar = true;
		}else{
			$('.foodnum').hide();
			$('.shopcar-img').addClass('ancar').removeClass('lancar');
			this.openCar = false;
		}
		if(this.pay>0){
			if(this.pay > allpirce){
				$('.pay').html('还差￥'+(this.pay-allpirce).toFixed(1)+'元起送');
				$('.pay').css('background','#535356');
			}else{
				$('.pay').html('去结算');
				$('.pay').css('background','#4cd964');
			}
		}else{
			if(allpirce>0){
				$('.pay').css('background','#4cd964');
			}else{
				$('.pay').css('background','#535356');
			}
		}

		//console.log(this.Car);

		Store(this.id,[this.Car,this.List]); //存进本地缓存

		return sum;
	},
	loadShopinfo:function(){
		this.cartMap={};
		var shopId = location.hash.split('-')[1];
		this.loadShopinfoTop(shopId);
		this.loadShoppl(shopId);
	},
	loadShopinfoTop:function(id){
		$.ajax({
			url:'/ugc/v2/restaurants/'+id+'/ratings/scores',
			type:'get',
			success:function(res){
				//console.log(res);
				var pingfen = res.overall_score.toFixed(1);
				var rating = (res.compare_rating*100).toFixed(1);

				$('.food-score').html(pingfen+'分');
				$('.rating').html(rating+'%');
				$('.pl').html('共'+res.order_rating_amount+'条评论');
			}
		})
	},
	loadShoppl:function(id){
		var me = this;
		$.ajax({
			url:'/ugc/v2/restaurants/'+id+'/ratings/tags',
			type:'get',
			success:function(res){
				//console.log(res);
				var html = "";
				for(var i in res){
					html += '<li>'+res[i].name+'('+res[i].count+')'+'</li>'
				}
				$('.tags').html(html);

				me.loadInfo();
			}
		})
	}

})




