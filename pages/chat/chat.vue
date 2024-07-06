<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view  class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory" upper-threshold="500">
			<!--<scroll-view  scroll-y="true" class="scroll-Y">-->
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="scrollAnimation">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
					<!-- 用户消息 -->
					<block v-if="row.type=='user'">
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.msg.userinfo.uid==socketAuth.uid">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.tag=='text'" class="bubble" @tap="showTextTools(row.msg)">
									<rich-text @itemclick="showTextTools(row.msg)" :nodes="row.msg.content"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.tag=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="upUrl+row.msg.content" style="width:200px;height:100px;"></image>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="upUrl+row.msg.userinfo.avatar"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.uid!=socketAuth.uid">
							<!-- 左-头像 -->
							<view class="left"   @tap="onClickFriend(row.msg.userinfo)">
								<image :src="upUrl+row.msg.userinfo.avatar"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{row.msg.userinfo.name}}</view> <view class="time">{{row.msg.created_at}}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.tag=='text'" class="bubble" @tap="showTextTools(row.msg)">
									<rich-text @itemclick="showTextTools(row.msg)" :nodes="row.msg.content"></rich-text>
								</view>
								
								<!-- 图片消息 -->
								<view v-if="row.msg.tag=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="upUrl+row.msg.content" style="width:200px;height:100px;"></image>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!--聊天群右侧抽屉栏-->
		<uni-drawer ref="showRight" mode="right" :width="260">
			<view class="scroll-view">
				<scroll-view class="scroll-view-box" scroll-y="true">
					<view class="close">
						<button @click="closeSetting('showRight')"><text class="word-btn-white">关闭</text></button>
					</view>
					<uni-grid :column="3" :showBorder="false"  :highlight="true" @change="onClickMember">
						<uni-grid-item v-for="(item, index) in member" :index="index" :key="index">
							<view class="grid-item-box">
								<image :src="upUrl+item.avatar" class="image" mode="scaleToFill" />
								<text class="text">{{item.name}}</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
		</uni-drawer>
		<!--聊天群点击用户头像-->
		<uni-drawer ref="showFriendDetail" mode="right" :width="260">
		  <view class="header" >
		    <image :src="upUrl+memberOne.avatar"></image>
		  </view>
		  <view class="list">
		    <view class="list-call">
		      用户昵称：{{memberOne.name}}
		    </view> 
		  </view>
			<button style="margin: 20px;" type="primary" @tap="setFriendChat(memberOne)">私 聊</button>
			<button v-if="fids.indexOf(memberOne.uid)<0" style="margin: 20px;" type="primary" plain="true" @tap="setFriendAdd(memberOne)" >加为好友</button>
		</uni-drawer>
		<!-- 底部抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 --> 
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'/static/HM-chat/emoji/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<!--
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
					<view class="box" @tap="handRedEnvelopes"><view class="icon hongbao"></view></view>
					-->
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<!--
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			-->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode"  :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus"/>
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<!--
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			-->
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<!--
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		-->
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image src="/static/chat.png"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>
<script>
	import * as utils from '@/common/util.js';
	export default {
		data() {
			return {
				socketTask:null,
				socketOpen:false,
				socketAuth : {},
				upUrl : '',
				init : false,
				member : [],
				memberOne : {},
				fids : [],
				//文字消息
				textMsg:'',
				//消息列表
				isHistoryLoading:false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				msgImgList:[],
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				//RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
				
				//播放语音相关参数
				AUDIO:uni.createInnerAudioContext(),
				playMsgid:null,
				VoiceTimer:null,
				// 抽屉参数
				popupLayerClass:'',
				// more参数
				hideMore:true,
				//表情定义
				hideEmoji:true,
				emojiList:[
					[{"url":"100.gif",alt:"[微笑]"},{"url":"101.gif",alt:"[伤心]"},{"url":"102.gif",alt:"[美女]"},{"url":"103.gif",alt:"[发呆]"},{"url":"104.gif",alt:"[墨镜]"},{"url":"105.gif",alt:"[哭]"},{"url":"106.gif",alt:"[羞]"},{"url":"107.gif",alt:"[哑]"},{"url":"108.gif",alt:"[睡]"},{"url":"109.gif",alt:"[哭]"},{"url":"110.gif",alt:"[囧]"},{"url":"111.gif",alt:"[怒]"},{"url":"112.gif",alt:"[调皮]"},{"url":"113.gif",alt:"[笑]"},{"url":"114.gif",alt:"[惊讶]"},{"url":"115.gif",alt:"[难过]"},{"url":"116.gif",alt:"[酷]"},{"url":"117.gif",alt:"[汗]"},{"url":"118.gif",alt:"[抓狂]"},{"url":"119.gif",alt:"[吐]"},{"url":"120.gif",alt:"[笑]"},{"url":"121.gif",alt:"[快乐]"},{"url":"122.gif",alt:"[奇]"},{"url":"123.gif",alt:"[傲]"}],
					[{"url":"124.gif",alt:"[饿]"},{"url":"125.gif",alt:"[累]"},{"url":"126.gif",alt:"[吓]"},{"url":"127.gif",alt:"[汗]"},{"url":"128.gif",alt:"[高兴]"},{"url":"129.gif",alt:"[闲]"},{"url":"130.gif",alt:"[努力]"},{"url":"131.gif",alt:"[骂]"},{"url":"132.gif",alt:"[疑问]"},{"url":"133.gif",alt:"[秘密]"},{"url":"134.gif",alt:"[乱]"},{"url":"135.gif",alt:"[疯]"},{"url":"136.gif",alt:"[哀]"},{"url":"137.gif",alt:"[鬼]"},{"url":"138.gif",alt:"[打击]"},{"url":"139.gif",alt:"[bye]"},{"url":"140.gif",alt:"[汗]"},{"url":"141.gif",alt:"[抠]"},{"url":"142.gif",alt:"[鼓掌]"},{"url":"143.gif",alt:"[糟糕]"},{"url":"144.gif",alt:"[恶搞]"},{"url":"145.gif",alt:"[什么]"},{"url":"146.gif",alt:"[什么]"},{"url":"147.gif",alt:"[累]"}],
					[{"url":"148.gif",alt:"[看]"},{"url":"149.gif",alt:"[难过]"},{"url":"150.gif",alt:"[难过]"},{"url":"151.gif",alt:"[坏]"},{"url":"152.gif",alt:"[亲]"},{"url":"153.gif",alt:"[吓]"},{"url":"154.gif",alt:"[可怜]"},{"url":"155.gif",alt:"[刀]"},{"url":"156.gif",alt:"[水果]"},{"url":"157.gif",alt:"[酒]"},{"url":"158.gif",alt:"[篮球]"},{"url":"159.gif",alt:"[乒乓]"},{"url":"160.gif",alt:"[咖啡]"},{"url":"161.gif",alt:"[美食]"},{"url":"162.gif",alt:"[动物]"},{"url":"163.gif",alt:"[鲜花]"},{"url":"164.gif",alt:"[枯]"},{"url":"165.gif",alt:"[唇]"},{"url":"166.gif",alt:"[爱]"},{"url":"167.gif",alt:"[分手]"},{"url":"168.gif",alt:"[生日]"},{"url":"169.gif",alt:"[电]"},{"url":"170.gif",alt:"[炸弹]"},{"url":"171.gif",alt:"[刀子]"}],
					[{"url":"172.gif",alt:"[足球]"},{"url":"173.gif",alt:"[瓢虫]"},{"url":"174.gif",alt:"[翔]"},{"url":"175.gif",alt:"[月亮]"},{"url":"176.gif",alt:"[太阳]"},{"url":"177.gif",alt:"[礼物]"},{"url":"178.gif",alt:"[抱抱]"},{"url":"179.gif",alt:"[拇指]"},{"url":"180.gif",alt:"[贬低]"},{"url":"181.gif",alt:"[握手]"},{"url":"182.gif",alt:"[剪刀手]"},{"url":"183.gif",alt:"[抱拳]"},{"url":"184.gif",alt:"[勾引]"},{"url":"185.gif",alt:"[拳头]"},{"url":"186.gif",alt:"[小拇指]"},{"url":"187.gif",alt:"[拇指八]"},{"url":"188.gif",alt:"[食指]"},{"url":"189.gif",alt:"[ok]"},{"url":"190.gif",alt:"[情侣]"},{"url":"191.gif",alt:"[爱心]"},{"url":"192.gif",alt:"[蹦哒]"},{"url":"193.gif",alt:"[颤抖]"},{"url":"194.gif",alt:"[怄气]"},{"url":"195.gif",alt:"[跳舞]"}],
					[{"url":"196.gif",alt:"[发呆]"},{"url":"197.gif",alt:"[背着]"},{"url":"198.gif",alt:"[伸手]"},{"url":"199.gif",alt:"[耍帅]"},{"url":"200.png",alt:"[微笑]"},{"url":"201.png",alt:"[生病]"},{"url":"202.png",alt:"[哭泣]"},{"url":"203.png",alt:"[吐舌]"},{"url":"204.png",alt:"[迷糊]"},{"url":"205.png",alt:"[瞪眼]"},{"url":"206.png",alt:"[恐怖]"},{"url":"207.png",alt:"[忧愁]"},{"url":"208.png",alt:"[眨眉]"},{"url":"209.png",alt:"[闭眼]"},{"url":"210.png",alt:"[鄙视]"},{"url":"211.png",alt:"[阴暗]"},{"url":"212.png",alt:"[小鬼]"},{"url":"213.png",alt:"[礼物]"},{"url":"214.png",alt:"[拜佛]"},{"url":"215.png",alt:"[力量]"},{"url":"216.png",alt:"[金钱]"},{"url":"217.png",alt:"[蛋糕]"},{"url":"218.png",alt:"[彩带]"},{"url":"219.png",alt:"[礼物]"},]				
				],
				//红包相关参数
				windowsState:'',
				redenvelopeData:{
					rid:null,	//红包ID
					from:null,
					face:null,
					blessing:null,
					money:null
				}
			};
		},
		onLoad(param) {
			//console.log("param=>",JSON.stringify(param));
			let  _param = JSON.parse(JSON.stringify(param));
			//console.log("param=>",_param);
			let rid = 0;
			rid = parseInt(_param.rid);
			/*
			if  (_param.type == 'group'){
				rid = parseInt(_param.rid);
			}else if (_param.type == 'friend'){
				rid = parseInt(_param.fid);
			}
			*/
			if (rid>0){
				this.socketAuth.type = _param.type;
				this.socketAuth.rid = rid;
				this.socketAuth.key = 'ey56';
				this.socketAuth.uid = getApp().globalData.myAuth.uid;
				this.socketAuth.lvl = getApp().globalData.myAuth.lvl;
				this.socketAuth.username = getApp().globalData.myAuth.username;
				this.socketAuth.v = getApp().globalData.myAuth.v;
				this.socketAuth.name = getApp().globalData.myAuth.name;
				this.socketAuth.avatar = getApp().globalData.myAuth.avatar;
				
				this.upUrl = getApp().globalData.upUrl;
				let title = (!!_param.title) ? _param.title : ((_param.type=='group') ? '群聊' : '私聊');
				uni.setNavigationBarTitle({
					title: title
				});
				this.fids = uni.setStorageSync('fids') || [];
			}else{
				uni.switchTab({
					url:'/pages/chat/index'
				})
			}
			/*
			this.getMsgList();
			//语音自然播放结束
			this.AUDIO.onEnded((res)=>{
				this.playMsgid=null;
			});
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e)=>{
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e)=>{
				this.recordEnd(e);
			})
			// #endif
			*/
		},
		onShow(){
			this.scrollTop = 9999999;
			this.connectScoketInit();
			
			//this.getMsgList();
			/*
			let that = this;
			setTimeout(function(){
				//console.log('onShow=>'+JSON.stringify(that.msgList));
			},500);
			*/
		   //this.msgList = [{type:'user',msg:{content:'test',tag:'text',userinfo:{uid:1,name:'电工',avatar:'/images/13.png'}}},{type:'user',msg:{content:'test2222',tag:'text',userinfo:{uid:2,name:'电工2',avatar:'/images/13.png'}}}];
		},
		// 右上角点击事件
		onNavigationBarButtonTap(e){
			//console.log("右上角点击事=>"+e);
			let that = this;
			let pdata = {};
			pdata = this.socketAuth;
			utils.post(getApp().globalData.eyUrl+'chat/getMember',pdata).then(res=>{
				let ret = res.data;
				if (ret.code == '1'){
					that.member = ret.data;
					that.$refs['showRight'].open();
					//console.log("onNavigationBarButtonTap=>",e);
				}
			});
		},
		/*
		onHide: function() {
			uni.closeSocket({  
				code:1000,  
				reason:'App Hide'  
			})  
			console.log('onHide=》销毁SOCKET');			
		},		
		beforeDestroy() {
		   this.closeSocket()
		   console.log('beforeDestroy=》销毁SOCKET');
		},
		*/
		methods:{
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
			onClickFriend(uinfo){
				if (this.socketAuth.type == 'group'){
					this.memberOne = uinfo;
					this.$refs['showFriendDetail'].open();
				}
			},
			
			setFriendChat(uinfo){
				if (uinfo.uid == this.socketAuth.uid){
					uni.showToast({
						icon:'none',
						title: '不能跟自己对话'
					});
					return;
				}
				uni.redirectTo({
					url:'/pages/chat/chat?type=friend&rid='+uinfo.uid+'&title='+uinfo.name
				})
			},
			
			onClickMember(e){
				let index = e.detail.index;
				if (this.member[index].uid == this.socketAuth.uid){
					/*
					uni.showToast({
						icon:'none',
						title: '不能跟自己对话'
					});
					return;
					*/
				   return;
				}
				/*
				uni.redirectTo({
					url:'/pages/chat/chat?type=friend&rid='+this.member[index].uid+'&title='+this.member[index].name
				})
				*/
			   this.$refs['showRight'].close();
			   this.onClickFriend(this.member[index]);
			},
			closeSetting(e) {
				this.$refs['showRight'].close();
			},
			connectScoketInit(){
				let that = this;
				this.socketTask = uni.connectSocket({
					url:getApp().globalData.socket,
					success(data) {
						//console.log("websocket链接成功")
					}
				})

				this.socketTask.onOpen((res)=>{
					//console.log("websocket链接正常打开在……");
					this.socketOpen = true;
					
					let pdata = {};
					pdata.auth = this.socketAuth;
					pdata.act = 'login';
					this.socketTask.send({
						data:JSON.stringify(pdata),
						async successs(){
						  console.log("消息发送成功");
						}
					})
					
					this.socketTask.onMessage(function(res){
						let ret = JSON.parse(res.data);
						that.init = true;
						if (ret.retAct == 'retLogin'){
							//console.log("retLogin...ok");
							that.getMsgList();
						}else if (ret.retAct == 'retChat'){
							let chatitem = {};
							chatitem.type = 'user';
							chatitem.msg = ret.data;
							chatitem.msg.id = ret.data.id.toString();
							that.screenMsg(chatitem);							
						}else{
							//console.log("什么都没有ret=>",ret);
						}
						//_this.title=res.data
					})
				})
				this.socketTask.onClose(function(){
					console.log("close")
				})
			},
			closeSocket(){
				this.socketTask.close({
					success(res) {
						this.socketOpen=false
						console.log("主动关闭成功------",res)
					},
					fail(err) {
						console.log("关闭失败",err)
					}
				})
			},
			// 接受消息(筛选处理)
			screenMsg(chatitem){
				//从长连接处转发给这个方法，进行筛选处理
				if(chatitem.type=='system'){
					// 系统消息
					switch (chatitem.msg.tag){
						case 'text':
							this.addSystemTextMsg(chatitem);
							break;
						case 'redEnvelope':
							this.addSystemRedEnvelopeMsg(chatitem);
							break;
					}
				}else if(chatitem.type=='user'){
					// 用户消息
					switch (chatitem.msg.tag){
						case 'text':
							this.addTextMsg(chatitem);
							break;
						case 'voice':
							this.addVoiceMsg(chatitem);
							break;
						case 'img':
							this.addImgMsg(chatitem);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(chatitem);
							break;
					}
					//非自己的消息震动
					if(chatitem.msg.userinfo.uid!=this.socketAuth.uid){
						uni.vibrateLong();
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg'+chatitem.msg.id
				});
			},
			
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){
				//console.log("loadHistory=>"+e);
				if(this.isHistoryLoading){
					return ;
				}
				if (this.init == true){
					this.init = false;
					return;
				}
				
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				let Viewid = this.msgList[0].msg.id;//记住第一个信息ID
				let list = [];
				let that = this;
				let pdata = {};
				pdata.type = that.socketAuth.type;
				pdata.rid = that.socketAuth.rid;
				pdata.id = Viewid;
				utils.post(getApp().globalData.eyUrl+'chat/getData',pdata).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						let _t = {};
						for (let i in ret.data){
							_t = {};
							_t.type = 'user';
							_t.msg = ret.data[i];
							_t.msg.userinfo = ret.member[_t.msg.uid];
							list.push(_t);
						}
						
						setTimeout(()=>{
							// 获取消息中的图片,并处理显示尺寸
							for(let i=0;i<list.length;i++){
								if(list[i].type=='user'&&list[i].msg.tag=="img"){
									list[i].msg.content = that.setPicSize(list[i].msg.content);
									
									let _images = that.upUrl+list[i].msg.content.replace('/thumb/','/image/');
									that.msgImgList.unshift(_images);
									
									
									
								}else if(list[i].type=='user'&&list[i].msg.tag=="text"){
									list[i].msg.content = that.replaceEmoji(list[i].msg.content);
								}
								//list[i].msg.id = Math.floor(Math.random()*1000+1);
								that.msgList.unshift(list[i]);
							}
							
							//console.log("Viewid=>",Viewid);
							
							//这段代码很重要，不然每次加载历史数据都会跳到顶部
							that.$nextTick(function() {
								that.scrollToView = 'msg'+Viewid;//跳转上次的第一行信息位置
							//	that.scrollAnimation = true;
								that.$nextTick(function() {
							//		that.scrollAnimation = false;//恢复滚动动画
								});
								
							});
							
							that.isHistoryLoading = (list.length<15) ? true : false;
							
						},500)
						
						
						
					}
				});
			},
			// 加载初始页面消息
			getMsgList(){
				let that = this;
				let pdata = {};
				pdata.type = that.socketAuth.type;
				pdata.rid = that.socketAuth.rid;
				utils.post(getApp().globalData.eyUrl+'chat/getData',pdata).then(res=>{
					let ret = res.data;
					if (ret.data.length == 0){
						that.scrollAnimation = false;
						return;
					}
					
					/*
					console.log("ret=>"+JSON.stringify(ret));
					that.msgList = [{type:'user',msg:{content:'test',tag:'text',userinfo:{uid:1,name:'电工',avatar:'/images/13.png'}}},{type:'user',msg:{content:'test2222',tag:'text',userinfo:{uid:2,name:'电工2',avatar:'/images/13.png'}}}];
					
					that.$nextTick(function() {
						that.msgList = [{type:'user',msg:{content:'test',tag:'text',userinfo:{uid:1,name:'电工',avatar:'/images/13.png'}}},{type:'user',msg:{content:'test2222',tag:'text',userinfo:{uid:2,name:'电工2',avatar:'/images/13.png'}}}];
					});
					return;
					*/
					
					
					if (ret.code == '1'){
						if (that.init == true){
							//console.log(JSON.stringify(ret));
							if (pdata.type == 'group'){
								let localGroupNews = uni.getStorageSync('localGroupNews') || [];
								if (!!localGroupNews[pdata.rid]){
								}else{
									localGroupNews[pdata.rid] = {};
								}
								localGroupNews[pdata.rid].created_at = ret.date;
								uni.setStorageSync('localGroupNews',localGroupNews);
							}else if (pdata.type == 'friend'){
								let localFriendNews = uni.getStorageSync('localFriendNews') || {};
								if (!!localFriendNews[pdata.rid]){
								}else{
									localFriendNews[pdata.rid] = {};
								}
								localFriendNews[pdata.rid].created_at = ret.date;
								//console.log("localFriendNews=>"+JSON.stringify(localFriendNews));
								uni.setStorageSync('localFriendNews',localFriendNews);
							}
						}
						let list = [];
						if (ret.data.length > 0){
							let _t = {};
							for (let i=0;i<ret.data.length;i++){
							//for (let i in ret.data){
								_t = {};
								_t.type = 'user';
								_t.msg = ret.data[i];
								_t.msg.userinfo = ret.member[_t.msg.uid];
								list.unshift(_t);

							}
							// 获取消息中的图片,并处理显示尺寸
							for(let i=0;i<list.length;i++){
								if(list[i].type=='user' && list[i].msg.tag=="img"){
									
									let _images = that.upUrl+list[i].msg.content.replace('/thumb/','/image/');
									
									that.msgImgList.push(_images);
									list[i].msg.content = that.setPicSize(list[i].msg.content);
								}else if (list[i].type=='user' && list[i].msg.tag=="text"){
									list[i].msg.content = that.replaceEmoji(list[i].msg.content);
								}
							}
						}
						//console.log("that.msgList=>"+JSON.stringify(that.msgList));
						
						that.msgList = list;
						
						// 滚动到底部
						that.$nextTick(function() {
							
							//that.msgList = [{type:'user',msg:{content:'test',tag:'text',userinfo:{uid:1,name:'电工',avatar:'/images/13.png'}}},{type:'user',msg:{content:'test2222',tag:'text',userinfo:{uid:2,name:'电工2',avatar:'/images/13.png'}}}];
							//进入页面滚动到底部
							that.scrollTop = 99999;
							//that.$nextTick(function() {
								that.scrollAnimation = false;
							//});
						});
						
					}else{
						that.scrollAnimation = false;
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){
				return content;
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
				let maxH = uni.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
			},
			
			//更多功能(点击+弹出) 
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				if(this.hideMore){
					this.hideMore = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
				uni.navigateTo({
					url:'HM-hand/HM-hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type){
				this.hideDrawer();
				/*
				uni.chooseImage({
					sourceType:[type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=>{
						for(let i=0;i<res.tempFilePaths.length;i++){
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image)=>{
									console.log(image.width);
									console.log(image.height);
									let msg = {url:res.tempFilePaths[i],w:image.width,h:image.height};
									this.sendMsg(msg,'img');
								}
							});
						}
					}
				});
				*/
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						//console.log(JSON.stringify(res.tempFilePaths));
						let  auth = getApp().globalData.myAuth;
						uni.uploadFile({
							header:{
								'Access-Token':auth.uid+'|'+auth.username+'|'+auth.v+'|'+auth.lvl
							},
							url: getApp().globalData.eyUrl+'attach/upimage',
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'module': 'chat',
								//'imagew': 300,
							//	'imageh': 200,
							},
							success: (uploadFileRes) => {
								var ret = JSON.parse(uploadFileRes.data);
								//console.log(image.width);
								//	console.log(image.height);
									//let msg = {url:res.tempFilePaths[i],w:image.width,h:image.height};
									//this.sendMsg(msg,'img');
								
								/*
								var _t = {};
								_t.avatar = ret.thumb;
								that.upMyAuth(_t);
								that.member.avatar = _t.avatar;
								*/
							   let pdata = {};
							   pdata.rid = that.socketAuth.rid;
							   pdata.type = that.socketAuth.type;
							   pdata.tag = 'img';
							   pdata.content = ret.thumb;
							   //pdata.content = {url:ret.thumb,w:300,h:200};
							   utils.post(getApp().globalData.eyUrl+'chat/setData',pdata).then(res=>{
							   	let ret = res.data;
							   	if (ret.code == '1'){
							   		let msg = ret.data;
							   		that.sendMessage(msg);
							   	}
							   });
							}
						});
						
					}
				});
				
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em){
				this.textMsg+=em.alt;
			},
			
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText(){
				this.hideDrawer();//隐藏抽屉
				if(!this.textMsg){
					return;
				}
				
				let that = this;
				let pdata = {};
				pdata.rid = that.socketAuth.rid;
				pdata.type = that.socketAuth.type;
				pdata.tag = 'text';
				pdata.content = this.textMsg;
				utils.post(getApp().globalData.eyUrl+'chat/setData',pdata).then(res=>{
					let ret = res.data;
					if (ret.code == '1'){
						let msg = ret.data;
						that.textMsg = '';//清空输入框
						that.sendMessage(msg);
					}
				});
			},
			//替换表情符号为图片
			replaceEmoji(str){
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					//console.log("item: " + item);
					for(let i=0;i<this.emojiList.length;i++){
						let row = this.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = getApp().globalData.upUrl+'images/emoji/';
								let imgstr = '<img src="'+onlinePath+EM.url+'">';
								//console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				//return '<div style="display: flex;align-items: center;word-wrap:break-word;">'+replacedStr+'</div>';
				return replacedStr;
			},
			
			// 发送消息新
			sendMessage(obj){
				if (this.socketOpen == true){
					let pdata = {};
					pdata.act = 'chat';
					pdata.auth = this.socketAuth;
					pdata.data = obj;
					this.socketTask.send({
						data:JSON.stringify(pdata),
						async successs(){
						  console.log("消息发送成功");
						}
					})
				}		
			},
			// 发送消息
			sendMsg(content,type){
				if (this.socketOpen == true){
					let pdata = {};
					pdata = this.socketAuth;
					pdata.act = 'chat';
					pdata.content = content;
					this.socketTask.send({
						data:JSON.stringify(pdata),
						async successs(){
						 // console.log("消息发送成功");
						}
					})
				}
			},
			
			// 添加文字消息到列表
			addTextMsg(chatitem){
				if (chatitem.type=='user' && chatitem.msg.tag=="text"){
					chatitem.msg.content = this.replaceEmoji(chatitem.msg.content);
				}
				this.msgList.push(chatitem);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg){
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg){
				msg.msg.content = this.setPicSize(msg.msg.content);
				let _images = this.upUrl+msg.msg.content.replace('/thumb/','/image/');
				this.msgImgList.push(_images);
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg){
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg){
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg,index){
				let rid = msg.content.rid;
				uni.showLoading({
					title:'加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(()=>{
					//加载数据
					if(rid==0){
						this.redenvelopeData={
							rid:0,	//红包ID
							from:"大黑哥",
							face:"/static/img/im/face/face.jpg",
							blessing:"恭喜发财，大吉大利",
							money:"已领完"
						}
					}else{
						this.redenvelopeData={
							rid:1,	//红包ID
							from:"售后客服008",
							face:"/static/img/im/face/face_2.jpg",
							blessing:"恭喜发财",
							money:"0.01"
						}
						if(!msg.content.isReceived){
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({text:"你领取了"+(msg.userinfo.uid==this.socketAuth.uid ? "自己":msg.userinfo.username)+"的红包"},'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';
					
				},200)
				
			},
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.windowsState = 'hide';
				setTimeout(()=>{
					this.windowsState = '';
				},200)
			},
			sendSystemMsg(content,type){
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let row = {type:"system",msg:{id:lastid,type:type,content:content}};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid){
				uni.navigateTo({
					url:'HM-details/HM-details?rid='+rid
				})
			},
			// 预览图片
			showPic(msg){
				//let ary = new Array();
				//ary.push(this.upUrl+msg.content.replace('/thumb/','/image/'));
				uni.previewImage({
					indicator:"none",
					current:this.upUrl+msg.content,
					urls: this.msgImgList
					//urls: ary
				});
			},
			// 调用文本信息处理工具栏
			showTextTools(msg){
				// console.log("showTextTools=>",msg);
				let content = msg.content;
				let that = this;
				uni.showActionSheet({
					itemList: ['复制转发', '引用'],
					success: function (res) {
						// 复制转发
						if (res.tapIndex == 0){
							
							uni.setClipboardData({
								data: content,
								success: function () {
									uni.showToast({
										title:'复制成功'
									})
								}
							});
						}
						// 引用
						else if  (res.tapIndex == 1){
							let _t = '';
							if (content.indexOf("<img") !== -1){
								let  upUrl = getApp().globalData.upUrl;
								let  em_alt = [];
								let  em_url = [];
								for (let i=0;i<5;i++){
									for (let j=0; j<that.emojiList[i].length;j++){
										em_alt.push(that.emojiList[i][j].alt);
										em_url.push(that.emojiList[i][j].url);
									}
								}
								_t = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
									let alt = capture.replace(upUrl+'images/emoji/','');
									return em_alt[em_url.indexOf(alt)];
								});
							}else{
								_t = content;
							}
							that.textMsg = _t;
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			},
			// 播放语音
			playVoice(msg){
				this.playMsgid=msg.id;
				this.AUDIO.src = msg.content;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(e){
				clearInterval(this.recordTimer);
				if(!this.willStop){
					console.log("e: " + JSON.stringify(e));
					let msg = {
						length:0,
						url:e.tempFilePath
					}
					let min = parseInt(this.recordLength/60);
					let sec = this.recordLength%60;
					min = min<10?'0'+min:min;
					sec = sec<10?'0'+sec:sec;
					msg.length = min+':'+sec;
					this.sendMsg(msg,'voice');
				}else{
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			discard(){
				return;
			}
		}
	}
</script>
<style lang="scss">
	@import "@/static/HM-chat/css/style.scss"; 
	.scroll-view {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		flex:1
	}
	// 处理抽屉内容滚动
	.scroll-view-box {
		flex: 1;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
		//background-color:#f4ed94;
	}
	.image {
		width: 40px;
		height: 40px;
		border-radius: 100% !important;  
	}
	.text{
		font-size: 12px;
		//width: 100px;
		//display: -webkit-box;   /*必须结合的属性,将对象作为弹性伸缩盒子模型显示*/
		//-webkit-line-clamp: 1;  /*设置多少行*/
		//-webkit-box-orient: vertical;   /*必须结合的属性,设置或检索伸缩盒对象的子元素的排列方式*/
		//overflow: hidden;   /*文本会被修剪，并且剩余的部分不可见*/
		text-overflow: ellipsis;   /*显示省略号来代表被修剪的文本*/
	}
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
</style>