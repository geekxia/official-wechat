```
cnpm install dva-cli -g
dva new project-name
cd project-name
npm start
cnpm i antd-mobile -S
cnpm i sha1 -S
```

# 怎么在H5中接入jssdk？

* [公众号开发文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63)

1、第一步：绑定安全域名（在开发环境可以不用做）
* 当H5真正被接入公众号平台（上线）时才需要配置，本地开发时可忽略掉。
* 怎么绑定安全域名？在公众号后台->公众号设置->功能设置->按流程绑定（公众号先备案交费、下载安全验证文件、放在服务器m.3fengs.com静态资源服务器的根目录、绑定域名）

2、第二步：安装jssdk
```
<script src='http://res2.wx.qq.com/open/js/jweixin-1.6.0.js'></script>
```
* 如果是多页面应用程序（MPA），在每个页面中都安装jssdk，并且每个页面都要进行wx.config三方验证。
* 如果是单页面应用程序（SPA），只用在public/index.html中安装即可，在每个需要用到jssdk的路由页面中都要进行wx.config三方验证。

3、注入权限验证配置（wx.config）
* 先通过api请求，向业务服务器索要以下字段：timestamp、nonceStr、signature
* 再通过 wx.config() 完成三方验证
* 如果验证成功，会触发 wx.ready()；反之失败，会触发wx.error()
```
wx.config({
	// 开启调试模式（上线时要关闭掉）
  debug: true,
	// 必填，公众号的唯一标识
  appId: 'wxffbc1e36d2828198',
	// 必填，生成签名的时间戳
  timestamp: ,
	// 必填，生成签名的随机串
  nonceStr: '',
	// 必填，签名
  signature: '',
	 // 必填，需要使用的JS接口列表
  jsApiList: []
});
```

4、接入jssdk的前端与后端的逻辑
```
import request from './request'

// 前端验证的逻辑
export default function verify(wx, data) {
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


// 后端代码逻辑（伪代码）
var sha1 = require('sha1')
router.post('/verify', (req,res)=>{
	let { url } = req.query
	const noncestr = 'qf'
	const timestamp = Date.now()
	// 第1步：业务服务器向微信服务器请求access_token
	axios({
		url: 'https://api.weixin.qq.com/cgi-bin/token',
		method: 'get',
		params: {
			grant_type: 'client_credential',
			appid: 'wxffbc1e36d2828198',
			secret: '04ef2f908d0e2ab84a28ede135f9f905'
		}
	}).then(res=>{
		let { access_token, expires_in} = res
		// access_token 要缓存起来
		// 第2步：根据access_token获取临时票据
		axios({
			url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
			method: 'get',
			params: {
				type: 'jsapi',
				access_token
			}
		}).then(res=>{
			let { ticket, expires_in} = res
			// ticket 要缓存起来
			// 第3步：使用sha1这套算法生成签名
			const signStr = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=https://m.3fengs.com/#/${url}`
			const signature = sha1(signStr)
			// 第4步：把参与验证的字段返回给客户端
			res.json({
				err: 0,
				msg: 'success',
				data: {
					timestamp,
					nonceStr,
					signature
				}
			})
		})
	})
})
````
