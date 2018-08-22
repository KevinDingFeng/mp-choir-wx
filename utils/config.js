/**
 * 小程序配置文件
 */
//接口域名
var host = "192.168.3.3:9090";
//静态文件域名
//var data_host = "img.app.meitudata.com";

var config = {

  host,

  baseUrl: `http://${host}`,
  // 登录地址，用于建立会话
  loginUrl: `https://${host}/user/login`,

  // 个人信息获取
  infoUrl: `https://${host}/user/info`,

  //检查服务端会话是否过期
  checkTokenUrl: `https://${host}/user/checkToken`,

  //上传专辑封面
  uploadAlbumArt: `https://${host}/choir/uploadAlbumArt`,

  //添加个人基本信息
  setupUserInfo: `https://${host}/user/setupUserInfo`

};

module.exports = config
