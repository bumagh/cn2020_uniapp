<template>
  <view class="content">
	  <!--
    <view class="header">
      <image src="../../static/shilu-login/logo.png"></image>
    </view>
	-->

    <view class="list">
      <view class="list-call">
        <image class="img" src="/static/phone.png"></image>
        <input class="sl-input" v-model="reg.username" type="number" maxlength="11" placeholder="注册帐号" />
      </view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/2.png"></image>
        <input class="sl-input" v-model="reg.password" type="text" maxlength="32" placeholder="登录密码" :password="!reg.showPassword" />
        <image class="img" :src="reg.showPassword?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display"></image>
      </view>
	  <!--
      <view class="list-call">
        <image class="img" src="/static/shilu-login/3.png"></image>
        <input class="sl-input" v-model="code" type="number" maxlength="4" placeholder="验证码" />
        <view class="yzm" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
      </view>
	  -->
      <view class="list-call">
        <image class="img" src="/static/shilu-login/4.png"></image>
        <input class="sl-input" v-model="reg.invite" type="number" maxlength="11" placeholder="邀请码" />
      </view>
	  <!--
      <view class="list-call">
        <image class="img" src="/static/phone.png"></image>
        <input class="sl-input" v-model="reg.phone" type="number" maxlength="11" placeholder="绑定手机号方便登录,并可找回密码" />
      </view>
	  -->
    </view>

    <view class="button-login" hover-class="button-hover" @tap="bindLogin">
      <text>注册</text>
    </view>

	<view class="agreement">
      <navigator url="/pages/member/index" open-type="switchTab">去登录</navigator>
    </view>


  </view>
</template>

<script>
//  var _this, js;
  import * as utils from '@/common/util.js';  //require这个js模块    
  export default {
   data() {
      return {
				reg:{
					username: '',
					password: '',
					invite: '',
					phone : '',
					showPassword: false
				},
			}
    }
    ,onLoad(param) {
		//this.reg.username = this.createUserName(100000,99999999);
		this.reg.username = '';
		// 解析推广链接，把推广人的ID写入注册中
		if (!!param.invited)
			this.reg.invite = param.invited;
		else
			this.reg.invite = this.reg.username;
    },
    onUnload() {
     // clearInterval(js)
      //this.second = 0;
	  
    }
    ,computed: {
		/*
      yanzhengma() {
        if (this.second == 0) {
          return '获取验证码';
        } else {
          if (this.second < 10) {
            return '重新获取0' + this.second;
          } else {
            return '重新获取' + this.second;
          }
        }
      }
	  */
    },
    onUnload() {
      this.clear()
    },
    methods: {
		createUserName(min,max){
			return Math.floor(Math.random() * (max - min)) + min;
		},
      clear(){
       // clearInterval(js)
       // js = null
       // this.second = 0
      },
      display() {
        this.reg.showPassword = !this.reg.showPassword
      },
	/*
      agreementSuccess() {
        this.agreement = !this.agreement;
      },
      getcode() {
        if (this.reg.username.length != 11) {
          uni.showToast({
            icon: 'none',
            title: '帐号不正确，请重输。'
          });
          return;
        }
        if (this.second > 0) {
          return;
        }
        this.second = 60;
        //请求业务
        js = setInterval(function() {
          _this.second--;
          if (_this.second == 0) {
            _this.clear()
          }
        }, 1000)
        // uni.request({
        //   url: 'httpgetcode.html', //仅为示例，并非真实接口地址。
        //   data: {
        //     phone: this.phone,
        //     type: 'reg'
        //   },
        //   method: 'POST',
        //   dataType: 'json',
        //   success: (res) => {
        //     if (res.data.code != 200) {
        //       uni.showToast({
        //         title: res.data.msg,
        //         icon: 'none'
        //       });
        //     } else {
        //       uni.showToast({
        //         title: res.data.msg
        //       });
        //       js = setInterval(function() {
        //         _this.second--;
        //         if (_this.second == 0) {
        //           _this.clear()
        //         }
        //       }, 1000)
        //     }
        //   },
        //   fail() {
        //     this.second == 0
        //   }
        // });
      },
	  */
      bindLogin() {
		/*
        if (this.agreement == false) {
          uni.showToast({
            icon: 'none',
            title: '请先阅读《软件用户协议》'
          });
          return;
        }
		*/
		//console.log("this.reg=>",this.reg,'|',this.reg.username,"|",String(this.reg.username).length);
		/*
        if ((String(this.reg.username).length < 6) || (String(this.reg.username).length > 8)) {
			uni.showToast({
				icon: 'none',
				title: '请输入入6-8位数字帐号'
			});
			return;
        }
        if (this.reg.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: '请输入入6位字符以上的密码'
          });
          return;
        }
		*/
	    if (String(this.reg.username).length !=11){
			uni.showToast({
				icon: 'none',
				title: '请输入正确手机号码'
			 });
			 return;
		}
		
		if (this.reg.phone != ''){
			if (String(this.reg.phone).length != 11){
			  uni.showToast({
				icon: 'none',
				title: '请输入正确手机号码'
			  });
			  return;				
			}
		}
		utils.post(getApp().globalData.eyUrl+'member/reg',this.reg).then(res=>{
			//let res = JSON.parse(_res);
			let ret = res.data;
			console.log("ret=>",res);
			if (ret.code == '1'){
				uni.showToast({
				  icon: 'none',
				  title: '注册成功，请登录'
				});
				uni.setStorageSync('myAuth', ret.data);
				setTimeout(function() {
				  //uni.navigateBack();
				  uni.switchTab({
				  	url:'/pages/member/index'
				  })
				}, 1500)
			}else{
				if (!!ret.msg){
					for (var k in ret.msg){
						uni.showToast({
							icon: 'none',
							title: ret.msg[k]
						})
					}
				}
				
			}
		});
					  
		/*
        if (this.code.length != 4) {
          uni.showToast({
            icon: 'none',
            title: '验证码不正确'
          });
          return;
        }
        uni.request({
          url: 'httpreg.html',
          data: {
            phone: this.phone,
            password: this.reg.password,
            code: this.code,
            reg.invite: this.reg.invite
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            if (res.data.code != 200) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: res.data.msg
              });
              setTimeout(function() {
                uni.navigateBack();
              }, 1500)
            }
          }
        });
		*/
      }
    }
  }
</script>

<style>
  .content {
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

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
    line-height: 100rpx;
    background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
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

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }
</style>
