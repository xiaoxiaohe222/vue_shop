import {
    Button,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Message,
    Popconfirm,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Input,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination

} from "element-ui"
import Vue from "vue"


Vue.prototype.$message = Message;
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Popconfirm)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
