const mongoose = require('mongoose');

//创建规则
const commentSchema = new mongoose.Schema({
// 在 MongoDB 中，关系数据库中的外键并不存在，相反，我们使用引用来实现类似的功能。当一个模型引用另一个模型时，
// 这个模型中的字段将会存储对目标模型中文档的 _id 值。使用 ref 选项告诉 Mongoose，这个字段引用的是哪个模型的 _id 值。
// 使用 ref 选项可以帮助 Mongoose 进行跨集合的查询，因为当你查询一个带有引用字段的文档时，Mongoose 会自动地使用 populate() 方法
// 填充引用字段，并在目标集合中查找对应的文档。这样，你就可以方便地在不同的集合之间建立关联关系。
    //回复所属的帖子ID
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    // 用户id
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 是否是父级评论
    isparent: {
        // 0代表父级 1代表子级
        type: Number,
    },
    // 父级评论id(当不是父级评论时，需要填写父级评论的id)
    parentid: {
        type: String
    },
    // 评论日期
    time: {
        type: Date,
        default: Date.now()
    },
    //评论内容
    content: {
        type: String
    },
    imgpath: {
        type: String,
    }
})

//创建集合
const Comment = mongoose.model('Comment', commentSchema);

//导出
module.exports = {
    Comment
}