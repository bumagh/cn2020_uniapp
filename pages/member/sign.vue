<template>
  <view class="content">
    <view class="list">
	  <view class="list-call">
        个人广告：
		<input class="sl-input" v-model="member.sign" type="text" placeholder="请输入个人广告" />
        <!--<textarea  v-model="member.intro"  placeholder="请输入个人简介" />-->
      </view>
    </view>
  </view>
  <button type="primary" @tap="editProfile">修 改</button>
</template>

<script>
//  var _this, js;
  import * as utils from '@/common/util.js';  //require这个js模块    
  export default {
   data() {
      return {
				member:{}
				,upUrl : getApp().globalData.upUrl
			}
    }
    ,onShow() {
		let that = this;		
		let auth = uni.getStorageSync('myAuth') || {};
		if (Object.keys(auth).length < 1){
			uni.switchTab({
				url:'/pages/member/index'
			})
		}else{
			this.getMemberInfo();
		}
    },
    methods: {
		upMyAuth(ary){
			for (var k in ary){
				getApp().globalData.myAuth[k] = ary[k];
			}
			uni.setStorageSync('myAuth',getApp().globalData.myAuth);
		},
		getMemberInfo(){
			let that = this;
			utils.get(getApp().globalData.eyUrl+'member/getProfile').then(res=>{
				let ret = res.data;
				//console.log('myInfo=>',ret.data)
				if (ret.code == '1'){
					that.member = ret.data;
					uni.setStorageSync('myInfo', ret.data);
				}else{
					uni.showToast({
						icon: 'none',
						title: ret.msg
					})
				}
			});
		},
      editProfile() {
        if ((String(this.member.sign).length < 2) || (String(this.member.sign).length > 100)) {
			uni.showToast({
				icon: 'none',
				title: '个人广告不符合规范'
			});
			return;
        }
		let that = this;
		utils.post(getApp().globalData.eyUrl+'member/setProfile',this.member).then(res=>{
			//let res = JSON.parse(_res);
			let ret = res.data;
			if (ret.code == '1'){
				uni.showToast({
				  icon: 'none',
				  title: '个人资料修改成功'
				});
				var _t = {};
				_t.sign = that.member.sign;
				that.upMyAuth(_t);
				setTimeout(function() {
				  uni.navigateBack();
				}, 1500)
			}else{
				uni.showToast({
					icon: 'none',
					title: ret.msg
				})
			}
		});
      }
    }
  }
</script>

<style>
	button{margin:20px;}
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .header {
    width: 161rpx;
    height: 161rpx;
    /*background: rgba(63, 205, 235, 1);
    box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);*/
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
    font-size: 28rpx;
    margin-left: 16rpx;
	color: #18282b;
  }

  .yzm {
    color: #FF7D13;
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border: 1rpx solid #FFA800;
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }
</style>
