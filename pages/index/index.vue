<template>
	<view class="container">
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }"><text style="margin:10px">{{bannerText}}</text></view>
		</uni-popup>		
		<uni-swiper-dot class="uni-swiper-dot-box" @clickItem=clickItem :info="banner.info" :current="banner.current" :mode="banner.mode"
			:dots-styles="banner.dotsStyles" field="content">
			<swiper class="swiper-box" @change="changeBanner" :current="banner.swiperDotIndex">
				<swiper-item v-for="(item, index) in banner.info" :key="index">
					<view v-if="item.tourl!=''" class="swiper-item">
						<uni-link :href="item.tourl">
							<image :src="upUrl+item.url" class="bannerimage"></image> 
						</uni-link>
					</view>
					<view v-else class="swiper-item">
						<!--<text v-if="item.content!=''" style="color: #fff; font-size: 32px;">{{item.content}}</text>-->
						<image :src="upUrl+item.url" class="bannerimage"></image> 
						<view v-if="item.content!=''" @click="showContent(item)" style="position:absolute;width:100%;height:200px;">{{item.content}}</view>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<uni-grid class="grid" :column="3" :showBorder="false" :square="false">
			<uni-grid-item>
				<navigator url="/pages/member/index" open-type="switchTab">
				<view class="grid-item-box">
				<uni-icons color="#007AFF" type="contact" size="30"></uni-icons>
				<text>个人中心</text>
				</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator url="/pages/toupiao/index">
				<view class="grid-item-box">				
				<uni-icons  color="#007AFF" type="chat" size="30"></uni-icons>
				<text>一人一票</text>
				</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator url="/pages/paimai/index?current=0">
				<view class="grid-item-box">				
				<uni-icons  color="#007AFF" type="chat" size="30"></uni-icons>
				<text>虚拟金币</text>
				</view>
				</navigator>
			</uni-grid-item>
		</uni-grid>
		<uni-segmented-control :current="switchtab.current" :values="switchtab.items"  @clickItem="onClickTab" />
		<view class="content">
			<view v-if="switchtab.current === 0">
				<uni-section title="现金" sub-title="" type="line">
					<template v-slot:right>
						<navigator url="/pages/paimai/index?current=0" hover-class="navigator-hover">
							<text>查看更多</text>
						</navigator>
					</template>
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center" width="200px">名称</uni-th>
							<uni-th align="center">最高竞价</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr v-for="(item,index) in cash" :key="index">
							<uni-td>
								<uni-row style="height:24px;line-height: 24px;">
									<uni-col :span="24">
										#{{item.id}} {{item.title}} 
									</uni-col>
									<uni-col :span="14">
									<view>起拍:<text class="numb">{{item.numbmin}}</text></view>
									</uni-col>
									<uni-col :span="10">
										<!--
										<button v-if="item.uid != myAuth.uid" class="mini-btn" @tap="clickCashJoin(item,index)" plain="true" type="primary" size="mini">竞 拍</button>
										-->
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
				</uni-section>
			</view>
			<view v-if="switchtab.current === 1">
				<uni-section title="月签到" sub-title="" type="line">
					<template v-slot:right>
						<navigator url="/pages/signin/signin" hover-class="navigator-hover">
							<text>查看更多</text>
						</navigator>
					</template>
					<uni-table border stripe emptyText="暂无更多数据" >
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center" width="50">排行</uni-th>
						<uni-th align="center">用户</uni-th>
						<uni-th align="center" width="50">当月</uni-th>
						<uni-th align="center" width="50">累计</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->		
					<!-- 表格数据行 -->
					<uni-tr v-for="(item,index) in signin" :key="index">
						<uni-td><image :src="'/static/c'+(index+1)+'.png'" style="height:20px;width:20px;"></image></uni-td>
						<uni-td v-if="item.name">
							<view class="member_head">
								<image class="member_avatar" :src="upUrl+item.avatar" mode=""></image>
								<view class="member_info">
									<view class="member_name">{{item.name}}</view>
									<view class="member_sign">{{item.sign}}</view>
								</view>
							</view>		
						</uni-td>
						<uni-td v-else>异常用户</uni-td>
						<uni-td><text class="numb">{{!!item.curmonth ? item.curmonth : 0}}</text></uni-td>
						<uni-td><text class="numb">{{!!item.total ? item.total : 0}}</text></uni-td>
					</uni-tr>
					</uni-table>
				</uni-section>
			</view>
			<view v-if="switchtab.current === 2">
				<uni-section title="排行榜" sub-title="" type="line">
					<template v-slot:right>
						<navigator url="/pages/ranking/ranking" hover-class="navigator-hover">
							<text>查看更多</text>
						</navigator>
					</template>
					<uni-table border stripe emptyText="暂无更多数据" >
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center" width="50">排行</uni-th>
						<uni-th align="center">用户</uni-th>
						<uni-th align="center" width="80">贡献值</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->		
					<!-- 表格数据行 -->
					<uni-tr v-for="(item,index) in ranking" :key="index">
						<uni-td><image :src="'/static/c'+(index+1)+'.png'" style="height:20px;width:20px;"></image></uni-td>
						<uni-td v-if="item.name">
							<view class="member_head">
								<image class="member_avatar" :src="upUrl+item.avatar" mode=""></image>
								<view class="member_info">
									<view class="member_name">{{item.name}}</view>
									<view class="member_sign">{{item.sign}}</view>
								</view>
							</view>		
						</uni-td>
						<uni-td v-else>异常用户</uni-td>
						<uni-td><text class="numb">{{item.point}}</text></uni-td>
					</uni-tr>
					</uni-table>
				</uni-section>
			</view>
		</view>
		
	<!--<uni-title type="h3" title="排行榜" color="#439ffc"></uni-title>	-->
	<uni-section title="用户留言" sub-title="" type="line">
		<template v-slot:right>
			<navigator url="/pages/discuz/index" hover-class="navigator-hover">
				<text>查看更多</text>
			</navigator>
		</template>
		<uni-list :border="false" v-for="(item,index) in discuz" :key="index">
			<uni-list-chat clickable @click="clickDiscuzLink(item)"  :title="item.name" :avatar-circle="true" :avatar="upUrl+item.avatar" :note="item.content" :time="item.created_at.substring(5,16)" badge-positon="left" />
		</uni-list>	
	</uni-section>
	</view>
