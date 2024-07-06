<template>
	<view class="container">
		<uni-segmented-control :current="switchtab.current" :values="switchtab.items"  @clickItem="onClickTab" />
		<view class="content">
			<view v-if="switchtab.current === 0">
				<uni-section title="现金" sub-title="说明：每天拍卖截至时间晚上10点，竞拍自己填数字，少于现价无效。" type="line">
					<scroll-view scroll-y="true" :style="'height:'+page.height+'px'">
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center" width="200px">名称</uni-th>
							<uni-th align="center">最高竞价</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr v-for="(item,index) in cash.data" :key="index">
							<uni-td>
<uni-row style="height:24px;line-height: 24px;">
	<uni-col :span="24">
		#{{item.id}} {{item.title}} 
	</uni-col>
	<uni-col :span="14">
	<view>起拍:<text class="numb">{{item.numbmin}}</text></view>
	</uni-col>
	<uni-col :span="10">
		<!--<view class="btn">竞 拍</view>-->
		<button v-if="item.status=='0'" class="mini-btn" @tap="clickCashJoin(item,index)" plain="true" type="primary" size="mini">竞 拍</button>
		<view v-else-if="((item.uid==myAuth.uid) && (item.status=='0'))" class="tag-view"><uni-tag :inverted="true" text="已参与"></uni-tag></view>
		<view v-else class="tag-view"><uni-tag :inverted="true" text="已结束"></uni-tag></view>
	</uni-col>
