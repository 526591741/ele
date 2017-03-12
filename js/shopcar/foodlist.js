

function Foodlist(obj){
	this.name = obj.name;
	this.num = obj.num || 0 ;
	this.pirce = obj.specfoods[0].price;
	this.original_price = obj.specfoods[0].original_price || null;
	this.food_id = obj.specfoods[0].food_id ;
	this.image_path = obj.image_path;
	this.specfoods = obj.specfoods;
	this.description = obj.description;
	this.tips = obj.tips;
	this.selector = '[data-foodid="'+ this.food_id +'"]';
}

Foodlist.prototype.add = function(){
	this.num++;
	this.changeNum();
}

Foodlist.prototype.jian = function(){
	this.num--;
	this.changeNum();
}

Foodlist.prototype.changeNum = function(){

	$(this.selector).find('.food-num').html(this.num);

	if(this.num == 0){
		$(this.selector).find('.jn').hide();

	}else{
		$(this.selector).find('.jn').show();
	}
}

Foodlist.prototype.loadfood=function(){
	var html = '';

	if(this.image_path){
		var src = detailObj.imgURL(this.image_path)
	}else{
		var src = 'img/a.jpeg';
	}
	var original_price = "";
	if(this.original_price){
		original_price = '<del class="yj">￥'+this.original_price+'</del>';
	}

	html += '<dd data-foodid="'+ this.food_id +'"><div class="food-imgwrap"><img class="food-img" src="'+ src +'"></div><div class="info-tx"><div class="food-name">'+this.name+'</div><div class="food-xl small">'+this.description+'</div><div class="food-xl">'+this.tips+'</div><div class="food-pirce">￥<b class="apirce">'+this.specfoods[0].price+'</b>'+original_price+'<b class="add">+</b><span class="jn"><span class="food-num">'+this.num+'</span><b class="jian">-</b></span></div></div></dd>';
	return html;
}


Foodlist.prototype.loadcar=function(){
	var str = '<div class="foodlist" data-foodid="'+ this.food_id +'"><span class="carfood">'+this.name+'</span><span class="food-pirce">￥'+this.pirce+'</span><b class="add">+</b><span class="jn"><span class="food-num">'+this.num+'</span><b class="jian">-</b></span></div>'
			return str;
}



