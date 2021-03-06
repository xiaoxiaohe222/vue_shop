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
    Pagination,
    Dialog,
    Form,
    FormItem,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option

} from "element-ui"
import Vue from "vue"


Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Dialog)
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
