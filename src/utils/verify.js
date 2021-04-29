import request from './request'

// 前端验证的逻辑
export default function verify(wx, data) {
	// 假接口
	request('/verify', {
		data,
		method: 'POST'
	}).then(res=>{
		let { timestamp, nonceStr, signature } = res
		// 调接口传递相关参数
		wx.config({
			// 开启调试模式（上线时要关闭掉）
		  debug: true,
			// 必填，公众号的唯一标识
		  appId: 'wxffbc1e36d2828198',
			// 必填，生成签名的时间戳
		  timestamp,
			// 必填，生成签名的随机串
		  nonceStr,
			// 必填，签名
		  signature,
			// 必填，需要使用的JS接口列表
		  jsApiList: [
				'getLocation',
				'chooseWXPay'
			]
		})
	})
}
