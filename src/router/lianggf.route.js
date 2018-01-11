import {asyncComponent} from '@/lib/utils'

const overview = asyncComponent('overview/overview')
const WorkDesk = asyncComponent('work-desk/work-desk')
// const ServiceMgr = asyncComponent('service/serviceMgr')

//检索
const SearchTab = asyncComponent('work-desk/search/SearchTab')
const JusticeContact = asyncComponent('work-desk/search/JusticeContact')
const LawSearch = asyncComponent('work-desk/search/LawSearch')
const CaseSearch = asyncComponent('work-desk/search/CaseSearch')

//计算器
const CountTab = asyncComponent('work-desk/count/countTab')
const Gspcj = asyncComponent('work-desk/count/gspcj')
const Jtpcj = asyncComponent('work-desk/count/jtpcj')
const Ssfjs = asyncComponent('work-desk/count/ssfjs')
const LegalCost = asyncComponent('work-desk/count/legal_cost') //诉讼费计算
const LabourCost = asyncComponent('work-desk/count/labour_cost') //劳动补偿金
const PersonalInjury = asyncComponent('work-desk/count/personal_injury') //人身损害计算
const DivorceHouse = asyncComponent('work-desk/count/divorce_house') //离婚房产分隔
const HouseRepayment = asyncComponent('work-desk/count/house_repayment') //房屋还贷
const PersonalTax = asyncComponent('work-desk/count/personal_tax') //个人所得税
const PropertyPreservation = asyncComponent('work-desk/count/property_preservation') //个人所得税
const AwardOverdue = asyncComponent('work-desk/count/award_overdue') //裁决书逾期计算器
const DateCount = asyncComponent('work-desk/count/date_count') //裁决书逾期计算器

//案件管理
const CaseTab = asyncComponent('work-desk/case/caseTab')
const Ajgl = asyncComponent('work-desk/case/ajgl')
const Wsxz = asyncComponent('work-desk/case/wsxz')
const Swdt = asyncComponent('work-desk/case/swdt')

//相似案件
const SameTab = asyncComponent('work-desk/same/same_tab')
const Xsaj = asyncComponent('work-desk/same/xsaj')
const Pjyc = asyncComponent('work-desk/same/pjyc')

//认证状态
const AuthLawyerInfo = asyncComponent('auth/auth_lawyer_info')
const BaseInfo = asyncComponent('auth/base_info')

//用户咨询
const UserAdvice = asyncComponent('tidings/user_advice')

export let r = [
    //总览
    {
        path: 'overview',
        name: 'overview',
        component: overview
    },
    //工作台
    {
        path: 'work-desk',
        name: 'work-desk',
        component: WorkDesk,
        children:[
            {
                //检索
                path: 'search-tab',
                name: 'search-tab',
                component: SearchTab,
                children:[
                    {
                        path: 'justice-contact',
                        name: 'justice-contact',
                        component: JusticeContact
                    },
                    {
                        path: 'law-search',
                        name: 'law-search',
                        component: LawSearch
                    },
                    {
                        path: 'case-search',
                        name: 'case-search',
                        component: CaseSearch
                    }
                ]
            },

            //计算器
            {
                path: 'count-tab',
                name: 'count-tab',
                component: CountTab,
                children: [
                    {
                        path: 'gspcj',
                        name: 'gspcj',
                        component: Gspcj
                    },
                    {
                        path: 'jtpcj',
                        name: 'jtpcj',
                        component: Jtpcj
                    },
                    {
                        path: 'ssfjs',
                        name: 'ssfjs',
                        component: Ssfjs
                    },
                    {
                        path: 'legal_cost',
                        name: 'legal_cost',
                        component: LegalCost
                    },
                    {
                        path: 'labour_cost',
                        name: 'labour_cost',
                        component: LabourCost
                    },
                    {
                        path: 'personal_injury',
                        name: 'personal_injury',
                        component: PersonalInjury
                    },
                    {
                        path: 'divorce_house',
                        name: 'divorce_house',
                        component: DivorceHouse
                    },
                    {
                        path: 'house_repayment',
                        name: 'house_repayment',
                        component: HouseRepayment
                    },
                    {
                        path: 'personal_tax',
                        name: 'personal_tax',
                        component: PersonalTax
                    },
                    {
                        path: 'property_preservation',
                        name: 'property_preservation',
                        component: PropertyPreservation
                    },
                    {
                        path: 'award_overdue',
                        name: 'award_overdue',
                        component: AwardOverdue
                    },
                    {
                        path: 'date_count',
                        name: 'date_count',
                        component: DateCount
                    }
                ]
            },

            //案件管理
            {
                path: 'case-tab',
                name: 'case-tab',
                component: CaseTab,
                children: [
                    {
                        path: 'ajgl/:type?/:id?',
                        name: 'ajgl',
                        component: Ajgl
                    },
                    {
                        path: 'wsxz/:type?/:id?/:pageNow?', // type-list-下载列表   type-detail-详情
                        name: 'wsxz',
                        component: Wsxz
                    },
                    {
                        path: 'swdt',
                        name: 'swdt',
                        component: Swdt
                    }
                ]
            },

            //相似案件
            {
                path: 'same-tab',
                name: 'same-tab',
                component: SameTab,
                children: [
                    {
                        path: 'xsaj',
                        name: 'xsaj',
                        component: Xsaj
                    },
                    {
                        path: 'pjyc',
                        name: 'pjyc',
                        component: Pjyc
                    }
                ]
            }
        ]
    },
    // //服务管理
    // {
    //     path: 'service-mgr',
    //     name: 'service-mgr',
    //     component: ServiceMgr
    // },
    //认证状态
    {
        
        path: 'auth_lawyer_info/:status?', // info-基本资料  license-执业证照  auth-审核状态
        name: 'auth_lawyer_info',
        component: AuthLawyerInfo
    },
    //认证状态
    {
        
        path: 'base_info', // info-基本资料  license-执业证照  auth-审核状态
        name: 'base_info',
        component: BaseInfo
    },
    //用户咨询
    {
        path: 'user_advice', // info-基本资料  license-执业证照  auth-审核状态
        name: 'user_advice',
        component: UserAdvice
    }
]