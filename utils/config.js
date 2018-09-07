/**
 * 小程序配置文件
 */
//接口域名
var host = "https://sing.dazonghetong.com";//
//var host = "http://192.168.3.49:5566";
//静态文件域名
//var data_host = "img.app.meitudata.com";

var config = {
  host,
  baseUrl: `${host}`,
//   图片背景
  bg_img: `${host}/f/backgroundimage`
};

module.exports = config