</template>

<script>
	import * as utils from '@/common/util.js';
	export default {
		components: {},
		data() {
			return {
				upUrl : ''
				//bannerinfo : [],
				,banner:{
					info: [],
					dotStyle: [{
							backgroundColor: 'rgba(0, 0, 0, .3)',
							border: '1px rgba(0, 0, 0, .3) solid',
							color: '#fff',
							selectedBackgroundColor: 'rgba(0, 0, 0, .9)',
							selectedBorder: '1px rgba(0, 0, 0, .9) solid'
						}
					],
					modeIndex: -1,
					styleIndex: -1,
					current: 0,
					mode: 'default',
					dotsStyles: {},
					swiperDotIndex: 0,
				}
				,switchtab:{
					items: ['现金', '月签到', '贡献排行'],
					current: 0,
					colorIndex: 0,
					activeColor: '#007aff',
					styleType: 'button'
				}
				,cash : []
				,coin: []
				,resource:[]
				,ranking:[]
				,discuz:[]
				,bannerText:''
			}
		},
		onLoad() {
			this.upUrl = getApp().globalData.upUrl;
			this.getSections();
		},
		methods: {
			showContent(item){
				//console.log("item=>",item);
				if (item.content != ''){
					this.bannerText = item.content
					this.$refs.popup.open("top")
				}
			},
			// 点击用户言跳转
			clickDiscuzLink(item){
				uni.navigateTo({
					//url:'/pages/toupiao/index?current='+item.tag
					url:'/pages/discuz/index'
				})
			},
			getSections(e){
				uni.showLoading({title: '加载中'});
				let that = this;
				let pdata = {};
				pdata.banner = 3;
				pdata.cash = 3;
				pdata.coin = 3;
				pdata.resource = 3;
				pdata.ranking = 3;
				pdata.discuz = 2;
				pdata.signin = 3;
				utils.post(getApp().globalData.eyUrl+'home/getSections',pdata).then(res=>{
				  let ret = res.data;
				  //console.log('xx=>',JSON.stringify(ret));
				  if (ret.code == '1'){
					that.banner.info = ret.data.banner;
					that.cash = ret.data.cash;
					that.ranking = ret.data.ranking;
					that.discuz = ret.data.discuz;
					that.signin = ret.data.signin;
				  }else if(ret.code == '0'){
					uni.showToast({title: '暂无数据',icon: 'error',});
				  }else{
					uni.showToast({title: '无搜索结果',icon: 'error',});
				  }
				})
				uni.hideLoading();				
			},
			changeBanner(e) {
				this.banner.current = e.detail.current
			},
			selectStyle(index) {
				this.banner.dotsStyles = this.dotStyle[index]
				this.banner.styleIndex = index
			},
			clickItem(e) {
				this.banner.swiperDotIndex = e
			},
			onBanner(index) {
			},
			onClickTab(e) {
				if (this.switchtab.current !== e.currentIndex) {
					this.switchtab.current = e.currentIndex
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0 10px;
		font-size: 14px;
		line-height: 24px;
	}	
	.swiper-box {
		height: 200px;
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: #fff;
		background-color: #cee1fd;
	}
	.bannerimage {
		width: 750rpx;
	}
	/*
	.grid{
		height:80px;
	}
	*/
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
	/* #ifndef APP-NVUE */
	::v-deep .image img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}

	/* #endif */

	@media screen and (min-width: 500px) {
		.uni-swiper-dot-box {
			width: 400px;
			margin: 0 auto;
			margin-top: 8px;
		}

		.image {
			width: 100%;
		}
	}

	.uni-bg-red {
		background-color: #ff5a5f;
	}

	.uni-bg-green {
		background-color: #09bb07;
	}

	.uni-bg-blue {
		background-color: #007aff;
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
		color: #0000ff;
		font-size: 28rpx;
		margin-top: 6rpx;
		font-weight: 600;
	}		
</style>


