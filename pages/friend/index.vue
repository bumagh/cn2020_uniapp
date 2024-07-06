<template>
	<!--
	<uni-search-bar placeholder="自定义searchIcon" @confirm="friendFind" @cancel="friendSearch" cancel-text="找好友">
		<uni-icons slot="searchIcon" color="#999999" size="18" type="home" />
	</uni-search-bar>
	-->
	<uni-nav-bar @clickRight="renderFriendAdd">
		<template v-slot:left>
			<view class="city">
				<view>
					<text style="font-size: 16px;">查好友</text>
				</view>
			</view>
		</template>
		<view class="input-view">
			<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
			<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入好友昵称"
				@input="friendSearch" />
		</view>
		<template v-slot:right>
			<uni-badge v-if="friendApply.length>0" class="uni-badge-left-margin" :text="friendApply.length" absolute="rightTop" :offset="[30, 3]" size="small">
				<uni-icons type="personadd-filled" color="#666" size="26" />
			</uni-badge>
			<uni-icons v-else type="personadd-filled" color="#666" size="26" />
		</template>
	</uni-nav-bar>
	<!--调出添加好友抽屉页-->
	<uni-drawer ref="showFriendAdd" mode="right" :width="260">
		<uni-section title="添加新的好友" type="line">
			<uni-search-bar placeholder="请输入要添加好友的昵称" @confirm="openFriendAdd" :focus="true" v-model="search.value">
			</uni-search-bar>
			<uni-list v-if="(!!search.data) && (search.data.length > 0)">
				<uni-list :border="true">				
					<uni-list-chat v-for="(item,index) in search.data" :key="index" clickable @click="clickFriendDetail('friend',item)"  :avatar-circle="true" :title="item.name" :avatar="upUrl+item.avatar" :note="item.sign" showArrow></uni-list-chat>
				</uni-list>
			</uni-list>
			<uni-card v-else v-if="(!!search.value) && (search.value != '')" style="background-color: wheat;margin: 20rpx;">
				<view><text class="uni-h6">没有找到该昵称的用户</text></view>
			</uni-card>
		</uni-section>
		<uni-section v-if="friendApply.length > 0" title="申请加我为好友的用户" type="line">
			<!--
			<uni-list>
				<uni-list :border="true">				
					<uni-list-chat v-for="(item,index) in friendApply" :key="index" clickable @click="clickFriendDetail('friend',item)"  :avatar-circle="true" :title="item.name" :avatar="upUrl+item.avatar" :note="item.sign" showArrow></uni-list-chat>
				</uni-list>
			</uni-list>
			-->
			<view class="loan_list">
				<view class="list_item" v-for="(item,index) in friendApply" :key="index">
					<view class="item_head">
						<image class="pic" :src="upUrl+item.avatar" mode=""></image>
						<view class="loan_info">
							<view class="name">
								{{item.name}}
							</view>
							<view v-if="(!!item.sign && (item.sign!=''))" class="date">
								{{item.sign}}
							</view>
						</view>
						<view style="background-color: orange;" class="join_btn" @tap="setFriendRefuse(index)">
							拒绝
						</view>
						<view  class="join_btn" @tap="setFriendAgree(index)">
							同意
						</view>
					</view>
				</view>
			</view>
		</uni-section>
	</uni-drawer>
	<uni-drawer ref="showUserDetail" mode="right" :width="260">
		<view class="header" >
			<image :src="upUrl+adduinfo.avatar"></image>
		</view>
		<view class="list">
			<view class="list-call">
			  用户昵称：{{adduinfo.name}}
			</view> 
			<view v-if="(!!adduinfo.sign) && (adduinfo.sign!='')" class="list-call">
			 {{adduinfo.sign}}
			</view> 
		</view>
		<block v-if="myInfo.uid!=adduinfo.uid">
		<button style="margin: 10px;" type="primary" @tap="setFriendChat(adduinfo)" >私 聊</button>
		<button v-if="fids.indexOf(adduinfo.uid)<0" style="margin: 10px;" type="primary" plain="true" @tap="setFriendAdd(adduinfo)" >加为好友</button>
		<button v-else style="margin: 10px;" type="warn" @tap="setFriendDel(adduinfo)" >删除好友</button>
		</block>
	</uni-drawer>
	<view class="container">
		<uni-list v-if="friend.length >0">
			<uni-list :border="true">				
				<uni-list-chat v-for="(item,index) in friend" :key="index" clickable @click="clickFriendDetail('friend',item)"  :avatar-circle="true" :title="item.name" :avatar="upUrl+item.avatar" :note="item.sign" showArrow></uni-list-chat>
			</uni-list>
		</uni-list>
		<uni-card v-else :is-shadow="false">
			<text class="uni-body">暂无好友数据，请添加新的好友。</text>
		</uni-card>
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		components: {},
		data() {
			return {
				myInfo :{},
				friend : [],
				friendApply : [],
				fids : [],
				search : {},
				upUrl : '',
				adduinfo:{},
			}
		},
		onLoad(param){
			this.myInfo = getApp().globalData.myAuth;
			this.upUrl = getApp().globalData.upUrl;
		},
		onShow: function() {
			if (!!getApp().globalData.myAuth.uid){			
				this.myInfo = getApp().globalData.myAuth;
				this.getMyFriend();
			}else{
				uni.switchTab({
					url:'/pages/member/index'
				})
			}
		},
		onHide: function() {
			
		},
		methods: {
			// 拒绝成为的好友关系的铵钮
			setFriendRefuse(index){
				let pdata = {};
				let that = this;
				pdata.uid = this.friendApply[index].uid;
				utils.post(getApp().globalData.eyUrl+'friend/refuse',pdata).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						that.friendApply.splice(index,1);
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			// 同意成为的好友关系的铵钮
			setFriendAgree(index){
				let pdata = {};
				let that = this;
				pdata.uid = this.friendApply[index].uid;
				utils.post(getApp().globalData.eyUrl+'friend/agree',pdata).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						that.friendApply.splice(index,1);
						that.getMyFriend();
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			// 删除好友
			setFriendDel(uinfo){
				let that = this;
				uni.showModal({
					content : '确定要删除该好友吗？',
					success: function (res) {
						if (res.confirm) {
							let pdata = {};
							pdata.uid = uinfo.uid;
							utils.post(getApp().globalData.eyUrl+'friend/del',pdata).then(res=>{
								let ret = res.data;
								//console.log("setFriendDel=>",JSON.stringify(ret));
								if (ret.code == '1'){
									that.$refs['showUserDetail'].close();
									uni.showToast({
										title: '删除成功'
									});
									that.getMyFriend();

								}else{
									uni.showToast({
										icon:'none',
										title: ret.msg
									});
								}
							});
						}
					},
				})
			},
			// 发起好友添加申请
			setFriendAdd(uinfo){
				let pdata = {};
				let that = this;
				pdata.uid = uinfo.uid;
				utils.post(getApp().globalData.eyUrl+'friend/add',pdata).then(res=>{
					let ret = res.data;
					//console.log("setFriendAdd=>",JSON.stringify(ret));
					if (ret.code == '1'){
						uni.showToast({
							title: ret.msg
						});
						if (ret.step == '1'){
							that.getMyFriend();
						}
						that.search = {};
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			// 获取添加新的好友数据
			openFriendAdd(e){
				this.search = {};
				let pdata = {};
				let that = this;
				pdata.name = e.value;
				utils.post(getApp().globalData.eyUrl+'friend/search',pdata).then(res=>{
					let ret = res.data;
					//console.log("setFriendAdd=>",ret);
					if (ret.code == '1'){
						that.search.data = ret.data;
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			// 打开添加新的好友抽屉
			renderFriendAdd(){
				this.$refs['showFriendAdd'].open();
			},
			// 在好友列表中搜索
			friendSearch(e){
				let _search = [];
				if (e.detail.value == ''){
					_search = uni.getStorageSync('finfo') || [];
				}else{
					for (let i=0;i<this.friend.length;i++){
						if (this.friend[i].name.indexOf(e.detail.value) >= 0){
							_search.push(this.friend[i]);
						}
					}
				}
				this.friend = _search;
			},
			clickFriendDetail(type,obj){
				this.$refs['showFriendAdd'].close();				
				this.adduinfo = obj;
				//uni.$emit('userdetail',obj);
				this.$refs['showUserDetail'].open();
				return;
				uni.navigateTo({
					url:'/pages/friend/detail?'+type+"&rid="+id+'&title='+title
				})
			},
			setFriendChat(e){
				this.$refs['showUserDetail'].close();
				uni.navigateTo({
					url:'/pages/chat/chat?type=friend&rid='+e.uid+'&title='+e.name
				})
			},
			getMyFriend(){
				let that = this;
				let pdata = {};
				utils.post(getApp().globalData.eyUrl+'friend/getData',pdata).then(res=>{
					let ret = res.data;
					//console.log("friend=>"+ret,JSON.stringify(ret));
					if (ret.code == '1'){
						let fids = [];
						let appids = [];
						that.friend = [];
						that.friendApply = [];
						if (ret.data.length > 0){
							for (let i=0; i<ret.data.length;i++){
								if ((ret.data[i].status=='1') && (ret.data[i].uid==that.myInfo.uid)){
									fids.push(ret.data[i].fid);
								}else if ((ret.data[i].status=='1') && (ret.data[i].fid==that.myInfo.uid)){
									fids.push(ret.data[i].uid);
								}else{
									appids.push(ret.data[i].uid);
								}
							}
							let fidsnew = fids.filter(function(item,index){
								return fids.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
							});
							for (let i=0; i<ret.uinfo.length;i++){
								if (fidsnew.indexOf(ret.uinfo[i].uid) >= 0){
									that.friend.push(ret.uinfo[i]);
								}
								if (appids.indexOf(ret.uinfo[i].uid) >= 0){
									that.friendApply.push(ret.uinfo[i]);
								}
							}
							that.fids = fidsnew;
							uni.setStorageSync('fids',fidsnew);
							uni.setStorageSync('finfo',that.friend);
						}
					}else{
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			}
		}
	}
</script>
<style lang="scss">
	$nav-height: 30px;
	.box-bg {
		background-color: #F5F5F5;
		padding: 5px 0;
	}

	.city {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		// width: 160rpx;
		margin-left: 4px;
	}

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 500rpx;
		flex: 1;
		background-color: #f8f8f8;
		height: $nav-height;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: $nav-height;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.nav-bar-input {
		height: $nav-height;
		line-height: $nav-height;
		/* #ifdef APP-PLUS-NVUE */
		width: 370rpx;
		/* #endif */
		padding: 0 5px;
		font-size: 12px;
		background-color: #f8f8f8;
	}
	// 用户详细界面
	.header {
	  width: 100rpx;
	  height: 100rpx;
	  /*background: rgba(63, 205, 235, 1);
	  box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);*/
	  border-radius: 50%;
	  margin-top: 30rpx;
	  margin-left: auto;
	  margin-right: auto;
	}
	
	.header image {
	  width: 150rpx;
	  height: 150rpx;
	  border-radius: 50%;
	}
	
	.list {
	  display: flex;
	  flex-direction: column;
	  padding-top: 50rpx;
	  padding-left: 70rpx;
	  padding-right: 70rpx;
	}
	
	.list-call {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: center;
	  height: 100rpx;
	  color: #333333;
	  border-bottom: 0.5px solid #e2e2e2;
	}
	
	.list-call .img {
	  width: 40rpx;
	  height: 40rpx;
	}
	// 向我申请的好友列表
		.loan_list{
			margin-top: 0rpx;
			.list_item{
				padding: 0 10rpx;
				border-bottom: 1px solid #e9e9e9;
				margin-top: 20rpx;
				.item_head{
					display: flex;
					align-items: center;
					.pic{
						height: 64rpx;
						width: 64rpx;
						border-radius: 50%;
					}
					.loan_info{
						font-size:24rpx;
						margin-left: 20rpx;
						.name{
							color: #797979;
						}
						.date{
							color: #797979;
							margin-top: 6rpx;
							font-weight: 600;
						}
					}
					.join_btn{
						background-color: #2979ff;
						color: #fff;
						margin-left: auto;
						margin-right: 0rpx;
						padding: 6rpx 30rpx;
						border-radius: 30rpx;
						font-size: 28rpx;
					}
					.disabled_btn{
						background-color: #a6bedb;
						color: #fff;
						margin-left: auto;
						margin-right: 20rpx;
						padding: 6rpx 30rpx;
						border-radius: 30rpx;
						font-size: 28rpx;
					}
				}
				.item_bottom{
					display: flex;
					margin-top: 20rpx;
					padding-bottom: 14rpx;
					width: 100%;
					.bottom_item{
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;
						font-size: 26rpx;
						.names{
							color: #797979;
						}
						.amount{
							color: #ff0548;
							margin-top: 6rpx;
							font-weight: 600;
						}
					}
				}
			}
		}
</style>

