import Constant from 'lib/Constant'
export default {
    /**
     * 常用工具
     */

    [Constant.tools.COMMON_TOOL]: [
        {
            icon:'xsaj',
            text: '相似案件',
            type: Constant.tools.SEARCH_TOOL,
            pathName:'xsaj'
        },
        {
            icon:'pjyc',
            text: '判决预测',
            type:Constant.tools.SEARCH_TOOL,
            pathName:'pjyc'
        },
        {
            icon:'jtpcj',
            text: '交通赔偿金',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:'jtpcj'
        },
        {
            icon:'wsxz',
            text: '文书下载',
            type:Constant.tools.CASE_TOOL,
            pathName:'wsxz'
        },
        {
            icon:'ajgl',
            text: '案件管理',
            type:Constant.tools.CASE_TOOL,
            pathName:'ajgl'
        },
        {
            icon:'gspcj',
            text: '工伤赔偿金',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:'gspcj'
        }
    ],

    /**
     * 检索
     */
    [Constant.tools.SEARCH_TOOL]: [
        {
            icon:'sftxl',
            text: '司法通讯录',
            type:Constant.tools.SEARCH_TOOL,
            pathName:'justice-contact'
        },
        {
            icon:'fgjs',
            text: '法规检索',
            type:Constant.tools.SEARCH_TOOL,
            pathName:'law-search'
        },
        {
            icon:'aljs',
            text: '案例检索',
            type:Constant.tools.SEARCH_TOOL,
            pathName:'case-search'
        }
    ],

    /**
     * 费用计算
     */
    [Constant.tools.COST_COUNT_TOOL]: [
        {
            icon:'ssfjs',
            text: '诉讼费计算器',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:'ssfjs'
        },
        {
            icon:'cjsyq',
            text: '裁决书预期利息',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        },
        {
            icon:'rqjsq',
            text: '日期计算器',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        },
        {
            icon:'rssh',
            text: '人身损害',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        },
        {
            icon:'fwhd',
            text: '房屋还贷',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        },
        {
            icon:'lhfcfg',
            text: '离婚房产分隔',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        },
        {
            icon:'grsds',
            text: '个人所得税',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        },
        {
            icon:'ccbq',
            text: '财产保险',
            type:Constant.tools.COST_COUNT_TOOL,
            pathName:''
        }
    ],

    /**
     * 案件管理
     */
    [Constant.tools.CASE_TOOL] : [
        {
            icon:'swdt',
            text: '思维导图',
            type:Constant.tools.CASE_TOOL,
            pathName:'swdt'
        }
    ]
}