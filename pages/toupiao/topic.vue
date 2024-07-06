<template>
		<view class="example">
			<!-- 自定义表单校验 -->
			<uni-forms ref="customForm" :rules="customRules" :modelValue="voteInfo" label-position="top">
				<uni-forms-item label="主题" required name="title">
					<uni-easyinput v-model="voteInfo.title" placeholder="请输入主题" />
				</uni-forms-item>
				<uni-forms-item label="选项设置" required name="options">
					<uni-data-checkbox v-model="voteInfo.options" multiple :localdata="options" />
				</uni-forms-item>
				<uni-forms-item label="主题介绍">
					<uni-easyinput type="textarea" v-model="voteInfo.intro" placeholder="请输入主题介绍" />
				</uni-forms-item>
				<uni-forms-item label="截止日期">
					<uni-datetime-picker :start="starttime" :end="overtime" type="datetime" return-type="string" v-model="voteInfo.etime"/>
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="submitTopic('customForm')">提交</button>
			<uni-fab ref="fab" :content="actMenu"  @trigger="clickActMenu" />
		</view>
</template>
<script>
import * as utils from '@/common/util.js';	
export default {  
    data() {  
        return {  
			options:[],
			voteInfo : {
				title : '',
				intro : '',
				etime : '',
				options:[]
			},
			starttime : '',
			overtime : '',
			actMenu : getApp().globalData.actMenu,
			// 自定义表单校验规则
			customRules: {
				title: {
					rules: [{
						required: true,
						errorMessage: '主题不能为空'
					}]
				},
				options: {
					rules: [{
							format: 'array'
						},
						{
							validateFunction: function(rule, value, data, callback) {
								if (value.length < 2) {
									callback('请至少勾选两个选项')
								}
								return true
							}
						}
					]
				}

			},
        };  
    },
	watch: {
		starttime(newval) {
			console.log("start:", this.starttime);
			console.log("over:", this.overtime);
		},
	},
	mounted() {
		setTimeout(() => {
			var date = new Date(); 
			var year = date.getFullYear(); 
			var month = date.getMonth() + 1;
			var day = date.getDate();
			month = (month > 9) ? month : ("0" + month);
			day = (day < 10) ? ("0" + day) : day;			
			this.starttime = year + "-" + month + "-" + day;
			this.overtime = year+1 + "-" + month + "-" + day;
		}, 1000);
	},
	onLoad(){
		this.getOptions();
	},
	onReady() {
		// 设置自定义表单校验规则，必须在节点渲染完毕后执行
		this.$refs.customForm.setRules(this.customRules)
	},
    methods: { 
		clickActMenu(e){uni.switchTab({url : this.actMenu[e.index].route});},
		input(e){
			this.voteInfo.intro = e.detail.value;
		},
		getOptions(){
			let that = this;
			utils.get(getApp().globalData.eyUrl+'vote/getOptions').then(res=>{
				let ret = res.data;
				if (ret.code == '1'){
					that.options = ret.data;
				}
			});
		},
		submitTopic(ref){					
			let that = this;
			let pdata = {};
			
			this.$refs[ref].validate().then(res => {
				pdata = this.voteInfo;
				pdata.tag = 3;
				// 发起议题
				//console.log("submitTopic=>",JSON.stringify(pdata));
				utils.post(getApp().globalData.eyUrl+'vote/setTopic',pdata).then(res=>{
					let ret = res.data;
					//console.log("submitTopic=>",res);
					if (ret.code == '1'){
						uni.showToast({
							title: '发表成功'
						});
						uni.navigateBack();
					}else if(ret.code == '0'){
						uni.showToast({
							icon:'none',
							title: ret.msg
						});
					}
				});
			}).catch(err => {
				return;
			})
		},
    }  
};
</script>
<style lang="scss">

	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		margin-left: 10px;
	}
</style>
