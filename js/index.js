
var map = {
	'search':searchObj,
	'rlist':rlistObj,
	'detail':detailObj,
	'city':cityObj
}

//var isopen=false;
var last = null;
var now = null;


function Store(name, data){

	if(data) {  //存
		localStorage.setItem(name, JSON.stringify(data));
		return;
	}
	return JSON.parse(localStorage.getItem(name))	//取
}



var isInit = {
	search:false,
	city:false,
	detail:false
}

function Fn(hash){
	
	if(hash.split('-')){
		hash = hash.split('-')[0]
	}
	var moudle = map[hash] || map['search'] ;

	last = now;
	now = moudle;
	if(last){
		last.leave();
	}
	now.enter();
//console.log(now)
	if(hash.indexOf('search') != -1){
		if(!isInit.search){
			now.init();
			//console.log(1)
			isInit.search = true;
		}
	}else if(hash.indexOf('city') != -1){
		if(!isInit.city){
			now.init();
			isInit.city = true;
		}	
	}
	else if(hash.indexOf('detail') != -1){
		now.loadShopinfo();
		if(!isInit.detail){
			now.init();
			isInit.detail = true;
		}	
	}
	else{
		now.init();
		//console.log(2)
	}
}

if(location.hash){
	Fn(location.hash.slice(1));
}else{
	Fn('search');
}

window.onhashchange=function(){
	Fn(location.hash.slice(1));
}

/*	if(location.hash.indexOf('search') !== -1){
		if(location.hash.split('-')[1]){ 
			var cityID = location.hash.split('-')[1];
	
		
	//console.log(location.search.slice(1)) //ok
		     //通过id加载城市
	$('.city').html('正在加载城市..')
	
			$.ajax({
			url:'/v1/cities',
			data:{
				type:'group'
			},
			type:'get',
			success:function(res){
				for(var i in res){
					for(var j in res[i]){
						if(res[i][j].id==cityID){
							$('.city').html(res[i][j].name);
							return;
						}
					}
				}

			}
		})
			}
		}*/








