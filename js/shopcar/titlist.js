

// 商品标题列表


function TitList(obj,num){
	this.name = obj.name;
	this.icon_url = obj.icon_url;
	this.id = obj.id;
	//console.log(num);
	this.num = num || 0;
	this.selector = '[dada-listid="'+this.id+'"]';
}

TitList.prototype.loadtit=function(){

	if(this.icon_url){
		var img = '<img class="list-img" src="'+detailObj.imgURL(this.icon_url)+'">'
	}else{
		var img = "";
	}
	var str = '<li dada-listid="'+this.id+'">'+ img +'<span class="list-name">'+ this.name +'</span>' +'<div class="food-n">'+this.num+'</div></li>';

	return str;
}

TitList.prototype.add = function(){
	//console.log(1)
	this.num++;
	this.changeNum();
}

TitList.prototype.minus = function(){
	this.num--;
	this.changeNum();
}

TitList.prototype.changeNum = function(){

	//console.log($(this.selector)[0])
	//console.log(this.id)

	$(this.selector).find('.food-n').html(this.num);

	if(this.num == 0){
		$(this.selector).find('.food-n').hide();
	}else{
		$(this.selector).find('.food-n').show();
	}

	//detailObj.carSum();

}