<template>
	<view class="container">
		<uni-list>
			<uni-list :border="true">
				<!--<uni-list-chat clickable @click="clickChatList('group',1)" title="这是测试2" avatar="/static/chat.png" note="这是note" time="time"  badge-text="dot"></uni-list-chat>-->
				<!-- 群聊：显示多头像 -->
				<uni-list-chat  v-for="(item,index) in group.room" :key="index" clickable @click="clickChatList('group',item.rid,item.title)"  :title="item.title" avatar="/static/chat.png" :note="(!!group.news[item.rid]) ? (group.news[item.rid].tag=='img') ? '[图片]' : group.news[item.rid].content : ''" time=""  :badge-text="(!!group.news[item.rid] && group.news[item.rid].isnew) ? 'dot': false"></uni-list-chat>
				<!-- 私聊 -->
				
				<uni-list-chat v-for="(item,index) in friend.news" :key="index" clickable @click="clickChatList('friend',item.oid,item.name)"  :avatar-circle="true" :title="item.name" :avatar="upUrl+item.avatar" :note="(item.tag=='img') ? '[图片]' : item.content" :time="item.created_at" :badge-text="item.isnew ? 'dot' : false"></uni-list-chat>
				
			</uni-list>
		</uni-list>
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		data() {
			return {
				myInfo : {},
				group : {room:[],news:{},uinfo:{}},
				friend : {news:[],uinfo:{}},
				localGroupNews : {},
				localFriendNews : {},
				upUrl : '',
				/*
				socketTask:null,
				socketOpen:false,
				socketAuth : {},
				*/
			}
		},
		onLoad(param){
			this.upUrl = getApp().globalData.upUrl;
			this.myInfo = getApp().globalData.myAuth;
			//uni.removeStorageSync('localGroupNews');
		},
		onShow: function() {
			if (!!getApp().globalData.myAuth.uid){
				this.myInfo = getApp().globalData.myAuth;
				/*
				this.socketAuth.uid = getApp().globalData.myAuth.uid;
				this.socketAuth.name = getApp().globalData.myAuth.name;
				this.socketAuth.avatar = getApp().globalData.myAuth.avatar;
				this.socketAuth.v = getApp().globalData.myAuth.v;				
				this.connectScoketInit();
				*/
				this.getRoomList();
			}else{
				uni.switchTab({
					url:'/pages/member/index'
				})
			}
		},
		onHide: function() {
			
		},
		methods: {
			clickChatList(type,id,title){
				uni.navigateTo({
					url:'/pages/chat/chat?type='+type+"&rid="+id+'&title='+title
				})
			},
			getRoomList(){
				let that = this;
				let pdata = {};
				utils.post(getApp().globalData.eyUrl+'chat/getRoom',pdata).then(res=>{
					let ret = res.data;
					
					//uni.clearStorageSync('localGroupNews');
					if (ret.code == '1'){
						that.group.room = (!!ret.group.room) ? ret.group.room : {};
						that.group.uinfo = (!!ret.group.uinfo) ? ret.group.uinfo : {};
						that.group.news = (!!ret.group.news) ? ret.group.news : {};
						if (!!that.group.news){
							// 获取最新的群消息并存入缓存 begin:
							let localGroupNews = uni.getStorageSync('localGroupNews') || {};
							
							for (var k in that.group.news){
								if (localGroupNews.hasOwnProperty(k)){
									localGroupNews[k].isnew = (localGroupNews[k].created_at <= that.group.news[k].created_at) ? true : false;
								}else{
									localGroupNews[k] = {};
									localGroupNews[k].created_at = that.group.news[k].created_at;
									localGroupNews[k].isnew = true;
								}
								that.group.news[k].isnew = localGroupNews[k].isnew;
								
								for (var i in that.group.room){
									if (!!that.group.news[that.group.room[i].rid] && that.group.news[that.group.room[i].rid].isnew == true){
										that.group.room[i].isnew = true;
										break;
									}else{
										that.group.room[i].isnew = false;
									}
								}
							}
							uni.setStorageSync('localGroupNews',localGroupNews);
							that.group.room.sort(utils.compare('isnew','-'));
						}
						// end;			
						
						// 获取最新的联系人消息并存入缓存 begin:
						//uni.removeStorageSync('localFriendNews');
						//that.friend.news = (!!ret.friend.news) ? ret.friend.news : {};
						//that.friend.uinfo = (!!ret.friend.uinfo) ? ret.friend.uinfo : {};
						if (!!ret.friend.news){
							that.friend.news = [];
							//that.friend = ret.friend;							
							let localFriendNews = uni.getStorageSync('localFriendNews') || {};
							let oid ;
							for (let k in ret.friend.news){
								if (localFriendNews.hasOwnProperty(k)){
									localFriendNews[k].isnew = (localFriendNews[k].created_at <= ret.friend.news[k].created_at) ? true : false;
								}else{
									localFriendNews[k] = {};
									localFriendNews[k].created_at = ret.friend.news[k].created_at;
									localFriendNews[k].isnew = true;
								}
								oid = (ret.friend.news[k].uid == that.myInfo.uid) ? ret.friend.news[k].fid : ret.friend.news[k].uid;
								ret.friend.news[k].isnew = localFriendNews[k].isnew;
								ret.friend.news[k].oid = oid;
								ret.friend.news[k].name = ret.friend.uinfo[oid].name;
								ret.friend.news[k].avatar = ret.friend.uinfo[oid].avatar;
								that.friend.news.push(ret.friend.news[k]);
							}
							that.friend.news.sort(utils.compare('isnew','-'));							
							//console.log("that.friend=>",that.friend,that.myInfo);
							uni.setStorageSync('localFriendNews',localFriendNews);
						}
						// end;
						
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

<style>
.chat-custom-right {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
}

.chat-custom-text {
	font-size: 12px;
	color: #999;
}
</style>
