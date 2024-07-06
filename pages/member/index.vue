<template>
	
	<view v-if="!loginfo.uid" class="login">
		<view class="header">
		  <image src="../../static/shilu-login/logo.png"></image>
		</view>

		<view class="list">
		  <view class="list-call">
			<image class="img" src="/static/phone.png"></image>
			<input class="sl-input" v-model="loginfo.username" type="number" maxlength="11" placeholder="请输入手机号" />
		  </view>
		  <view class="list-call">
			<image class="img" src="/static/shilu-login/2.png"></image>
			<input class="sl-input" v-model="loginfo.password" type="text" maxlength="32" placeholder="请输入密码" password="true" />
		  </view>
		<view class="agreement">
		  <image @tap="agreementSuccess" :src="loginfo.record==true?'/static/shilu-login/ty1.png':'/static/shilu-login/ty0.png'"></image>
		  <text @tap="agreementSuccess"> 保留当前登录</text>
		</view>
		</view>

		<view class="button-login" hover-class="button-hover" @tap="bindLogin()">
		  <text>登录</text>
		</view>

		<view class="agreement">
		<navigator url="/pages/member/forget" open-type="navigate">忘记密码</navigator>
		 <!--<text @tap="forgetPassword()">忘记密码</text>-->
		  <text>|</text>
		  <navigator url="reg" open-type="navigate">注册账户</navigator>
		</view>		
	</view>
	<view v-else class="main" style="background-color: #e4ecf7;min-height: 100vh;">
		<view class="user_header_box">
			<view class="avatar_box">
				<image class="img" :src="upUrl+loginfo.avatar" mode=""></image>
			</view>
			<view class="user_info">
				<view class="name">
					称呼：<text>{{loginfo.name}}</text>
				</view>
				<view class="uid">
					帐号：{{loginfo.username}}
				</view>
			</view>
		</view>
		<view class="user_amount_box">
			<view class="user_level">
				<image class="icon" src="../../static/user/level_icon.png"></image>
				<view class="level_desc_box">
					<view class="title">
						当前等级：{{loginfo.lvl}}
					</view>
					<!--
					<view class="desc">
						加入会员享受更多特权
					</view>
					-->
				</view>
				<navigator class="right_nav" url="/pages/member/setinvited">
				<text  class="right_text">绑定设置</text>
				</navigator>
				<image class="right_icon" src="../../static/user/right.png" mode=""></image>
			</view>
			<view class="amount_box">
				<view class="amount">
					{{coin.number}} <text style="font-size: 26rpx;">金币</text>
				</view>
				<view v-if="qiandao==false" class="now_with" @tap="setQiandao()">
					签到
				</view>
				<view v-else  class="now_with2">
					已签到
				</view>
			</view>
		</view>
		
		<view class="user_tab_box">
			<view class="tab_title">
				常用服务
			</view>
			<view class="tab_list_box">
				<view class="list_item" @tap="clickUserEdit()">
					<image class="icon" src="../../static/user/tab_icon/account.png" mode=""></image>
					<view class="text">资料</view>
				</view>
				<view class="list_item" @tap="clickLevelup()">
					<image class="icon" src="../../static/user/tab_icon/level.png" mode=""></image>
					<view  class="text">升级</view>
				</view>
				<view class="list_item" @tap="clickPocket()">
					<image class="icon" src="../../static/user/tab_icon/amount.png" mode=""></image>
					<view class="text">钱包</view>
				</view>
				<view class="list_item" @tap="clickMessage()">
					<uni-badge v-if="newMessage>0" class="uni-badge-left-margin"  custom-style="{position:absolute;margin:-60px 20px;}" :text="newMessage" size="small">
						<image class="icon" src="../../static/user/tab_icon/xieyi.png" mode=""></image>
						<view class="text">消息</view>
					</uni-badge>
					<image v-else class="icon" src="../../static/user/tab_icon/xieyi.png" mode=""></image>
					<view class="text">消息</view>
				</view>
				<view class="list_item">
					<navigator class="right_nav" url="/pages/member/setinvited">
						<image class="icon" src="../../static/user/tab_icon/help.png" mode=""></image>
						<view  class="text">绑定设置</view>
					</navigator>
				</view>
				
				<view class="list_item"  @tap="clickTuiguang()">
					<image class="icon" src="../../static/share.png" mode=""></image>
					<view class="text">推广</view>
				</view>
				
				<view class="list_item" @tap="clickEditSign()">
					<image class="icon" src="../../static/user/tab_icon/about.png" mode=""></image>
					<view class="text">个人广告</view>
				</view>
				<view class="list_item" @tap="clickLogout()">
					<image class="icon" src="../../static/user/tab_icon/setting.png" mode=""></image>
					<view class="text">退出</view>
				</view>
			</view>
		</view>
		
		<view class="loan_box">
			<view class="loan_title_box">
				<view class="title">
					我的推广
				</view>
				<!--
				<view class="link">
					查看更多
				</view>
				-->
			</view>
			<view class="loan_list">
				<view class="list_item" v-for="(item,index) in myInvited" :key="index">
					<view class="item_head">
						<image class="pic" :src="upUrl+item.avatar" mode=""></image>
						<view class="loan_info">
							<view class="name">
								{{item.name}}
							</view>
							<view class="date">
								ID:{{item.username}} [{{item.lvl}}级]
							</view>
						</view>
						<view class="join_btn" @tap="cancelInvited(item)">
							解绑
						</view>
						<view v-if="coin.gets.indexOf(item.uid) != -1" class="disabled_btn">
							已收取
						</view>
						<view v-else class="join_btn" @tap="getCoin(item)">
							收取
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_line">
			<view class="line"></view>
			<text style="margin: 0 20rpx;font-size: 28rpx;">我是有底线的</text>
			<view class="line"></view>
		</view>
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';  //require这个js模块    
	export default {
		data() {
			return {
				loginfo:{
					record : false,
					username:'',
					password:''
				},
				coin : {
					number:0,
					gets:[],
					max:5
				}
				,myInvited:[]
				,newMessage : 0
				,qiandao : false
				,upUrl : getApp().globalData.upUrl
				,productList:[1,2,3,4,5,6,7]
			}
		},
		onLoad() {
			//if (!!param.username) this.loginfo.username = param.username;
			this.loginfo = uni.getStorageSync('myAuth') || {};
			if (!!this.loginfo.uid){
				getApp().globalData.myAuth = this.loginfo;
				/*
				this.loginfo.uid = getApp().globalData.myAuth.uid;
				this.loginfo.username = getApp().globalData.myAuth.username;
				this.loginfo.lvl = getApp().globalData.myAuth.lvl;
				this.loginfo.name = getApp().globalData.myAuth.name;
				this.loginfo.avatar = getApp().globalData.myAuth.avatar;
				*/
				//this.getMyInvited();
			}
		},
		onShow(){
			//uni.$emit('upMyAuth',{msg:'页面更新'})
			let that = this;
			this.loginfo = uni.getStorageSync('myAuth') || {};
			this.loginfo.name = getApp().globalData.myAuth.name;
			this.loginfo.avatar = getApp().globalData.myAuth.avatar;
			this.getMyInvited();
			setTimeout(function(){
				that.getNewMessage();
			},1500);
		},
		methods: {
			clickPocket(){
				uni.navigateTo({url: '/pages/member/pocket'});
			},
			clickMessage(){
				uni.navigateTo({url: '/pages/member/message'});
			},
			// 点击个人资料
			clickUserEdit(){
				uni.navigateTo({url: '/pages/member/edit'});
			},
			clickEditSign(){
				uni.navigateTo({url: '/pages/member/sign'});
			},
			clickTuiguang(){
				uni.navigateTo({url: '/pages/member/share'});
				/*
				uni.setClipboardData({
					data: this.upUrl+'h5/#/pages/member/reg?invited='+this.loginfo.username,
					success: function () {
						uni.showToast({
							title: '复制成功'
						});
					}
				});
				*/
			},
			clickLevelup(){
				let _lvl = parseInt(getApp().globalData.myAuth.lvl);
				let _content = _lvl*_lvl*100;
				let that = this;
				uni.showModal({
					title:'会员等级提升',
					content : '提升当前等级需要消耗'+_content+'金币,是否立即升级？',
					success: function (res) {
						if (res.confirm) {
							that.setLevelup();
						}
					},
				})
			},
			clickLogout(){
				uni.showModal({
					content : '是否退出？',
					success: function (res) {
						if (res.confirm) {
							let cur = uni.getStorageSync('myAuth') || {};
							uni.clearStorageSync();
							let login = {};
							login.record = true;
							login.username = cur.username;
							uni.setStorageSync('myAuth',login);
							getApp().globalData.myAuth = {};
							uni.reLaunch({
								url:'/pages/member/index'
							})
						}
					},
				})
			},
			forgetPassword(){
				uni.showToast({
					icon:'none',
					title:'请与管理员联系'
				})
			},
			setLevelup(){
				let that = this;
				utils.get(getApp().globalData.eyUrl+'member/setLevelup').then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						uni.showToast({
							title: '升级成功，请重新登录'
						});
						getApp().globalData.myAuth = {};
						let newinfo = {};
						let loginfo = uni.getStorageSync('myAuth') || {};
						newinfo.username = loginfo.username;
						uni.setStorageSync('myAuth', newinfo);
						uni.reLaunch({
							url : '/pages/member/index'
						})
						return;
					}else if (ret.code == '0'){
						uni.showToast({
							icon : 'none',
							title: ret.msg
						});
						return;
					}
				});
			},			
			getNewMessage(){
				let that = this;
				utils.post(getApp().globalData.eyUrl+'message/getnew',{}).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						that.newMessage = ret.data;
					}
				});
			},
			// 获取已推广的数据
			getMyInvited(){
				let that = this;
				utils.post(getApp().globalData.eyUrl+'member/getinvited',{}).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					if (ret.code == '1'){
						that.myInvited = ret.data;
						if (ret.getcoin.length > 0){
							that.coin.gets = ret.getcoin;
							that.coin.max = that.coin.gets.length;							
						}else{
							that.coin.max = 0;
						}
						if (!!ret.coin) that.coin.number = ret.coin;
					}else if (ret.code == '0'){
						
					}
				});
			},
			// 收取积分
			getCoin(obj){
				if (this.coin.max >= 5){
					uni.showToast({
						icon: 'none',
						title: '今天收取已达5次上限，请明日再来。'
					});
					return;
				}
				
				let that = this;
				let pdata = {};
				pdata = obj;
				utils.post(getApp().globalData.eyUrl+'pocket/getCoin',pdata).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					if (ret.code == '1'){
						that.coin.gets = ret.data;
						that.coin.max = ret.data.length;
						if (!!ret.coin) that.coin.number = ret.coin;
						uni.showToast({title: '已成功收取'});
					}else if (ret.code == '0'){
					}
				});
			},
			// 签到
			setQiandao(){
				let that = this;
				utils.get(getApp().globalData.eyUrl+'signin').then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					if (ret.code == '1'){
						uni.showToast({
						  icon: 'none',
						  title: '今天已完成签到'
						});
						that.qiandao = true;
						if (!!ret.coin) that.coin.number = ret.coin;
					}else if (ret.code == '0'){
					}
				});
			},
			// 解绑
			cancelInvited(obj){
				let that = this;
				let pdata = {};
				pdata = obj;
				uni.showModal({
					content : '是否解绑该用户？',
					success: function (res) {
						if (res.confirm) {
							utils.post(getApp().globalData.eyUrl+'member/cancelinvited',pdata).then(res=>{
								//let res = JSON.parse(_res);
								let ret = res.data;
								if (ret.code == '1'){
									for (var k in that.myInvited){
										if (that.myInvited[k].uid == ret.data){
											that.myInvited.splice(k,1);
											break;
										}
									}
								}else if (ret.code == '0'){
								}
							});
						} else if (res.cancel) {
							
						}
					}					
				});
			},
			agreementSuccess() {
				this.loginfo.record = !this.loginfo.record;
			},

			bindLogin() {
				if (((String(this.loginfo.username).length < 6) || (String(this.loginfo.username).length > 8)) && (String(this.loginfo.username).length != 11)) {
					uni.showToast({
						icon: 'none',
						title: '请输入入6-8位数字帐号或手机号'
					});
					return;
				}
				if (String(this.loginfo.password).length < 6) {
				  uni.showToast({
				    icon: 'none',
				    title: '请输入入6位字符以上的密码'
				  });
				  return;
				}
				utils.post(getApp().globalData.eyUrl+'member/login',this.loginfo).then(res=>{
					//let res = JSON.parse(_res);
					let ret = res.data;
					if (ret.code == '1'){
						ret.data.record = this.loginfo.record;
						//this.loginfo = ret.data;
						getApp().globalData.myAuth = ret.data;
						uni.setStorageSync('myAuth', ret.data);
						uni.showToast({
						  icon: 'none',
						  title: '登录成功'
						});
						uni.reLaunch({
							url: '/pages/member/index'
						});
					}else if (ret.code == '0'){
						uni.showToast({ title: '登录失败', icon: 'error', duration: 1000 });
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 登录 begin : */
	.login {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}
	
	.header {
	  width: 161rpx;
	  height: 161rpx;
	  background: rgba(63, 205, 235, 1);
	  box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
	  border-radius: 50%;
	  margin-top: 30rpx;
	  margin-left: auto;
	  margin-right: auto;
	}
	
	.header image {
	  width: 161rpx;
	  height: 161rpx;
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
	
	.list-call .sl-input {
	  flex: 1;
	  text-align: left;
	  font-size: 32rpx;
	  margin-left: 16rpx;
	}
	
	.button-login {
	  color: #FFFFFF;
	  font-size: 34rpx;
	  width: 470rpx;
	  height: 100rpx;
	  background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
	  box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
	  border-radius: 50rpx;
	  line-height: 100rpx;
	  text-align: center;
	  margin-left: auto;
	  margin-right: auto;
	  margin-top: 100rpx;
	}
	
	.button-hover {
	  background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
	}
	
	.agreement {
	  display: flex;
	  flex-direction: row;
	  justify-content: center;
	  align-items: center;
	  font-size: 30rpx;
	  margin-top: 80rpx;
	  color: #FFA800;
	  text-align: center;
	  height: 40rpx;
	  line-height: 40rpx;
	}
	
	.agreement text {
	  //font-size: 24rpx;
	  margin-left: 15rpx;
	  margin-right: 15rpx;
	}
	.agreement image {
	width: 60rpx;
	height: 60rpx;
	}	
	/* end; */
	.user_header_box{
		height: 340rpx;
		width: 100%;
		background-image: url(../../static/user/head_bg.png);
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: left;
		.avatar_box{
			margin-left: 80rpx;
			.img{
				height: 120rpx;
				width: 120rpx;
				border-radius: 50%;
			}
		}
		.user_info{
			color: #fff;
			margin-left: 20rpx;
			.name{
				
			}
			.uid{
				
			}
		}
	}
	.user_amount_box{
		width: 90%;
		margin: -90rpx auto 0 auto;
		.user_level{
			border-radius: 10rpx 10rpx 0 0;
			background-color: #e2eefe;
			padding: 10rpx 14rpx;
			display: flex;
			align-items: center;
			.icon{
				height: 60rpx;
				width: 60rpx;
			}
			.level_desc_box{
				margin-left: 20rpx;
				.title{
					font-size: 28rpx;
				}
				.desc{
					font-size: 20rpx;
					color: #808080;
				}
			}
			.right_icon{
				height: 26rpx;
				width: 16rpx;
				//margin-left: auto;
				padding-right: 0rpx;
			}
			.right_text{
				margin-left: auto;
				padding-right: 0rpx;
			}
			.right_nav{
				margin-left: 240rpx;
				padding-right: 10rpx;
			}
		}
		.amount_box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			border-radius: 0 0 10rpx 10rpx;
			padding: 40rpx 60rpx;
			.amount{
				font-size: 46rpx;
			}
			.now_with{
				background-color: #ffa415;
				color: #fff;
				padding: 8rpx 30rpx;
				border-radius: 5rpx;
			}
			.now_with2{
				background-color: #a6bedb;
				color: #fff;
				padding: 8rpx 30rpx;
				border-radius: 5rpx;
			}
		}
	}
	.user_tab_box{
		background-color: #fff;
		width: 90%;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		.tab_title{
			font-size: 30rpx;
		}
		.tab_list_box{
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			.list_item{
				width: 25%;
				text-align: center;
				margin: 16rpx 0;
				.icon{
					height: 80rpx;
					width: 80rpx;
				}
				.text{
					color: #666666;
					margin-top: -10rpx;
					font-size: 26rpx;
				}
			}
		}
	}
	.loan_box{
		background-color: #fff;
		width: 90%;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		.loan_title_box{
			display: flex;
			align-items: center;
			padding-top: 6rpx;
			.title{
				font-size: 30rpx;
			}
			.link{
				margin-left: auto;
				color: #797979;
				font-size: 20rpx;
			}
		}
		.loan_list{
			margin-top: 30rpx;
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
						margin-right: 20rpx;
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
	}
	.foot_line{
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 20rpx;
		color: #5f5f5f;
		.line{
			width: 200rpx;
			border-bottom: 1px solid #5f5f5f;
		}
	}
</style>
