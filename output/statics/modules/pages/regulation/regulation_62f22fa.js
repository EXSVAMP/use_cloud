define('pages/regulation/regulation', function(require, exports, module) {


module.exports = {
    url: '/regulation',
    template: "<div class=\"category\">\n    <script type=\"text/ng-template\" id=\"myModalregulation.html\">\n        <div class=\"modal-header relative\">\n            <p>{{item.title}}</p>\n            <span class=\"icon-icon_close_circle_o category-pop-close\" ng-click=\"cancel()\"></span>\n        </div>\n        <div ng-show=\"item.method=='add' || item.method=='modify'\">\n            <div class=\"modal-body\">\n                <div class=\"form-group form-group-selin form-group-category\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon bg-white inputdesc\">类别名称</span>\n                        <input type=\"text\" class=\"form-control\" placeholder=\"请输入类别名称\" ng-model=\"name\">\n                    </div>\n                </div>\n                <div class=\"form-group form-group-selin\" ng-show=\"item.method=='add'\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon bg-white inputdesc\">主题</span>\n                        <input type=\"text\" class=\"form-control\" placeholder=\"请输入主题\" ng-model=\"topic\">\n                    </div>\n                </div>\n\n                <div class=\"form-group form-group-selin\" ng-show=\"item.method=='modify'\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon bg-white inputdesc\">主题</span>\n\n                        <div type=\"text\" class=\"form-control readonly\" ng-bind=\"topic\"></div>\n                    </div>\n                </div>\n                <div class=\"form-group form-group-selin margin-bottom-30\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon bg-white inputdesc\">简述</span>\n                        <input type=\"text\" class=\"form-control\" placeholder=\"请输入内容\" ng-model=\"description\">\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"modal-footer modal-footer-category\">\n                <div>\n                    <button type=\"button\" class=\"btn btn_ok\" ng-click=\"cancel()\">取消</button>\n                    <button type=\"button\" class=\"btn btn_cancel\" ng-click=\"ok()\">保存</button>\n                </div>\n            </div>\n\n        </div>\n\n        <div ng-show=\"item.method == 'delete'\">\n            <div class=\"modal-body\">\n                <div class=\"warn_delete\">\n                    <span class=\"icon-icon_warn\"></span>\n\n                    <div class='delete_desc'>\n                        <p>确定要删除这个规则吗</p>\n\n                        <p>注意：删除以后不可恢复！</p>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer modal-footer-project\">\n                <div>\n                    <button type=\"button\" class=\"btn btn_delete\" ng-click=\"ok()\">删除</button>\n                    <button type=\"button\" class=\"btn btn_cancel \" ng-click=\"cancel()\">取消</button>\n                </div>\n            </div>\n        </div>\n\n    </script>\n    <div class=\"main-top-bar\">\n        <p>规则管理/规则列表</p>\n    </div>\n    <div class=\"main-content\" ng-show=\"!regulationDetail\">\n        <!--<link rel=\"import\" href=\"/modules/partial/common/project_tab.html?__inline\"/>-->\n        <div class=\"form-search\">\n            <input class=\"category_name\" placeholder=\"请输入规则名称\" ng-model=\"regulation_name\"/>\n            <button type=\"button\" class=\"searchBtn\" type=\"button\" ng-click=\"searchBtn()\">搜索</button>\n            <!--<button type=\"button\" class=\"addBtn\" ng-click=\"open('md-add','add',$index)\">-->\n            <button type=\"button\" class=\"addBtn\" ng-click=\"addStrategy()\">\n                <span class=\"icon-icon_plus\"></span>\n                <span class=\"addBtn_desc\">添加规则</span>\n            </button>\n        </div>\n        <table class=\"table table-bordered table-content\">\n            <thead>\n            <tr>\n                <th>规则名称</th>\n                <th>主题</th>\n                <th>创建时间</th>\n                <th>操作</th>\n            </tr>\n            </thead>\n            <tbody ng-show=\"query_result.length>0\">\n            <tr ng-repeat=\"item in query_result\">\n                <td class=\"detail-btn\" ng-click=\"regulationDetailFunc($index)\">{{item.name}}</td>\n                <td>{{item.topic}}</td>\n                <td>{{item.created_at}}</td>\n                <td class=\"op-btns\">\n                    <span class=\"icon-icon_edit edit-icon margin-right-10\" ng-click=\"modifyStrategy($index)\"></span>\n                    <!--<span class=\"icon-icon_eye watch-icon\"></span>-->\n                    <span class=\"icon-icon_delete delete-icon margin-left-10\"\n                          ng-click=\"open('md-add','delete',$index)\"></span>\n                </td>\n\n            </tr>\n            </tbody>\n        </table>\n        <div class=\"no_content\" ng-show=\"query_result.length==0\">\n            <p><span class=\"icon-no_search\"></span></p>\n\n            <p>找不到你需要的内容，请重新搜索</p>\n        </div>\n        <table class=\"table table-pagination\" ng-show=\"query_result.length!=0\">\n            <thead>\n            <tr>\n                <th class=\"pagination-items-per-page\">\n                    <!-- <span>每页显示数量</span>\n                    <ui-select ng-model=\"number2\" theme=\"bootstrap\" on-select=\"setShowNum(number2)\">\n                        <ui-select-match placeholder=\"10\">{{$select.selected}}</ui-select-match>\n                        <ui-select-choices repeat=\"item in numbers\">\n                            <div ng-bind-html=\"item\"></div>\n                        </ui-select-choices>\n                    </ui-select> -->\n                    <div class=\"pagination-content\">\n                        <span class=\"pagination-tip\">每页显示数量</span>\n                        <ui-select ng-model=\"number\" name=\"camera_page_select\" theme=\"bootstrap\"\n                                   on-select=\"setShowNum(number)\">\n                            <ui-select-match placeholder=\"10\">{{$select.selected}}</ui-select-match>\n                            <ui-select-choices repeat=\"item in numbers\">\n                                <div ng-bind-html=\"item\"></div>\n                                <!-- <small ng-bind-html=\"item.email\"></small> -->\n                            </ui-select-choices>\n                        </ui-select>\n                    </div>\n                </th>\n                <th>\n                    <uib-pagination items-per-page=\"number\" total-items=\"bigTotalItems\" ng-change=\"changePage()\"\n                                    ng-model=\"bigCurrentPage\" max-size=\"maxSize\" class=\"pagination-sm\"\n                                    boundary-link-numbers=\"true\" num-pages=\"numPages\" previous-text=\"上一页\"\n                                    next-text=\"下一页\"></uib-pagination>\n                    <div class=\"pagination-detail\">\n                        <span>共{{total_page}}页</span>\n                        <span>跳至<input type=\"text\" name=\"camera_page\" ng-model=\"index_sel\"/>页</span>\n                        <span><button name=\"camera_submmit\" ng-click=\"setPage()\">确定</button></span>\n                    </div>\n                </th>\n\n            </tr>\n            </thead>\n\n        </table>\n    </div>\n    <div class=\"main-content height-auto\" ng-show=\"regulationDetail\">\n        <div class=\"form-search\">\n            <div class=\"form-group form-group-selin border-light relative clear-padding-left margin-auto height-auto clear-padding-right\"\n                 style=\"width:41.6%;float: none;\">\n                <!--<div class=\"input-group\" style=\"display:inline-table;\">-->\n                    <!--<span class=\"input-group-addon bg-white inputdesc\">主题</span>-->\n                    <!--<input type=\"text\" class=\"form-control\" placeholder=\"请输入主题\" ng-model=\"watchTopic\">-->\n                <!--</div>-->\n                <button type=\"button\" class=\"searchBtn margin-bottom-10\" type=\"button\" ng-click=\"modifyStrategy(detailIdx)\"\n                        style=\"border-radius: 4px;width: 134px;float: right;\">\n                   <span class=\"icon-icon_edit padding-right-5\"></span>规格编辑\n                </button>\n                <span class=\"categoryWatchTip\" style=\"bottom: 10px;\">规则查看</span>\n            </div>\n\n        </div>\n        <div class=\"margin-bottom-20 margin-auto\" style=\"width:41.6%;\">\n            <div class=\"ul-bordered width-full\">\n                <ul class=\"regulation-detail-item relative\">\n                    <li class=\"regulation-detail-key\">\n                        规则名称\n                    </li>\n                    <li>\n                        {{detail_name}}\n                    </li>\n                </ul>\n                <ul class=\"regulation-detail-item relative\">\n                    <li class=\"regulation-detail-key\">\n                        物接入实例\n                    </li>\n                    <li>\n                        {{detail_instance}}\n                    </li>\n                </ul>\n                <ul class=\"regulation-detail-item relative\">\n                    <li class=\"regulation-detail-key\">\n                        主题\n                    </li>\n                    <li>\n                        {{detail_topic}}\n                    </li>\n                </ul>\n            </div>\n\n            <div class=\"table-bordered width-full margin-top-10\" ng-repeat=\"item in detail_actuator\">\n                <ul class=\"regulation-detail-item relative\">\n                    <li class=\"regulation-detail-key\">\n                        存储类型\n                    </li>\n                    <li>\n                        {{item.rule_type}}\n                    </li>\n                </ul>\n                <ul class=\"regulation-detail-item relative\" ng-show=\"item.rule_type == 'Rabbitmq'\">\n                    <li class=\"regulation-detail-key\">\n                        exchange\n                    </li>\n                    <li>\n                        {{item.exchange}}\n                    </li>\n                </ul>\n                <ul class=\"regulation-detail-item relative\" ng-show=\"item.rule_type == 'Rabbitmq'\">\n                    <li class=\"regulation-detail-key\">\n                       queue\n                    </li>\n                    <li>\n                        {{item.queue}}\n                    </li>\n                </ul>\n                <ul class=\"regulation-detail-item relative\" ng-show=\"item.rule_type == 'Rabbitmq'\">\n                    <li class=\"regulation-detail-key\">\n                        持久化\n                    </li>\n                    <li>\n                        {{item.persist | booleanToString}}\n                    </li>\n                </ul>\n\n\n                        <ul class=\"regulation-detail-item relative\" ng-show=\"item.rule_type == 'Api'\">\n                            <li class=\"regulation-detail-key\">\n                                api\n                            </li>\n                            <li>\n                                {{item.rule_type}}\n                            </li>\n                        </ul>\n                        <ul class=\"regulation-detail-item relative\" ng-show=\"item.rule_type == 'Api'\">\n                            <li class=\"regulation-detail-key\">\n                                调用方式\n                            </li>\n                            <li>\n                                {{item.method}}\n                    </li>\n                </ul>\n                <ul class=\"regulation-detail-item relative\" ng-show=\"item.rule_type == 'Api'\">\n                    <li class=\"regulation-detail-key\">\n                        请求头\n                    </li>\n                    <li>\n                        {{item.header}}\n                    </li>\n                </ul>\n\n            </div>\n\n        </div>\n        <div class=\"modal-footer modal-footer-category\">\n            <div>\n                <button type=\"button\" class=\"btn btn_ok\" ng-click=\"return()\">返回</button>\n            </div>\n        </div>\n    </div>\n    <optip ng-class=\"optip\"></optip>\n    <addregulation ng-class=\"addstrategy\" class=\"addstrategy-wrap\"></addregulation>\n</div>",


    //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'regulationCtr',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require(['pages/regulation/regulation.sync'], function() {
                deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};

});
