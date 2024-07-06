<template>
	<view>
		<view class="content">
			<view class="ey-base" :style="'max-height:'+page.height+'px;height:'+page.height+'px;'" v-if="menu.current === 0">
				<uni-row v-for="(item,index) in baseModules" :key="index">
					<uni-col :span="6">
						<uni-badge style="margin-left:10px;margin-top:10px;" :text="'等级:'+((item.lvl) ? item.lvl : 0)" absolute="rightBottom" :offset="[32, 15]">
							<image class="btn-image" :src="'/static/game/'+item.avatar"></image>
						</uni-badge>
					</uni-col>
					<uni-col :span="8">
						<uni-rate style="margin-top:30px;" :readonly="true" :value="(item.lvl) ? item.lvl : 0" />
					</uni-col>
					<uni-col :span="5">
						<view  @click="setModuleUpgradeSure(item)" style="position:relative;margin-top:10px;">
							<image class="btn-image" src="/static/game/btn-make.png"></image>
							<text class="btn-text">升级</text>
						</view>
					</uni-col>
					<uni-col :span="5">
						<view  @click="setModuleMakeSure(item)" style="position:relative;margin-top:10px;">
							<image class="btn-image" src="/static/game/btn-make.png"></image>
							<text class="btn-text">制造</text>
						</view>
					</uni-col>
				</uni-row>
				<uni-row style="margin-top:10px;">
					<uni-col :span="5">&nbsp;</uni-col>
					<uni-col :span="8"><uni-tag style="font-size:16px" :mark="true" :text="'金币:'+myPocket.coin" type="warning" size="default" /></uni-col>
					<uni-col :span="11"><uni-tag style="font-size:16px" :mark="true" :text="'资源:'+myPocket.res" type="warning" size="default" /></uni-col>
				</uni-row>
			</view>
			<view class="ey-conf" :style="'max-height:'+page.height+'px;height:'+page.height+'px;'" v-if="(menu.current === 1) || (menu.current === 2)">
				<swiper :disable-touch="true" :indicator-dots="true" :current="swiperIndex" :style="'max-height:'+page.height+'px;height:'+page.height+'px;'" >
					<swiper-item>
						<uni-title align="center" type="h2" title="AI战斗模块" color="#fff"></uni-title>
						<uni-grid :column="4" :show-border="false" :square="true" :highlight="false">
							<uni-grid-item v-for="(item ,index) in baseConf" :index="index" :key="index">
								<view v-if="(index==0) || (index==1) || (index==2) || (index==3) || (index==4) ||  (index==7) || (index==8) || (index==9) || (index==10) || (index==11)" @click="clickEquipConf(index)" class="grid-item-box ey-item-conf">
									<uni-badge v-if="!!myEquip[index]" style="margin-left:5px;margin-top:5px;" :text="'等级:'+myEquip[index].lvl" absolute="rightBottom" :offset="[32, 15]">
										<image class="btn-image" :src="'/static/game/'+myEquip[index].avatar"></image>
									</uni-badge>
								</view>
								<view v-else class="grid-item-box"></view>
							</uni-grid-item>
						</uni-grid>
						<uni-grid style="margin-top:30px;" :column="3" :show-border="false" :square="false" :highlight="false">
							<uni-grid-item v-for="(item ,index) in baseModules" :index="index" :key="index">
								<view style="padding:10px;">
									<uni-tag style="font-size:16px" :mark="true" :text="item.name+':'+totalConf[item.id]" type="warning" size="default" />
								</view>
							</uni-grid-item>
						</uni-grid>
					</swiper-item>
					<swiper-item>
						<uni-title align="center" type="h2" title="AI模块仓库" color="#fff"></uni-title>
						<!--
						<uni-grid :column="5" :show-border="false" :square="true" @change="clickSelectModule">
							<uni-grid-item v-for="(item ,index) in myModules" :index="index" :key="index" >
								<view class="grid-item-box">
									<uni-badge style="margin-left:10px;margin-top:10px;" :text="'等级:'+item.lvl" absolute="rightBottom" :offset="[32, 15]">
										<uni-badge :text="'数量:'+item.numb" type="primary" absolute="rightTop" :offset="[-52, -60]" />
										<image class="btn-image" :src="'/static/game/'+item.avatar"></image>
									</uni-badge>
								</view>
							</uni-grid-item>
						</uni-grid>
						-->
						<uni-row v-for="(item,index) in baseModules" :key="index">
							<uni-col :span="4" style="padding-top: 15px;">
								<uni-tag style="font-size:16px" :mark="true" :text="item.name" type="warning" size="default" />
							</uni-col>
							<uni-col style="padding-bottom: 10px;" v-if="!!myStoreList[item.id]" :span="4" v-for="(item2,index2) in myStoreList[item.id]">
								<uni-badge @click="clickSelectModule(item2)"  :text="'等级:'+item2.lvl" absolute="rightBottom" :offset="[23, 10]">
									<uni-badge :text="'数量:'+item2.numb" type="primary" absolute="rightTop" :offset="[-26, -45]" />
									<image @click="clickSelectModule(item2)" class="store-image" :src="'/static/game/'+item2.avatar"></image>
								</uni-badge>
							</uni-col>
							<uni-col v-else>
								&nbsp;
							</uni-col>
						</uni-row>
					</swiper-item>
				</swiper>
			</view>
			<view class="ey-fight" :style="'max-height:'+page.height+'px;height:'+page.height+'px;'"  v-if="menu.current === 3">
				<text>选项卡3的内容</text>
			</view>
			<view class="ey-sale" :style="'color:#fff;max-height:'+page.height+'px;height:'+page.height+'px;'"  v-if="menu.current === 4">
				<!--
				<uni-title align="center" type="h2" title="正出售的模块" color="#fff"></uni-title>
				<uni-grid :column="4" :show-border="false" :square="true" @change="clickSaleModule">
					<uni-grid-item v-for="(item ,index) in sale.data" :index="index" :key="index" >
						<view class="grid-item-box">
							<uni-badge style="margin-left:10px;margin-top:10px;" :text="'等级:'+item.lvl" absolute="rightBottom" :offset="[32, 15]">
								<uni-badge style="z-index: 9;" :text="item.coin+'金币'" type="primary" absolute="rightTop" :offset="[-32, -60]" />
								<image class="btn-image" :src="'/static/game/'+item.avatar"></image>
							</uni-badge>
						</view>
					</uni-grid-item>
				</uni-grid>		
				<view style="margin:10px;">
				<uni-pagination @change="getSaleData" title="" show-icon="true" :total="sale.count"  :page-size="sale.limit" :current="sale.page"></uni-pagination>
				</view>
				-->
				
				<uni-segmented-control :current="sale.cateid" :values="sale.cate" style-type="button"
									 @clickItem="getSaleDataByCate" />
				
				<view>
					<uni-row style="padding-top:10px;" v-for="(item,index) in sale.data" :key="index" :index="index">
						<uni-col :span="1">
							<text>&nbsp;</text>
						</uni-col>
						<uni-col :span="4">
								<image class="item-image" :src="'/static/game/'+item.avatar"></image>
						</uni-col>
						<uni-col :span="4" style="padding-top:5px;">
							<text>等级:{{item.lvl}}</text>
						</uni-col>
						<uni-col :span="10" style="padding-top:5px;padding-left:20px;">
							<text>价格:{{item.coin}}金币</text>
						</uni-col>
						<uni-col :span="5">
							<button v-if="item.uid==myInfo.uid" class="mini-btn" @click="clickSaleModule(index)" type="primary" plain="true" size="mini">回购</button>
							<button v-else class="mini-btn" @click="clickSaleModule(index)" type="primary" plain="true" size="mini">购买</button>
						</uni-col>
					</uni-row>
				</view>
				<view style="margin:10px;">
					<uni-pagination @change="getSaleData" title="" show-icon="true" :total="sale.count"  :page-size="sale.limit" :current="sale.page"></uni-pagination>
				</view>
				
			</view>
		</view>		
		<!-- 底部栏 -->
		<view class="ey-bottom">
			<view>
				<uni-segmented-control :current="menu.current" :values="menu.item" @clickItem="onClickMenuItem" />
			</view>
		</view>		
		<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />
	</view>
