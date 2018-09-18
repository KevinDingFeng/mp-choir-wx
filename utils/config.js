/**
 * 小程序配置文件
 */
//接口域名
var host = "https://sing.dazonghetong.com";//
//var host = "http://192.168.3.49:5566";

var config = {
  host,
  baseUrl: `${host}`,
//   图片背景
  bg_img: `${host}/f/backgroundimage`,
  onShareAppMessageTitle :["我歌技了得，敢不敢一起合唱！", "歌已点好，快来与我合唱！"],
};

module.exports = config
