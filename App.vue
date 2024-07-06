<script>
	export default {
        globalData: {  
			accessTag : ''
			,myAuth:{}
			// 公网测试
			,socket : 'wss://websocket.demo.yuyaoit.cn'						
			,upUrl : 'https://app.yuyaoit.cn/'
			,eyUrl : 'https://app.yuyaoit.cn/api/'
			// 本地测试
			//,socket : 'ws://0.0.0.0:11000'
			//,upUrl : 'http://local.project.ey56:8888/'
			//,eyUrl : 'http://local.project.ey56:8888/api/'
			//,upUrl : 'http://192.168.1.6:8888/'
			//,eyUrl : 'http://192.168.1.6:8888/api/'
			,page : {}
			,actMenu: [
					{
						route : '/pages/index/index',
						iconPath: '/static/home.png',
						text: '首页',
					},
					{
						route : '/pages/chat/index',
						iconPath: '/static/chat.png',
						text: '聊天',
					},
					{
						route : '/pages/game/jump',
						iconPath: '/static/game_icon.png',
						text: '游戏',
					},
					{
						route : '/pages/member/index',
						iconPath: '/static/setting.png',
						text: '个人中心',
					}
				]
        },
		onLaunch: function() {
			uni.getSystemInfo({
				success:res=>{
					//console.log(' getSystemInfo=>',res);
					this.globalData.accessTag = res.deviceId;
					this.globalData.page.height = res.windowHeight;
					this.globalData.page.width = res.windowWidth;
				}
			})
			//uni.clearStorage()
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}
 
	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
