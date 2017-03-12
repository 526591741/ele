
var searchObj = {
	name:'search',
	dom:$('#search'),
	init:function(){
		this.event();
		this.changeCity();		
	},
	changeCity: function(){

		if(Store('city')){
			//console.log(1)
			location.hash = Store('city');
		}
		var cityname = location.hash.split('-')[3] || '上海';
		cityname = decodeURI(cityname);
		$('.city').html(cityname);
	},
	event:function(){

		//console.log(1);
		$('#btn').on('click',function(){  //饿了么？
			//console.log(1)
			var word = $('#in1').val()
			if(word){
			//if(location.hash.split('-')[1]){ 
				var cityID = location.hash.split('-')[1] || 1;
			//}
			//console.log(1)
			$.ajax({
				url:'/v1/pois',
				data:{
					city_id:cityID,
					keyword:$('#in1').val(),
					type:'search'
				},
				type:'get',
				success:function(res){
					//console.log(res)
					var html = "";
					for(var i = 0;i < res.length;i++){
						html += '<a class="ele" data-geo="'+res[i].geohash+'" data-lon="'+ res[i].longitude +'" data-lat="'+ res[i].latitude +'" data-address="'+ res[i].address +'" href="#rlist">'+res[i].name+'<div class="x-address">'+res[i].address+'</div></a>';
					}
					$('#tx').html(html);
				},
				error: function(res){
					console.log('我请求失败了');	 	
				}

			})
			}

		}); 
			$('#tx').on('click','.ele',function(e){  //饿了么 跳转列表页
				//console.log(1);
				e.preventDefault();
				var rInfo = {
					lat:this.dataset.lat,
					lon:this.dataset.lon,
					address:this.dataset.address
				}
				Store('ele',rInfo);
				//console.log(Store('ele'))
				location.href = '#rlist-'+this.dataset.geo;	
			});

			$('#bd').click(function(event){  //百度外卖
			var word = $("#in1").val();
			//console.log(location.hash.split('-'));
			var BdcityID = location.hash.split('-')[2] || 289;

				if(word){
					if(BdcityID == '0'){
						$("#tx").html('百度外卖暂不支持此城市')
					}else{
				$.ajax({
					url: '/waimai?',
					dataType: 'json',
					data: {
						qt:'poisearch',
						tn:'B_NORMAL_MAP',
						oue:1,
						wd: word,
						display:'json',
						cb:'suggestion_1483600579740',
						c:BdcityID ,
						ie:'utf-8',
						res:1
					},
					success: function(res){
						//console.log(res)
						var html = "";
						for(var i =0; i < res.result.content.length; i++) {
							html += '<a href="#rlist-baidu-'+res.result.content[i].latitude+'-'+res.result.content[i].longitude+'-'+ encodeURI(res.result.content[i].name) + '-' + encodeURI(res.result.content[i].address) +'">'+ res.result.content[i].name +'<div class="x-address">'+res.result.content[i].address+'</div></a>'
						}	
						$("#tx").html(html);	 	
					},
					error: function(res){
						console.log('我请求失败了');	 	
					}
				})
			}
			}	 	
		});

	},
	enter:function(){
		this.dom.show();
	},
	leave:function(){
		this.dom.hide();
	}
}
