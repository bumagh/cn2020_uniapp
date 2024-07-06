//时间戳转日期格式
function getDate(time, format="yyyy-MM-dd"){
  var t = new Date(time);
  var tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
      switch(a){
          case 'yyyy':
              return tf(t.getFullYear());
          case 'MM':
              return tf(t.getMonth() + 1);
          case 'mm':
              return tf(t.getMinutes());
          case 'dd':
              return tf(t.getDate());
          case 'HH':
              return tf(t.getHours());
          case 'ss':
              return tf(t.getSeconds());
      }
  })
}
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
function fetchData(url,data,method="POST"){
	let  auth = getApp().globalData.myAuth;
	let tag = getApp().globalData.accessTag;
	
	//console.log("fetchData=>auth=>",auth);
	
  return new Promise((resolve,reject)=>{
    uni.request({
      url: url,
      method,
	  dataType: 'json',
      header:{
        'Access-Tag': tag, 
		'Access-Token':auth.uid+'|'+auth.username+'|'+auth.v+'|'+auth.lvl,
		//'Access-Token':getApp().globalData.myAuth,
        'Content-Type':'application/json'
      },
      data,
      success:(res)=>{
        resolve(res)    //此处的res会交给then
      },
      fail:(err)=>{
        reject(err)  //此处的err会交给catch
      }
    })
  })
}

function post(url,data={}){
  return fetchData(url,data,'POST')
}

function get(url,data={}){
  return fetchData(url,data,'GET')
}

// 数组对象中根据某个字段升序排序
function compare(prop, order='+') {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return (order=='+') ? -1 : 1;
        } else if (val1 > val2) {
            return (order=='+') ? 1 : -1;
        } else {
            return 0;
        }            
    } 
}
/**
 * 排序数组或者对象
 * by Jinko
 * date --
 * @param object 数组或对象
 * @param subkey 需要排序的子键, 该参数可以是字符串, 也可以是一个数组
 * @param desc 排序方式, true:降序, false|undefined:升序
 * @returns {*} 返回排序后的数组或者对象
 *
 * 注意: 对于对象的排序, 如果使用console.log打印对象的显示可能和排序结果不一致,
 *  其键会被浏览器以字母顺序排序显示,但在for循环中则为正确的排序顺序
 */
/*
function sortObject(object, subkey, desc)
{
  var is_array = false;
  if(Object.prototype.toString.call(object) === '[object Array]') {
    is_array = true;
  }
  if(is_array) {
    var keys = {length:object.length};
  } else {
    if(typeof(Object.keys) == 'function') {
      var keys = Object.keys(object);
    } else{
      var keys = [];
      for(var key in keys) {
        keys.push(key);
      }
    }
  }
  for(var i=; i<keys.length; i++) {
    for(var j=i+; j<keys.length; j++) {
      if(is_array) {
        //数组排序
        if(Object.prototype.toString.call(subkey) === '[object Array]') {
          var vali = object[i];
          var valj = object[j];
          for(var si=; si<subkey.length; si++) {
            vali = vali[ subkey[si] ];
            valj = valj[ subkey[si] ];
          }
        } else {
          if((!subkey && subkey !== ) || subkey == '' && object.sort) {
            var vali = object[i];
            var valj = object[j];
          } else {
            var vali = object[i][subkey];
            var valj = object[j][subkey];
          }
        }
        if(desc) {
          if(valj > vali) {
            var tmp = object[i];
            object[i] = object[j];
            object[j] = tmp;
          }
        } else {
          if(valj < vali) {
            var tmp = object[i];
            object[i] = object[j];
            object[j] = tmp;
          }
        }
      } else {
        //对象排序
        var obi = object[ keys[i] ];
        var obj = object[ keys[j] ];
        if(Object.prototype.toString.call(subkey) === '[object Array]') {
          var vali = obi;
          var valj = obj;
          for(var si=; si<subkey.length; si++) {
            vali = vali[ subkey[si] ];
            valj = valj[ subkey[si] ];
          }
        } else {
          if((!subkey && subkey !== ) || subkey == '' && object.sort) {
            var vali = obi;
            var valj = obj;
          } else {
            var vali = obi[subkey];
            var valj = obj[subkey];
          }
        }
        if(desc) {
          if(valj > vali) {
            var tmp = keys[i];
            keys[i] = keys[j];
            keys[j] = tmp;
          }
        } else {
          if(valj < vali) {
            var tmp = keys[i];
            keys[i] = keys[j];
            keys[j] = tmp;
          }
        }
      }//is!array
    }
  }
  if(is_array) {
    return object;
  } else {
    var sorted = {};
    for(var i=; i<keys.length; i++) {
      sorted[ keys[i] ] = object[ keys[i] ];
    }
    return sorted;
  }
}*/
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

export {
	getDate,
	formatTime,
	formatLocation,
	dateUtils,
	compare,
	//sortObject,
	post,
	get
}
