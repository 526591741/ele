

function car(){
	var name = '购物车';
	var $dom = $('.shopinfo');
	var $list = $('.car-main');
	var $clear = $('.del-car');
	function init(){
		bindEvent();

	}
	function bindEvent(){
		$dom.on('click','.hei',function(){
			toggle();
		})
		$dom.on('click','.add',function(){
			var foodid = $(this).closest('.foodlist').data('foodid');
			var CartObj = detailObj.cartMap[foodid];
			CartObj.add();
			detailObj.Car[foodid] = CartObj;
			detailObj.carSum();

			var listid = detailObj.foodidMap[foodid]
			detailObj.List[listid].add();
		})

		$dom.on('click','.jian',function(){
			var foodid = $(this).closest('.foodlist').data('foodid');
			var CartObj = detailObj.cartMap[foodid];
			CartObj.jian();
			detailObj.Car[foodid] = CartObj;

			var listid = detailObj.foodidMap[foodid]
			detailObj.List[listid].minus();

			//detailObj.carSum();
			if(CartObj.num == 0){
				deleteCart(CartObj);
			}
			if(detailObj.carSum() == 0){
				toggle();
			}
		})

		$clear.on('click',function(){
			removeall();
		})
	}

	function removeall(){
		toggle();
		for(var i in detailObj.Car){
			var curObj = detailObj.Car[i];
			var foodid = curObj.food_id;
			detailObj.Car[i].num = 0;
			$(curObj.selector).find('.jn').hide();
			deleteCart(detailObj.Car[i]);
		}
		for(var i in detailObj.List){
			detailObj.List[i].num = 0;
			$('.food-n').hide()
		}
		detailObj.carSum();
	}


	function deleteCart(obj){
		$list.find(obj.selector).remove();
		delete detailObj.Car[obj.food_id];
	}

	function toggle(){
		$dom.toggle();
	}

	function addCart(obj){
		var str = obj.loadcar();
		$list.append(str)
	}


	return {
		name:name,
		init:init,
	//	del:del,
		togele:toggle,
		addCart:addCart,
		delete: deleteCart

	}
}

var Shopcar = car();