</template>
<script>
	import * as utils from '@/common/util.js';	
	export default {
		mounted(){  
			uni.createSelectorQuery().select(".ey-bottom").boundingClientRect((data) =>{
				//console.log(data);
				this.page.height = data.top-2;
			}).exec();  
		},
		data() {
			return {
				upUrl : '',
				page : {},
				myInfo : {},
				myPocket : {},
				baseModules : [],
				myModules : [],
				myStoreList:{},// 我的仓库，并且是整理排序的
				baseConf : [0,1,2,3,4,5,6,7,8,9,10,11],
				myEquip : {},	// 已经配置的装备
				tempEquip : {},	// 选择配置时的装备
				swiperIndex : 0,
				//saleModules : [],
				sale : {cateid:0,cate:[],data : [],count : 0,page : 0,limit:10},
				totalConf : [], // 用于配置项数据统计
				menu:{
					item : ['时空堡垒','战斗配置','仓库','AI对决','交易大厅'],
					current: 0,
					height : 50,
				},
				actMenu : getApp().globalData.actMenu
			}
		},
		onLoad(param){
			this.page = getApp().globalData.page;
			this.page.height = parseInt(this.page.height) - parseInt(this.menu.height);
			//console.log("this.page=>",this.page);
			this.myInfo = uni.getStorageSync('myAuth');
		},
		onShow: function() {
			if (!!this.myInfo.uid) {
				getApp().globalData.myAuth = this.myInfo;
				this.getBaseModules();
			}else{
				uni.switchTab({
					url:'/pages/member/index'
				})
			}			
			this.baseModules = uni.getStorageSync('game_modules');
			
			//console.log("baseModules=>",JSON.stringify(this.baseModules));
			//console.log('this.sale.cate=>',JSON.stringify(this.sale.cate));
			/*
			var that = this;
			setTimeout(function(){
				that.custom();
			},3000);
			*/
		},
		methods:{
			clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
			// 调出选择装备界面
			selectEquip(sort){
				this.tempEquip.sort = sort;
				this.swiperIndex = 1;
			},
			// 将装备配置到AI战斗模块中。
			setEquipConf(){
				let that = this;
				let pdata = this.tempEquip;
				utils.post(getApp().globalData.eyUrl+'game/setEquip',pdata).then(res=>{
					let ret = res.data;
					//console.log("ret=>",JSON.stringify(ret));
					if (ret.code == '1'){
						that.myEquip = ret.equip;
						//that.myModules = ret.modules;
						uni.setStorageSync('game_myequip',ret.equip);
						uni.setStorageSync('game_mymodules',ret.modules);
						that.renderMyModules();
						that.swiperIndex = 0;
						that.tempEquip.sort = -1;
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			// 卸下配置
			delEquipConf(sort){
				let that = this;
				let pdata = {};
				pdata.sort = sort;
				pdata.obj = this.myEquip[sort];
				utils.post(getApp().globalData.eyUrl+'game/delEquip',pdata).then(res=>{
					let ret = res.data;
					//console.log("ret=>",JSON.stringify(ret));
					if (ret.code == '1'){
						that.myEquip = ret.equip;
						//that.myModules = ret.modules;
						uni.setStorageSync('game_myequip',ret.equip);
						uni.setStorageSync('game_mymodules',ret.modules);
						that.renderMyModules();
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			// 点击仓库中的装备
			clickSelectModule(obj){
				var that = this;
				//this.tempEquip.obj = this.myModules[e.detail.index];
				this.tempEquip.obj = obj;
				if (this.tempEquip.sort >= 0){	// 从AI点半模块中点击触发
					this.setEquipConf();
				}else{							// 从当前界面中点击触发
					uni.showActionSheet({
						itemList: ['出售1份该模块', '回收1份该模块'],
						success: function (res) {
							if (res.tapIndex == 0){
								uni.showModal({
									title: '出售1份该模块',
									//content: '是否出售该模块',
									editable:true,
									placeholderText:'输入模块价格(单位:金币)',
									success: function (res) {
										if (res.confirm) {
											that.tempEquip.obj.coin = res.content;
											that.setModuleSale(that.tempEquip.obj);
										} else if (res.cancel) {
											//console.log('用户点击取消');
										}
									},
									complete:function(){
										//that.setAIConfInit();
									}
								});
							}else{
								uni.showModal({
									title: '回收1份该模块',
									content: '回收后将返还当前模块的95%资源',
									//editable:true,
									//placeholderText:'输入模块价格(单位:金币)',
									success: function (res) {
										if (res.confirm) {
											//that.tempEquip.obj.coin = res.content;
											that.setModuleReturn(that.tempEquip.obj);
										} else if (res.cancel) {
											//console.log('用户点击取消');
										}
									},
									complete:function(){
										//that.setAIConfInit();
									}
								});
							}
						},
						fail: function (res) {
							//console.log(res.errMsg);
						}
					});
				}
			},
			// 点击AI战斗模块的配置
			clickEquipConf(e){
				var that = this;
				//var sort = e.detail.index;
				var sort = e;
				if (!!that.myEquip[sort]){
					//console.log('已装备');
					uni.showModal({
						title: '提示',
						content: '是否卸下配置的模块',
						success: function (res) {
							if (res.confirm) {
								that.delEquipConf(sort);
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						},
						complete:function(){
							that.setAIConfInit();
						}
					});					
				}else{
					setTimeout(function(){
						that.selectEquip(sort);
						//console.log('未装备');
					},100);
				}
			},
			// 获取当前配置的战斗装备
			getEquipData(){
				let that = this;
				let pdata = {};
				utils.post(getApp().globalData.eyUrl+'game/getEquip',pdata).then(res=>{
					let ret = res.data;
					//console.log("ret=>",JSON.stringify(ret))
					if (ret.code == '1'){
						that.myEquip = ret.data;
						uni.setStorageSync('game_myequip',ret.data);
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			getBaseModules(){
				let that = this;
				let pdata = {};
				utils.post(getApp().globalData.eyUrl+'game/getModulesBase',pdata).then(res=>{
					let ret = res.data;
					//console.log('ok');
					//console.log("ret.pocket=》",JSON.stringify(ret.pocket));
					if (ret.code == '1'){
						that.baseModules = ret.data;
						that.myPocket = ret.pocket;
						uni.setStorageSync('game_modules',ret.data);
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			clickSaleModule(index){
				const that = this;
				
				const obj = this.sale.data[index];
				if (!!obj){
					if (obj.uid == that.myInfo.uid){
						//console.log('obj=>',obj);
						uni.showModal({
							title: '回购出售的模块吗？',
							//content: '将回收该模块的95%资源',
							success: function (res) {if (res.confirm) {that.setModuleBuyBack(index);} else if (res.cancel) {}}
							//,complete:function(){that.setAIConfInit();}
						});
					}else{
						uni.showModal({
							title: '购买此模块吗?',
							content: '将消耗'+obj.coin+'金币',
							success: function (res) {if (res.confirm) {that.setModuleBuy(index);} else if (res.cancel) {}}
							//,complete:function(){that.setAIConfInit();}
						});
					}
				}
			},
			// 请求购买模块业务
			setModuleBuy(index){
				let that = this;
				let pdata = {};
				pdata = this.sale.data[index];
				utils.post(getApp().globalData.eyUrl+'game/buyModule',pdata).then(res=>{
					let ret = res.data;
					//console.log('ret=>',JSON.stringify(ret));
					if (ret.code == '1'){
						that.sale.data.splice(index,1);
						uni.setStorageSync('game_mymodules',ret.data);
						uni.showToast({icon:'success',title: '购买成功！'});
						that.renderMyModules();
					}else{
						uni.showToast({icon:'none',title: ret.msg});
					}
				});
			},
			// 请求回收业务
			setModuleReturn(index){
				let that = this;
				let pdata = index;
				utils.post(getApp().globalData.eyUrl+'game/buyReturnModule',pdata).then(res=>{
					let ret = res.data;
					console.log('ret=>',JSON.stringify(ret));
					if (ret.code == '1'){
						//that.sale.data.splice(index,1);
						uni.setStorageSync('game_mymodules',ret.data);
						uni.showToast({icon:'success',title: '回收成功！'});
						that.renderMyModules();
					}else{
						uni.showToast({icon:'none',title: ret.msg});
					}
				});
			},
			// 请求回购业务
			setModuleBuyBack(index){
				let that = this;
				let pdata = {};
				pdata = this.sale.data[index];
				utils.post(getApp().globalData.eyUrl+'game/buyBackModule',pdata).then(res=>{
					let ret = res.data;
					//console.log('ret=>',JSON.stringify(ret));
					if (ret.code == '1'){
						that.sale.data.splice(index,1);
						uni.setStorageSync('game_mymodules',ret.data);
						uni.showToast({icon:'success',title: '回购成功！'});
						that.renderMyModules();
					}else{
						uni.showToast({icon:'none',title: ret.msg});
					}
				});
			},
			// 上架要出售的模块
			setModuleSale(item){
				let that = this;
				let pdata = {};
				pdata = item;
				utils.post(getApp().globalData.eyUrl+'game/setModuleSale',pdata).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						uni.setStorageSync('game_mymodules',ret.data);
						uni.showToast({icon:'none',title: '模块出售中'});
						that.renderMyModules();
					}else{
						uni.showToast({icon:'none',title: ret.msg});
					}
				});
			},

			setModuleMakeSure(item){
				const that = this;
				uni.showModal({
					title: '确认要制造该模块吗？',
					content: '制造该模块将消耗资源:'+Math.pow(10,item.lvl)*100,
					success: function (res) {if (res.confirm) {that.setModuleMake(item);} else if (res.cancel) {}}
					//,complete:function(){that.setAIConfInit();}
				});
			},			
			setModuleMake(item){
				let that = this;
				let pdata = {};
				pdata = item;
				utils.post(getApp().globalData.eyUrl+'game/setModuleMake',pdata).then(res=>{
					let ret = res.data;
					//console.log("setModuleMake=>",JSON.stringify(ret.pocket));					
					if (ret.code == '1'){
						that.myPocket = ret.pocket;
						uni.setStorageSync('game_mymodules',ret.data);
						uni.showToast({icon:'none',title: '模块制造成功'});
					}else{
						uni.showToast({icon:'none',title: ret.msg});
					}
				});
			},
			setModuleUpgradeSure(item){
				const that = this;
				uni.showModal({
					title: '确认要升级该模块吗？',
					content: '消耗金币:'+(100*item.lvl)+',资源:'+Math.pow(10,item.lvl)*1000,
					success: function (res) {if (res.confirm) {that.setModuleUpgrade(item);} else if (res.cancel) {}}
					//,complete:function(){that.setAIConfInit();}
				});
			},
			setModuleUpgrade(item){
				let that = this;
				let pdata = {};
				pdata = item;
				utils.post(getApp().globalData.eyUrl+'game/setModuleUpgrade',pdata).then(res=>{
					let ret = res.data;
					//console.log("setModuleUpgrade=>",JSON.stringify(res));
					if (ret.code == '1'){
						that.baseModules = ret.data;
						that.myPocket = ret.pocket;
						uni.showToast({icon:'none',title: '模块升级成功'});
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			getModuleInfoById(id){
				for (var k in this.baseModules){
					if (this.baseModules[k].id == id)
						return this.baseModules[k];
				}
				return {};
			},
			// 设置『战斗配置』初始化
			setAIConfInit(){
				this.swiperIndex = 0;
				this.tempEquip.sort = -1;
				this.sale.cateid = 0;
			},
			
			renderMyModules(){
				this.myModules = [];
				this.totalConf = [];
				this.myStoreList = {};
				const _myall = uni.getStorageSync('game_mymodules');
				var _t = {};
				for(var k in _myall){
					if (_myall[k].lvl == "0") continue;
					_t = this.getModuleInfoById(_myall[k].mid);
					if (!!_t.id){
						
						_myall[k].name = _t.name;
						_myall[k].avatar = _t.avatar;
						this.myModules.push(_myall[k]);
						
						if (!this.myStoreList[_t.id]) this.myStoreList[_t.id] = [];
						this.myStoreList[_t.id].push(_myall[k]);
						
					}
				}
				//console.log("this.myStoreList=>",this.myStoreList);
				const _myequip = uni.getStorageSync('game_myequip');
				for (var i=1; i<=7; i++){
					this.totalConf[i] = 1000;
					for (var k in _myequip){
						this.totalConf[_myequip[k].mid] = this.totalConf[_myequip[k].mid] + (1000 * _myequip[k].lvl * 10 / 100);
					}
				}
				
				//console.log("_myequip=>",JSON.stringify(this.totalConf));
			},
			getSaleDataByCate(e){
				this.sale.page = 0;
				this.sale.cateid = e.currentIndex;
				//console.log("getSaleDataByCate=>",e);
				this.renderSaleModules();
			},
			getSaleData(e){
				//console.log("getSaleData=>",e);
				this.sale.page = e.current;
				this.renderSaleModules();
			},			
			renderSaleModules(){
				let that = this;
				let pdata = {};
				pdata.cateid = this.sale.cateid+1;
				pdata.page = this.sale.page;
				//pdata.count = this.sale.count;
				//pdata.limit = this.sale.limit;
				utils.post(getApp().globalData.eyUrl+'game/getSaleModules',pdata).then(res=>{
					let ret = res.data;
					//console.log("renderSaleModules=>",JSON.stringify(ret));
					that.sale.data = [];
					if (ret.code == '1'){
						//that.saleModules = ret.data;						
						const baseModules = uni.getStorageSync('game_modules');
						var _t = {};
						that.sale.count = ret.count;
						that.sale.limit = ret.limit;
						that.sale.page  = ret.page;
						for(var k in ret.data){
							_t = that.getModuleInfoById(ret.data[k].mid);
							if (!!_t.id){
								ret.data[k].name = _t.name;
								ret.data[k].avatar = _t.avatar;
								//console.log("_myall[k]=>",JSON.stringify(_myall[k]));
								that.sale.data.push(ret.data[k]);
							}
						}
					}else{
						uni.showToast({icon:'none',title: ret.msg});
					}
				});
			},
			onClickMenuItem(e) {
				if (this.menu.current !== e.currentIndex) {
					this.menu.current = e.currentIndex;
					this.setAIConfInit();
					if (this.menu.current == 0){
						let that = this;
						let pdata = {};
						utils.post(getApp().globalData.eyUrl+'game/getMyPocket',pdata).then(res=>{
							let ret = res.data;
							//console.log("getMyPocket=>",JSON.stringify(ret));
							if (ret.code == '1'){
								that.myPocket = ret.pocket;
							}else{
								uni.showToast({
									icon:'none',
									title: ret.msg
								});
							}
						});
					}else if (this.menu.current == 1){
						this.renderMyModules();
						//console.log("this.myModules=>",JSON.stringify(this.myModules));	
						this.getEquipData();
					}else if (this.menu.current == 2){
						//console.log('ok');
						if (this.myModules.length == 0){
							this.renderMyModules();
						}
						this.swiperIndex = 1;
						this.tempEquip.sort = -1;
					}else if (this.menu.current == 4){
						
						if (this.sale.cate.length == 0){
							for (var k in this.baseModules){
								this.sale.cate.push(this.baseModules[k].name);
							}
						}
						
						this.renderSaleModules(1);
					}
				}
			},
			
		}
	}
</script>

<style>
	.btn-text{
		position:absolute;left:15px;top:20px;font-weight: bold;color:#FFF;
	}
	.btn-image{
		width: 130rpx;
		height: 130rpx;
	}
	.store-image{
		width:100rpx;
		height:100rpx;
	}
	.item-image{
		width:80rpx;
		height:80rpx;
	}
	.base-module{
		-webkit-flex: 1;flex: 1;height: 50px;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;
	}
	
	.base-module-avatar{
		margin-left:10px;
		height:80px;
		/*background-image: url(/static/game/item2.png);*/
		/* 背景图垂直、水平均居中 */
		background-position: left center;
		/* 背景图不平铺 */
		background-repeat: no-repeat;
		/* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 
		background-attachment: fixed;*/
		/* 让背景图基于容器大小伸缩 
		background-size: cover;		*/

	}
	.ey-bottom{
		flex: 1;position: absolute;right: 0;bottom: 0;left: 0;
	}
	.ey-base{
		/*height:580px;*/
		/* 加载背景图 */
		background-image: url(/static/game/base-background.jpg);
		/* 背景图垂直、水平均居中 */
		background-position: center center;
		/* 背景图不平铺 */
		background-repeat: no-repeat;
		/* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
		background-attachment: fixed;
		/* 让背景图基于容器大小伸缩 */
		background-size: cover;
		/* 设置背景颜色，背景图加载过程中会显示背景色 */
		/*background-color: #ffffff;*/
	}
	.ey-conf{
		/* 加载背景图 */
		background-image: url(/static/game/conf-bg.jpg);
		/* 背景图垂直、水平均居中 */
		background-position: center center;
		/* 背景图不平铺 */
		background-repeat: no-repeat;
		/* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
		background-attachment: fixed;
		/* 让背景图基于容器大小伸缩 
		background-size: cover;*/
		/* 设置背景颜色，背景图加载过程中会显示背景色 */
		/*background-color: #ffffff;*/
	}
	.ey-fight{
		background-color:#000;
	}
	.ey-sale{
		background-image: url(/static/game/sale-bg2.jpg);
		background-position: center center;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}
	.grid-item-box {
		flex: 1;
		 position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
		
		/*
		margin-left:10px;
		height:80px;
		*/
	}

	.grid-item-box-row {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}
	.ey-item-conf{
		background-image: url(/static/game/btn-make.png);
		/* 背景图垂直、水平均居中 */
		background-position: center;
		/* 背景图不平铺 */
		background-repeat: no-repeat;
		/* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
		background-size: cover;
		width:100%;
		height: auto;
		/*
		border: 5px solid #7cb7cd;
		border-radius: 50%;*/
	}

</style>
