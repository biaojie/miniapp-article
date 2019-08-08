const BASE = '';

const CONFIG = {
  API_URL: {
    URL: BASE,
    getClassify: BASE +'/getClassify',
    getSession: BASE + '/getSession',
    getRecommend: BASE + '/getRecommend',
    getClassifyList: BASE + '/getClassifyList',
    getArticleDetails: BASE + '/getArticleDetails',
    collect: BASE + '/collect',
    getMyCollect: BASE + '/getMyCollect',
    getBroadcast: BASE + '/getBroadcast',
    buyArticle: BASE + '/buyArticle',
    getEWM: BASE + '/getEWM',
    getPhone: BASE + '/getPhone',
    getPayRecord: BASE + '/getPayRecord',
    getIncome: BASE + '/getIncome',
    putForward: BASE + '/putForward',
    txRecord: BASE + '/txRecord',
  }
}

module.exports = CONFIG;