</uni-row>
							</uni-td>
							<uni-td>
								<view v-if="item.numb" class="member_head">
									<image class="member_avatar" :src="upUrl+item.avatar" mode=""></image>
									<view class="member_info">
										<view class="member_name">{{item.name}}</view>
										<view class="member_sign">竞价:<text class="numb">{{item.numb}}</text></view>
									</view>
								</view>		
								<view v-else>虚位以待</view>	
							</uni-td>
						</uni-tr>
					</uni-table>
					</scroll-view>
				</uni-section>
					<view style="padding:15px;">
					<uni-pagination @change="changeCash" :total="cash.count" :pageSize="cash.limit" />
					</view>
			</view>
			<view v-if="switchtab.current === 1">
				<uni-section title="金币" sub-title="" type="line">
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center" width="200px">名称</uni-th>
							<uni-th align="center">最高竞价</uni-th>
						</uni-tr>
						
						<!-- 表格数据行 -->
						<uni-tr v-for="(item,index) in coin.data" :key="index">
							<uni-td>{{item.id}}</uni-td>
							<uni-td>{{item.name}}</uni-td>
						</uni-tr>
					</uni-table>
				</uni-section>
				<view style="padding:15px;">
				<uni-pagination @change="changeCoin" :total="coin.count" :pageSize="10" title="标题文字" />
				</view>
				<button  type="primary"  @tap="clickCoinApply()">我要发布</button>
			</view>
			<view v-if="switchtab.current === 2">
				<uni-section title="资源" sub-title="" type="line">
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center" width="200px">名称</uni-th>
							<uni-th align="center">最高竞价</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<view v-for="(item,index) in resource.data" :key="index">
						<uni-tr>
							<uni-td>{{item.id}}</uni-td>
							<uni-td>{{item.name}}</uni-td>
						</uni-tr>
						</view>
					</uni-table>
				</uni-section>
				<view style="padding:15px;">
				<uni-pagination @change="changeResource" :total="resource.count" :pageSize="10" title="标题文字" />
				</view>
				<button  type="primary"  @tap="clickResourceApply()">我要发布</button>
			</view>
		</view>
		<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		components: {},
		data() {
			return {
				upUrl : ''
				,myAuth : {}
				,switchtab:{
					items: ['现金', '金币', '资源'],
					current: 0,
					colorIndex: 0,
					activeColor: '#007aff',
					styleType: 'button'
				}
				,cash : {page:0,limit:10}
				,coin: {}
				,resource:{}
				,page:{
					height:0,
				}
				,actMenu : getApp().globalData.actMenu
			}
		},
		onLoad(param) {
		//	console.log("param=>",param);
			let that = this;
			if (!!param.current) that.switchtab.current = parseInt(param.current);
			that.upUrl = getApp().globalData.upUrl;
			that.page.height = getApp().globalData.page.height-265;
		},
		onShow(){
			//this.myAuth = getApp().globalData.myAuth;
			if (!this.myAuth.uid){
				this.myAuth = uni.getStorageSync('myAuth') || {};
			}

			this.getPaiMai(this.switchtab.current);
		},
		methods: {
			clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
			changeCash(e) {
				this.cash.page = e.current;
				this.getPaiMai(this.cash.tag);
			},
			clickCashJoin(e, index){
				let that = this;
				let numb = !!e.numb ? parseInt(e.numb) : parseInt(e.numbmin);
				uni.showModal({
					'editable':true,
					'title' : '竞拍不得少于'+String(numb)+'金币',
					'content':!!e.numb ? String(numb+1) : e.numbmin,
					'placeholderText':'请输入您的竞拍金币数额',
					success:function(res){
						if (res.confirm) {
							let curnumb = parseInt(res.content);
							if ((curnumb < parseInt(e.numbmin)) 
							|| (curnumb <= parseInt(e.numb))) {
								uni.showToast({
									icon: 'none',
									title: '竞价过低'
								})
								return false;
							}
							let pdata = {};
							pdata.id = e.id;
							pdata.numb = res.content;
							utils.post(getApp().globalData.eyUrl+'paimai/join',pdata).then(res=>{
								let ret = res.data;
								if (ret.code == '1'){
									that.cash.data[index].uid = ret.data.uid;
									that.cash.data[index].name = ret.data.name;
									that.cash.data[index].avatar = ret.data.avatar;
									that.cash.data[index].numb = ret.data.numb;
									uni.showToast({
										title: '参与竞拍成功!'
									})
								}else if (ret.code == '0'){
									uni.showToast({
										icon: 'none',
										title: ret.msg
									})
								}else if (ret.code == '-1'){
									getApp().globalData.myAuth = {};
									uni.showToast({
										icon: 'none',
										title: ret.msg
									})
									uni.switchTab({
										url:'/pages/member/index'
									})
								}
							});
						}
					}
				})
			},
			clickCashApply(){
				
			},
			clickCoinApply(){
				
			},
			clickResourceApply(){
				
			},
			getPaiMai(index){
				let that = this;
				let pdata = {};
				if (index == 0){
					pdata.tag = index;
					pdata.limit = that.cash.limit;
					pdata.page = that.cash.page;
					pdata.count = that.cash.count;
				}
				
				utils.post(getApp().globalData.eyUrl+'paimai/getData',pdata).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					//console.log("myAuth=>",JSON.stringify(.myAuth));
					//console.log("paimai=>",ret);
					if (ret.code == '1'){
						if (index== 0){
							that.cash = ret;
						}else if(index ==1) {
							that.coin = ret;
						}else if(index ==2) {
							that.resource = ret;
						}
					}
				});
			},
			onClickTab(e) {
				if (this.switchtab.current !== e.currentIndex) {
					this.switchtab.current = e.currentIndex;
					this.getPaiMai(e.currentIndex);
				}
			}
		}
	}
</script>


<style>
	.container {
		padding: 15px;
		font-size: 14px;
		line-height: 24px;
	}
	.btn{
		background-color: #ffa415;
		color: #fff;
		padding: 2px;
		border-radius: 5rpx;
		max-width:50px;
	}
	.numb{
		color: #fd8008;
	  font-size: 36rpx;
	  font-weight: 600;
	}
	.member_head{
		display: flex;
		align-items: center;
	}
	.member_avatar{
		height: 64rpx;
		width: 64rpx;
		border-radius: 50%;
	}
	.member_info{
		font-size:24rpx;
		margin-left: 20rpx;
	}
	.member_name{
		color: #797979;
	}
	.member_sign{
		color: #797979;
		margin-top: 6rpx;
		font-weight: 600;
	}	
</style>
