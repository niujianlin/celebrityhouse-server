const express = require('express');
// 创建博客展示页面路由,返回的是路由对象
const router = express.Router();
//调用分类集合构造函数
const { Category } = require("../db/category");
const { User } = require('../db/user');


//二级路由：匹配/login（先匹配/category，后匹配/list）

router.get("/list", async (req, res) => {
    console.log('进入list')
    let categorys = await Category.find({});
    console.log(categorys)
    if (categorys) {
        res.send({
            code: 200,
            msg: "查询成功",
            categorys //categorys:categorys
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }
})

router.post("/add", async (req, res) => {
    let token = req.headers['authorization']
    if(!token){
        // 若未携带token,不允许
        return res.status(401).json({message: '没有提供Token'})
    }
    // 判断是否为管理员的token
    token = token.split(' ')[1]
    console.log("add到这没？？？,token = ", token)
    let admin = await User.findOne({token: token})
    console.log("admin = ",admin)
    if(!admin) {
        console.log("进来没")
        return res.status(401).json({message: '没有提供有效Token'})
    }
    let {role} = admin
    if(role === 'admin') {
        // 是管理员
        let users = await User.find()
        // console.log("所有User: \n", users)
        if(users){
            // res.send({
            //     code:200,
            //     msg: "查找全部用户成功",
            //     data: users
            // })
        }else {
            res.send({
                code: 500,
                msg: "查找全部用户失败"
            })
        }
    }else{
        res.send({
            code: 500,
            msg: "没有权限，查找全部用户失败"
        })
    }

    let category = await Category.create(req.body);
    if (category) {
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
})

// 删除接口 /category/_token/delete?id=xxx
router.delete("/delete", async (req, res) => {
    let token = req.headers['authorization']
    console.log("token是=", token)
    if(!token){
        // 若未携带token,不允许
        console.log("并未携带token!!!!")
        return res.status(401).json({message: '没有提供Token'})
    }
    // 判断是否为管理员的token
    token = token.split(' ')[1]
    let admin = await User.findOne({token: token})
    if(!admin) {
        return res.status(401).json({message: '没有提供有效Token'})
    }
    let {role} = admin
    if(role === 'admin') {
        // 是管理员
        let users = await User.find()
        // console.log("所有User: \n", users)
        if(users){
            // res.send({
            //     code:200,
            //     msg: "查找全部用户成功",
            //     data: users
            // })
        }else {
            res.send({
                code: 500,
                msg: "查找全部用户失败"
            })
        }
    }else{
        res.send({
            code: 500,
            msg: "没有权限，查找全部用户失败"
        })
    }


    let id = req.query.id;
    console.log("id", id);
    let category = await Category.findOneAndDelete({ _id: id })
    if (category) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
})

// 修改接口
router.put("/update", async (req, res) => {
    let token = req.headers['authorization']
    console.log("!!!!! token = ", token)
    console.log("!!!!! req = ", req)
    if(!token){
        // 若未携带token,不允许
        return res.status(401).json({message: '没有提供Token'})
    }
    // 判断是否为管理员的token
    token = token.split(' ')[1]
    let admin = await User.findOne({token: token})
    if(!admin) {
        return res.status(401).json({message: '没有提供有效Token'})
    }
    let {role} = admin
    if(role === 'admin') {
        // 是管理员
        let users = await User.find()
        // console.log("所有User: \n", users)
        if(users){
            // res.send({
            //     code:200,
            //     msg: "查找全部用户成功",
            //     data: users
            // })
        }else {
            res.send({
                code: 500,
                msg: "查找全部用户失败"
            })
        }
    }else{
        res.send({
            code: 500,
            msg: "没有权限，查找全部用户失败"
        })
    }


    let { id, name, description} = req.body
    let category = await Category.updateOne({ _id: id }, {
        name: name,
        description: description
    })
    if (category) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }
})

module.exports = router;