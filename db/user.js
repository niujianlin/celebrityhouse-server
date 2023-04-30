//创建用户集合
const mongoose = require('mongoose');
// //加密模块
 const bcryptjs = require('bcryptjs');
// //引入joi模块
const Joi = require('joi');


//创建用户集合规则
const userSchema = new mongoose.Schema({
    account: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 20
    },
    password: {
        type: String,
        require: true,
        // select: false // 不在返回时显示password属性
    },
    email: {
        type: String,
        require: true        
    },
    avatar: {
        type: String,
    },
    intro: {
        type: String
    },
    gender: {
        type: String
    },
    registertime: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        require: true
    },
    state: {
        type: Number,
        // 如果字段是0，是启用状态
        default: 0
    },
    token: {
        type: String
    }
})
//创建集合
const User = mongoose.model('User', userSchema);

async function createUser() {
    const pass = bcryptjs.hashSync('123456', 10);
    // 创建一些数据，第一次导入初始化数据用的
    const user = await User.create({
        account: 'niujl',
        email: '123@qq.com',
        password: pass,
        role: 'admin',
        state: 0
    })
}
// createUser();

// // 验证用户信息
// const validateUser = user => {
//     //定义验证规则
//     const schema = {
//         username: Joi.string().min(2).max(12).required().error(new Error('username不符合验证规则')),
//         email: Joi.string().email(),
//         password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('email不符合验证规则')),
//         role: Joi.string().valid('normal', 'admin').required().error(new Error('角色值非法')),
//         state: Joi.number().valid(0,1).required().error(new Error('状态值非法'))
//     };
//     // 实施验证
//     return Joi.validate(user, schema);

// }

module.exports = {
    // User: User;与下面一样
    User,
    // validateUser
}

