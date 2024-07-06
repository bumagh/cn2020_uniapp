<template>
	<view class="container">
		<!--
		<uni-section v-if="login" title="请点击右角上铵钮分享"  type="line">
		<uni-card style="background-color: wheat;">
			<view><text class="uni-h6">您的推广链接：</text></view>
			<uni-link :href="shareInfo.url" :text="shareInfo.content"></uni-link>
		</uni-card>
		</uni-section>
		-->
<uni-section v-if="login" title="请点击右角上铵钮分享"  type="line">
			<uni-card :title="shareInfo.title" extra="">
				<text class="uni-body">{{shareInfo.content}}</text>
			</uni-card>
			<!--<tki-qrcode cid="qrcode1" ref="qrcode" :val="qr.val" :size="qr.size" :unit="qr.unit" :background="qr.background" :foreground="qr.foreground" :pdground="qr.pdground" :icon="qr.icon" :iconSize="qr.iconsize" :lv="qr.lv" :onval="qr.onval" :loadMake="qr.loadMake" :usingComponents="true" @result="qrR" />-->
			<!--<button type="primary" @tap="saveQrcode">图片保存到本地</button>-->
			<uni-card style="background-color: wheat;margin: 20rpx;" isFull="true">
				<view><text class="uni-h6">在微信登录的，可直接右上角转发推广，如果您是桌面APP登录，可截屏到微信读取二维码。推广注册后可以每天领取金币。</text></view>
			</uni-card>
			<button  type="primary"  @tap="setCopyUrl()">复制链接</button>
			<view class="qrimg">
				<view class="qrimg-i">
				<image style="text-align:center;width: 200px; height: 200px; background-color: #eeeeee;"
					show-menu-by-longpress="true"
					:src="qr.src"
					@error="imageError">
				</image>
				</view>
			</view>
</uni-section>
			<uni-card v-else :title="shareInfo.title" extra="">
				<text class="uni-body">{{shareInfo.content}}</text>
				<view style="padding:20px;"><uni-link showUnderLine="false" font-size="20" :href="shareInfo.url" text="马上注册" color="blue"></uni-link></view>
			</uni-card>
	</view>
</template>

<script>
	//import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import * as utils from '@/common/util.js';	
	export default {
		data() {
			return {
				login : false,
				shareInfo:{},
				qr: {
					src : '/static/qr.png'
				}
				/*
				qr : {
					val: '二维码', // 要生成的二维码值
					size: 200, // 二维码大小
					unit: 'upx', // 单位
					background: '#b4e9e2', // 背景色
					foreground: '#309286', // 前景色
					pdground: '#32dbc6', // 角标色
					icon: '', // 二维码图标
					iconsize: 40, // 二维码图标大小
					lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
					onval: false, // val值变化时自动重新生成二维码
					loadMake: true, // 组件加载完成后自动生成二维码
					src: '/static/c1.png' // 二维码生成后的图片地址或base64
				}
				*/
			}
		},
		onLoad(param){
			if (!!param.uid){
				this.getShareinfo(param.uid);
				//this.shareInfo = JSON.parse(decodeURIComponent(param.e));
			}
			let myAuth = getApp().globalData.myAuth;
			if (!!myAuth.uid){
				this.login =true;
			}else{
				this.login = false;
			}
		},
		onShow(){
		},
		components: {
			// tkiQrcode
		},
		methods: {
			saveQrcode(){
				uni.saveFile({
				  tempFilePath: '/static/qr.png',
				  success: function (res) {
					var savedFilePath = res.savedFilePath;
				  }
				});
			},
			/*
			saveQrcode() {
				this.$refs.qrcode._saveCode()
			},
			qrR(res) {
				this.src = res
			},
			*/
			setCopyUrl(){
				uni.setClipboardData({
					data: getApp().globalData.upUrl+'h5/#/pages/member/index',
					success: function () {
						uni.showToast({
							title:'复制成功'
						})
					}
				});
			},
			getShareinfo(uid){
				let that = this;
				let pdata = {};
				pdata.uid = uid;
				utils.post(getApp().globalData.eyUrl+'share/getData',pdata).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						that.shareInfo = ret.data;
						that.seRenderShow();
					}else if (ret.code == '0'){
						uni.showToast({
							title:ret.msg
						})
					}
				});
			},
			seRenderShow(){
				let that = this;
				if (!!this.shareInfo.url){
					uni.setNavigationBarTitle({
						title: this.shareInfo.title,
					});
					if (this.login==false){
						//#ifdef H5
						setTimeout(function(){
							window.location.href=that.shareInfo.url;
						},12000);
						//#endif
					}
				}
			},
		}
	}
</script>

<style>
.uni-body{font-size:32rpx;}
.qrimg {
	display: flex;
	justify-content: center;
}
.qrimg-i{
	margin-right: 10px;
}
</style>
