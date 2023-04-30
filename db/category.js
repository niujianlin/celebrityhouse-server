//引入mongoose
const mongoose = require('mongoose')

//创建集合规则
const categoryeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    }
})

// 创建文章集合
const Category = mongoose.model('Category', categoryeSchema);

async function createCategory() {
    // const pass = bcryptjs.hashSync('123456', 10);
    // 创建一些数据，第一次导入初始化数据用的
    const category = await Category.create({
        name: '鸣人',
        description: "火影忍者中的人物"
    })
}
// createCategory();

// 导出模块
module.exports = {
    Category
}